import React, { useState, useRef } from 'react';
import { Card, CardContent, Typography, Box, Button, Collapse, CircularProgress, CardActions, Popover, IconButton } from '@mui/material';
import Grid from '@mui/material/Grid';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import PieChartOutlineOutlinedIcon from '@mui/icons-material/PieChartOutlineOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const getHorizonLabel = (value) => {
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
    const option = horizonOptions.find(option => option.value === value);
    return option ? option.label : 'N/A';
};

const SummaryCard = ({ summary, inputs, investments }) => {
    const [expanded, setExpanded] = useState(false);
    const [explanation, setExplanation] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [explanationError, setExplanationError] = useState('');
    const explanationCache = useRef({});
    const [anchorEl, setAnchorEl] = useState(null);
    const [popoverIndex, setPopoverIndex] = useState(null);

    if (!summary) {
        return null;
    }

    const summaryItems = [
        {
            title: 'Total Savings',
            value: `£${summary.total_investment.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
            icon: <AccountBalanceWalletOutlinedIcon fontSize="large" color="primary" />,
            tooltip: 'The total amount allocated across all recommended accounts.'
        },
        {
            title: 'Net Annual Interest',
            value: `£${summary.net_annual_interest.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
            icon: <TrendingUpOutlinedIcon fontSize="large" color="primary" />,
            tooltip: 'The estimated interest earned in one year, after tax is deducted based on your Personal Savings Allowance.'
        },
        {
            title: 'Effective Net AER',
            value: `${summary.net_effective_aer.toFixed(2)}%`,
            icon: <PieChartOutlineOutlinedIcon fontSize="large" color="primary" />,
            tooltip: 'The weighted average annual equivalent rate across all investments, after tax.'
        },
        {
            title: 'Equivalent Pre Tax Rate',
            value: (() => {
                const { net_annual_interest, tax_free_allowance_remaining, tax_rate, total_investment } = summary;
                const equivalentPreTaxRate = ((net_annual_interest - tax_free_allowance_remaining) / (1 - tax_rate) + tax_free_allowance_remaining) / total_investment * 100;
                return `${equivalentPreTaxRate.toFixed(2)}%`;
            })(),
            icon: <AttachMoneyOutlinedIcon fontSize="large" sx={{ color: '#82ca9d' }} />,
            tooltip: 'This is the rate that you would need to find on a normal savings account to get the same after-tax return.'
        }
    ];

    const handleInfoClick = (event, idx) => {
        setAnchorEl(event.currentTarget);
        setPopoverIndex(idx);
    };
    const handlePopoverClose = () => {
        setAnchorEl(null);
        setPopoverIndex(null);
    };
    const open = Boolean(anchorEl);

    // Helper to create a stable cache key for the current plan
    const getPlanCacheKey = () => {
        return JSON.stringify({
            inputs,
            summary,
            investments
        });
    };

    const handleExplainClick = async () => {
        if (expanded) {
            setExpanded(false);
            return;
        }
        setExpanded(true);
        setExplanationError('');
        setExplanation('');
        setIsGenerating(true);

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

        const annualTax = (summary.gross_annual_interest || 0) - (summary.net_annual_interest || 0);
        console.log("Annual Tax: ", annualTax);

        const prompt = `\nYou are a friendly and helpful financial assistant called Quantify Lite. 
        Your goal is to explain a savings plan to a user in a simple and clear way.\n\n
        Here is the user's information and the savings plan our system generated:\n\n**User's Financial Snapshot:**\n*   **Annual Earnings:** £${(inputs.earnings || 0).toLocaleString()}\n*   **ISA Allowance Already Used This Year:** £${(inputs.isa_allowance_used || 0).toLocaleString()}\n*   **Savings Goal(s):**\n${savingsGoalsText}\n\n**Recommended Savings Plan:**\n*   **Total Amount to Invest:** £${(summary.total_investment || 0).toLocaleString()}\n*   **Your Estimated Net Annual Interest (after tax):** £${(summary.net_annual_interest || 0).toLocaleString()}\n*   **Gross Annual Interest (before tax):** £${(summary.gross_annual_interest || 0).toLocaleString()}\n*   **Estimated Annual Tax:** £${annualTax.toLocaleString()}\n\n**Where to Invest:**\n${investmentsText}\n\n---\n\n**Your Task:**\nExplain this savings plan to the user. Your tone should be encouraging and easy to understand for someone who may not be a financial expert.\n\nPlease structure your response as follows:\n1.  **Start with a positive and encouraging opening.** Acknowledge their goal.\n2.  **Briefly explain what the plan does:** How it allocates their savings to earn interest.\n3.  **Explain *why* this specific plan was chosen for them.** Connect it back to their earnings, ISA allowance, and savings horizon. For example, explain why ISAs were used (or not used), and why certain terms were chosen.\n4.  **Break down the "Where to Invest" section.** Explain what each product is in simple terms.\n5.  **Explain the interest and tax.** Clarify what "net annual interest" means for them.\n6.  **End with an encouraging closing statement, however do not title this section.**\n\n**Formatting Rules:**\n*   Use Markdown for formatting.\n*   Use headings (e.g., \`### My Plan in a Nutshell\`) and bullet points to keep it organized.\n*   Use **bold** text to highlight key numbers and terms.\n*   Keep paragraphs short and easy to read.\n*   Do not invent any new information. Stick to the data provided.\n*   Do not add a "Disclaimer" section.\n\nPlease generate the explanation now.\n`;

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

    return (
        <Card sx={{ mb: 4, borderRadius: 3 }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Grid container spacing={2} justifyContent="center" sx={{ mt: 1 }}>
                    {summaryItems.map((item, idx) => (
                        <Grid xs={12} sm={6} md={3} key={item.title}>
                            <Box sx={{ textAlign: 'center', p: 1 }}>
                                {item.icon}
                                <Typography 
                                    variant="h6" 
                                    component="h3" 
                                    sx={{ 
                                        mt: 1, 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center',
                                        ...(item.title === 'Equivalent Pre Tax Rate' ? { 
                                            color: '#82ca9d', 
                                            fontWeight: 'bold' 
                                        } : {})
                                    }}
                                >
                                    {item.title}
                                    <IconButton
                                        size="small"
                                        onClick={e => handleInfoClick(e, idx)}
                                        sx={{ ml: 0.5, p: 0.5 }}
                                    >
                                        <InfoOutlinedIcon sx={{ fontSize: '1rem', color: 'rgba(255, 255, 255, 0.7)' }} />
                                    </IconButton>
                                    <Popover
                                        open={open && popoverIndex === idx}
                                        anchorEl={anchorEl}
                                        onClose={handlePopoverClose}
                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                                        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                                        PaperProps={{ sx: { p: 2, maxWidth: 250 } }}
                                    >
                                        <Typography variant="body2">{item.tooltip}</Typography>
                                    </Popover>
                                </Typography>
                                <Typography 
                                    variant="h4" 
                                    color="text.primary"
                                    sx={item.title === 'Equivalent Pre Tax Rate' ? { 
                                        color: '#82ca9d', 
                                        fontWeight: 'bold' 
                                    } : {}}
                                >
                                    {item.value}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </CardContent>
            <CardActions sx={{ p: 0, borderTop: 1, borderColor: 'divider' }}>
                <Button
                    onClick={handleExplainClick}
                    fullWidth
                    disableElevation
                    variant="text"
                    sx={{
                        borderRadius: 0,
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        color: 'text.primary',
                        py: 1.5,
                        textTransform: 'none',
                    }}
                    endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    disabled={isGenerating}
                >
                    Explain this savings plan
                </Button>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <Box sx={{ p: { xs: 2, sm: 3 }, borderTop: 1, borderColor: 'divider' }}>
                    {explanationError && (
                        <Typography color="error" sx={{ mb: 2 }}>{explanationError}</Typography>
                    )}
                    <Box sx={{ minHeight: 40 }}>
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
                        {isGenerating && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                                <CircularProgress size={32} />
                            </Box>
                        )}
                    </Box>
                    <Button
                        onClick={handleExplainClick}
                        fullWidth
                        sx={{ mt: 2, py: 1 }}
                    >
                        <ExpandLessIcon />
                    </Button>
                </Box>
            </Collapse>
        </Card>
    );
};

export default SummaryCard; 