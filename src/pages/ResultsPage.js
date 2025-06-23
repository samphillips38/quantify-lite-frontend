import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Container, Box, Typography, Button, Grid,
    Card, CardContent, CardActionArea, Chip, Accordion,
    AccordionSummary, AccordionDetails, TextField,
    RadioGroup, FormControlLabel, Radio, FormLabel, FormControl, Paper, Modal, CircularProgress, Backdrop, Fade
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SummaryCard from '../components/SummaryCard';
import { submitFeedback } from '../services/api';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList
} from 'recharts';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const horizonOptions = [
    { value: 0, label: 'Easy access' },
    { value: 1, label: '1 month' },
    { value: 3, label: '3 months' },
    { value: 6, label: '6 months' },
    { value: 12, label: '1 year' },
    { value: 24, label: '2 years' },
    { value: 36, label: '3 years' },
    { value: 60, label: '5 years' }
];

const getHorizonLabel = (value) => {
    const option = horizonOptions.find(option => option.value === value);
    return option ? option.label : 'N/A';
};

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'min(90%, 700px)',
    maxHeight: '80vh',
    overflowY: 'auto',
    bgcolor: 'background.paper',
    border: '1px solid #000',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
    color: 'text.primary',
    background: '#1e1e1e'
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <Paper elevation={3} sx={{ p: 1.5, backgroundColor: 'rgba(30, 30, 30, 0.95)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: 2 }}>
                <Box>
                    {data.investments.length > 0 ? data.investments.map((inv, index) => (
                        <Typography key={index} variant="body2" sx={{ color: '#e0e0e0', lineHeight: 1.6 }}>
                            {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(inv.amount)} @ {inv.aer}% {inv.is_isa ? '(ISA)' : ''}
                        </Typography>
                    )) : (
                        <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#e0e0e0' }}>
                            No specific investments.
                        </Typography>
                    )}
                </Box>
            </Paper>
        );
    }
    return null;
};

const ResultsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const resultsData = location.state?.results;
    const inputs = location.state?.inputs;
    const allResults = location.state?.allResults;
    const isSimpleAnalysis = location.state?.isSimpleAnalysis;
    const investments = resultsData?.investments || [];
    const summary = resultsData?.summary || null;

    // In-memory cache for explanations
    const explanationCache = useRef({});

    const chartData = (isSimpleAnalysis && allResults)
        ? allResults.map(r => ({
            name: getHorizonLabel(r.inputs.savings_goals[0].horizon),
            "Net Annual Interest": r.data.summary?.net_annual_interest || 0,
            investments: r.data.investments || [],
        }))
        : [];

    const interestValues = chartData.map(d => d["Net Annual Interest"]);
    const minInterest = Math.min(...interestValues);
    const maxInterest = Math.max(...interestValues);

    const optimalHorizon = chartData.find(d => d["Net Annual Interest"] === maxInterest);

    const yAxisDomain = (() => {
        if (interestValues.length === 0) {
            return [0, 'auto'];
        }
        const range = maxInterest - minInterest;
        if (range === 0) {
            if (maxInterest === 0) return [0, 100];
            return [Math.floor(maxInterest * 0.8), Math.ceil(maxInterest * 1.2)];
        }
        const lowerBound = minInterest - (range * 0.2);
        const upperBound = maxInterest + (range * 0.2);
        return [Math.floor(lowerBound > 0 ? lowerBound : 0), Math.ceil(upperBound)];
    })();

    const [nps, setNps] = useState('');
    const [useful, setUseful] = useState('');
    const [improvements, setImprovements] = useState('');
    const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
    const [feedbackError, setFeedbackError] = useState('');
    const [explanation, setExplanation] = useState('');
    const [isExplainModalOpen, setIsExplainModalOpen] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [explanationError, setExplanationError] = useState('');

    // Helper to create a stable cache key for the current plan
    const getPlanCacheKey = () => {
        // Only include relevant fields for uniqueness
        return JSON.stringify({
            inputs,
            summary,
            investments
        });
    };

    const handleGoBack = () => {
        navigate('/', { state: { inputs: inputs, isSimpleAnalysis: isSimpleAnalysis } });
    };

    const handleExplainClick = async () => {
        setIsGenerating(true);
        setExplanationError('');
        setExplanation('');
        setIsExplainModalOpen(true);

        const openAiApiKey = process.env.REACT_APP_OPENAI_API_KEY;

        if (!openAiApiKey) {
            setExplanationError("The AI explanation feature is not configured. Please add an OpenAI API key.");
            setIsGenerating(false);
            return;
        }

        if (!inputs || !summary) {
            setExplanationError("Could not generate an explanation because key financial data is missing. Please go back and re-submit your information.");
            setIsGenerating(false);
            return;
        }

        // Check cache first
        const cacheKey = getPlanCacheKey();
        if (explanationCache.current[cacheKey]) {
            setExplanation(explanationCache.current[cacheKey]);
            setIsGenerating(false);
            return;
        }

        const savingsGoalsText = (inputs.savings_goals || []).map(goal => `- £${(goal.amount || 0).toLocaleString()} for ${getHorizonLabel(goal.horizon)}`).join('\n');
        const investmentsText = (investments || []).map(inv => `- Invest £${(parseFloat(inv.amount) || 0).toLocaleString()} in ${inv.account_name || 'N/A'} at ${inv.aer || 'N/A'}% AER. This is a ${inv.is_isa ? 'ISA' : 'standard'} account from ${inv.platform || 'N/A'} with a term of ${inv.term || 'N/A'}.`).join('\n');

        const prompt = `
You are a friendly and helpful financial assistant called Quantify Lite. Your goal is to explain a savings plan to a user in a simple, clear, and encouraging way.

Here is the user's information and the savings plan our system generated:

**User's Financial Snapshot:**
*   **Annual Earnings:** £${(inputs.earnings || 0).toLocaleString()}
*   **ISA Allowance Already Used This Year:** £${(inputs.isa_allowance_used || 0).toLocaleString()}
*   **Savings Goal(s):**
${savingsGoalsText}

**Recommended Savings Plan:**
*   **Total Amount to Invest:** £${(summary.total_investment || 0).toLocaleString()}
*   **Your Estimated Net Annual Interest (after tax):** £${(summary.net_annual_interest || 0).toLocaleString()}
*   **Gross Annual Interest (before tax):** £${(summary.gross_annual_interest || 0).toLocaleString()}
*   **Estimated Annual Tax:** £${(summary.annual_tax || 0).toLocaleString()}

**Where to Invest:**
${investmentsText}

---

**Your Task:**
Explain this savings plan to the user. Your tone should be encouraging and easy to understand for someone who may not be a financial expert.

Please structure your response as follows:
1.  **Start with a positive and encouraging opening.** Acknowledge their goal.
2.  **Briefly explain what the plan does:** How it allocates their savings to earn interest.
3.  **Explain *why* this specific plan was chosen for them.** Connect it back to their earnings, ISA allowance, and savings horizon. For example, explain why ISAs were used (or not used), and why certain terms were chosen.
4.  **Break down the \"Where to Invest\" section.** Explain what each product is in simple terms.
5.  **Explain the interest and tax.** Clarify what \"net annual interest\" means for them.
6.  **End with an encouraging closing statement.**

**Formatting Rules:**
*   Use Markdown for formatting.
*   Use headings (e.g., \`### My Plan in a Nutshell\`) and bullet points to keep it organized.
*   Use **bold** text to highlight key numbers and terms.
*   Keep paragraphs short and easy to read.
*   Do not invent any new information. Stick to the data provided.
*   Do not add a \"Disclaimer\" section.

Please generate the explanation now.
`;

        try {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${openAiApiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-4o',
                    messages: [{ role: 'user', content: prompt }],
                    temperature: 0.6,
                    max_tokens: 1200,
                    stream: true
                })
            });

            if (!response.ok || !response.body) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');
            let done = false;
            let fullText = '';

            while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;
                if (value) {
                    const chunk = decoder.decode(value, { stream: true });
                    // OpenAI SSE: each line is a JSON object prefixed by 'data: '
                    const lines = chunk.split('\n').filter(line => line.trim().startsWith('data: '));
                    for (const line of lines) {
                        const jsonStr = line.replace('data: ', '').trim();
                        if (jsonStr === '[DONE]') {
                            done = true;
                            break;
                        }
                        try {
                            const data = JSON.parse(jsonStr);
                            const content = data.choices?.[0]?.delta?.content;
                            if (content) {
                                fullText += content;
                                setExplanation(prev => prev + content);
                            }
                        } catch (e) {
                            // Ignore malformed lines
                        }
                    }
                }
            }
            // Save to cache
            explanationCache.current[cacheKey] = fullText;
        } catch (error) {
            console.error("Error streaming explanation from OpenAI:", error);
            setExplanationError(`Sorry, we couldn't generate an explanation right now. Please try again later. Error: ${error.message}`);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleFeedbackSubmit = async (e) => {
        e.preventDefault();
        if (!nps || !useful) {
            setFeedbackError('Please fill in all required fields.');
            return;
        }
        setFeedbackError('');

        const feedbackData = {
            optimization_record_id: resultsData.optimization_record_id,
            nps_score: parseInt(nps, 10),
            useful: useful,
            improvements: improvements,
        };

        try {
            await submitFeedback(feedbackData);
            setFeedbackSubmitted(true);
        } catch (error) {
            setFeedbackError(`There was an error submitting your feedback. Please try again. \n${error.message}`);
            console.error(error);
        }
    };

    if (!summary) {
        return (
            <Container maxWidth="md">
                <Box sx={{ my: 4, textAlign: 'center' }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Optimisation Results
                    </Typography>
                    <Typography>
                        No results to display. Please go back and submit your details.
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={handleGoBack}
                        startIcon={<ArrowBackIcon />}
                        sx={{ mt: 3 }}
                    >
                        Go Back
                    </Button>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 4 }}>
                <Typography variant="h3" component="h1" gutterBottom align="center">
                    Ca-Ching!
                </Typography>
                <Typography variant="h6" color="text.secondary" align="center" sx={{ mb: 4 }}>
                    This is how much money your savings could make for you after tax. It is different depending on how long you lock it away.
                </Typography>

                {isSimpleAnalysis && allResults && (
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" component="h2" align="center" sx={{ mb: 2 }}>
                            How long should I lock it away for?
                        </Typography>
                        <Box sx={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={chartData}
                                    margin={{ top: 0, right: 0, left: 20, bottom: 0 }}
                                >
                                    <XAxis 
                                        dataKey="name" 
                                        tick={{ fill: 'white', fontSize: 12 }}
                                        angle={-45}
                                        textAnchor="end"
                                        interval={0}
                                        height={60}
                                    />
                                    <YAxis
                                        domain={yAxisDomain}
                                        tick={false}
                                        axisLine={false}
                                        width={0}
                                    />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}/>
                                    <Bar dataKey="Net Annual Interest" fill="#8884d8">
                                        <LabelList
                                            dataKey="Net Annual Interest"
                                            position="top"
                                            style={{ fill: 'white', fontSize: 12 }}
                                            formatter={(value) => `£${Math.round(value).toLocaleString()}`}
                                        />
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry["Net Annual Interest"] === maxInterest ? '#82ca9d' : '#8884d8'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </Box>
                        {optimalHorizon && (
                            <Box sx={{ mt: 8, mb: 5 }}>
                                <Typography variant="h3" align="center" sx={{ mb: 3 }}>
                                    For the best return use
                                </Typography>
                                <Typography variant="h1" align="center" sx={{ color: '#82ca9d', fontWeight: 'bold', mb: 3 }}>
                                    {optimalHorizon.name}
                                </Typography>
                                <Typography variant="h6" align="center">
                                    And invest your <strong>£{inputs.savings_goals[0].amount.toLocaleString()}</strong> as follows:
                                </Typography>
                            </Box>
                        )}
                    </Box>
                )}

                {inputs && (
                    <Accordion sx={{ mb: 4, borderRadius: 2, '&.Mui-expanded:before': { opacity: 1 } }}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography variant="h6">Optimisation Inputs</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Typography variant="body1">
                                    <strong>Annual Earnings:</strong> £{inputs.earnings.toLocaleString()}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>ISA Allowance Used:</strong> £{inputs.isa_allowance_used.toLocaleString()}
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                    <strong>Savings Goals:</strong>
                                </Typography>
                                <Box sx={{ pl: 2 }}>
                                    {inputs.savings_goals.map((goal, index) => (
                                        <Typography key={index} variant="body1">
                                            - £{goal.amount.toLocaleString()} for {getHorizonLabel(goal.horizon)}
                                        </Typography>
                                    ))}
                                </Box>
                            </Box>
                        </AccordionDetails>
                    </Accordion>
                )}

                <SummaryCard summary={summary} />

                <Box sx={{ mt: 3, mb: 4, textAlign: 'center' }}>
                    <Button
                        variant="contained"
                        onClick={handleExplainClick}
                        disabled={isGenerating}
                        size="large"
                    >
                        {isGenerating ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Explain this savings plan'}
                    </Button>
                </Box>

                <Grid container spacing={4} justifyContent="flex-start">
                    {investments.map((item, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <CardActionArea component="a" href={item.url} target="_blank" rel="noopener noreferrer" sx={{ borderRadius: 2, height: '100%' }}>
                                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2 }}>
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                            <Typography gutterBottom variant="h5" component="h2" sx={{ pr: 1 }}>
                                                {item.account_name}
                                            </Typography>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                                                <Chip
                                                    label={item.is_isa ? 'ISA' : 'Standard'}
                                                    size="small"
                                                />
                                                <Chip
                                                    label={item.platform}
                                                    size="small"
                                                    variant="outlined"
                                                />
                                            </Box>
                                        </Box>
                                        <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                                            <strong>Amount to Invest:</strong> £{parseFloat(item.amount).toLocaleString()}
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                                            <strong>AER:</strong> {item.aer}%
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary">
                                            <strong>Term:</strong> {item.term}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </CardActionArea>
                        </Grid>
                    ))}
                </Grid>

                {!feedbackSubmitted ? (
                    <Card sx={{ mt: 4, p: 2 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                We'd love your feedback!
                            </Typography>
                            <form onSubmit={handleFeedbackSubmit}>
                                <FormControl component="fieldset" margin="normal" required fullWidth>
                                    <FormLabel component="legend">On a scale of 0-10, how likely are you to recommend us to a friend or colleague?</FormLabel>
                                    <RadioGroup
                                        row
                                        aria-label="nps"
                                        name="nps"
                                        value={nps}
                                        onChange={(e) => setNps(e.target.value)}
                                    >
                                        {[...Array(11).keys()].map(i => (
                                            <FormControlLabel key={i} value={i} control={<Radio />} label={i} />
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                                <FormControl component="fieldset" margin="normal" required>
                                    <FormLabel component="legend">Did you find these recommendations useful?</FormLabel>
                                    <RadioGroup
                                        row
                                        aria-label="useful"
                                        name="useful"
                                        value={useful}
                                        onChange={(e) => setUseful(e.target.value)}
                                    >
                                        <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                                        <FormControlLabel value="no" control={<Radio />} label="No" />
                                    </RadioGroup>
                                </FormControl>
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="How could we improve the recommendations?"
                                    multiline
                                    rows={4}
                                    value={improvements}
                                    onChange={(e) => setImprovements(e.target.value)}
                                />
                                {feedbackError && (
                                    <Typography color="error" sx={{ mt: 2, whiteSpace: 'pre-wrap' }}>
                                        {feedbackError}
                                    </Typography>
                                )}
                                <Box sx={{ mt: 2 }}>
                                    <Button type="submit" variant="contained">
                                        Submit Feedback
                                    </Button>
                                </Box>
                            </form>
                        </CardContent>
                    </Card>
                ) : (
                    <Typography variant="h6" align="center" sx={{ mt: 4 }}>
                        Thank you for your feedback!
                    </Typography>
                )}

                <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Button
                        variant="outlined"
                        onClick={handleGoBack}
                        startIcon={<ArrowBackIcon />}
                    >
                        Go Back
                    </Button>
                </Box>
            </Box>

            <Modal
                open={isExplainModalOpen}
                onClose={() => setIsExplainModalOpen(false)}
                aria-labelledby="explanation-modal-title"
                aria-describedby="explanation-modal-description"
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={isExplainModalOpen}>
                    <Box sx={modalStyle}>
                        <Typography id="explanation-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
                            Your Savings Plan Explained
                        </Typography>
                        <Box id="explanation-modal-description">
                            {explanationError && (
                                <Typography color="error" sx={{ mt: 2 }}>{explanationError}</Typography>
                            )}
                            <Box sx={{ display: 'flex', alignItems: 'flex-end', minHeight: 40 }}>
                                <Box sx={{ flex: 1 }}>
                                    {explanation && (
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                h3: ({ node, ...props }) => <Typography variant="h5" gutterBottom {...props} />,
                                                p: ({ node, ...props }) => <Typography variant="body1" paragraph {...props} />,
                                                li: ({ node, ...props }) => <li style={{ marginBottom: '8px' }}><Typography variant="body1" component="span" {...props} /></li>,
                                            }}
                                        >
                                            {explanation}
                                        </ReactMarkdown>
                                    )}
                                </Box>
                                {isGenerating && (
                                    <CircularProgress size={16} sx={{ ml: 1, mb: 0.5 }} />
                                )}
                            </Box>
                        </Box>
                        <Button onClick={() => setIsExplainModalOpen(false)} sx={{ mt: 2 }}>Close</Button>
                    </Box>
                </Fade>
            </Modal>
        </Container>
    );
};

export default ResultsPage; 