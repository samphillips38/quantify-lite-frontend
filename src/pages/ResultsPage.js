import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Container, Box, Typography, Button,
    Card, CardContent, CardActionArea, Chip, TextField,
    RadioGroup, FormControlLabel, Radio, FormLabel, FormControl, Paper
} from '@mui/material';
import Grid from '@mui/material/Grid';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SummaryCard from '../components/SummaryCard';
import InputsCard from '../components/InputsCard';
import { submitFeedback } from '../services/api';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList
} from 'recharts';
import useResizeObserver from 'use-resize-observer';

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
    const { ref, width = 0, height = 0 } = useResizeObserver();
    const resultsData = location.state?.results;
    const inputs = location.state?.inputs;
    const allResults = location.state?.allResults;
    const isSimpleAnalysis = location.state?.isSimpleAnalysis;
    const investments = resultsData?.investments || [];
    const summary = resultsData?.summary || null;

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

    const handleGoBack = () => {
        navigate('/', { state: { inputs: inputs, isSimpleAnalysis: isSimpleAnalysis } });
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
                    Ka-Ching!
                </Typography>
                <Typography variant="h6" color="text.secondary" align="center" sx={{ mb: 4 }}>
                    This is how much money your savings could make for you after tax. It is different depending on how long you lock it away.
                </Typography>

                {isSimpleAnalysis && allResults && (
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" component="h2" align="center" sx={{ mb: 2 }}>
                            How long should I lock it away for?
                        </Typography>
                        <Box ref={ref} sx={{ width: '100%', height: 300 }}>
                            {width > 0 && height > 0 && (
                                <ResponsiveContainer width={Math.round(width)} height={Math.round(height)}>
                                    <BarChart
                                        data={chartData}
                                        margin={{ top: 0, right: 0, left: 20, bottom: 1 }}
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
                            )}
                        </Box>
                        {optimalHorizon && (
                            <Box sx={{ mt: 8, mb: 5 }}>
                                <Typography variant="h5" align="center">
                                    For the best return use
                                </Typography>
                                <Typography variant="h1" align="center" sx={{ color: '#82ca9d', fontWeight: 'bold', mb: 3 }}>
                                    {optimalHorizon.name}
                                </Typography>
                                <Typography variant="h5" align="center">
                                    And invest your <strong>£{inputs.savings_goals[0].amount.toLocaleString()}</strong> as follows:
                                </Typography>
                            </Box>
                        )}
                    </Box>
                )}

                <Typography variant="h4" component="h2" align="left" sx={{ mb: 2 }}>
                    With these <span style={{ color: '#82ca9d' }}>inputs</span>...
                </Typography>
                <InputsCard inputs={inputs} />

                <Typography variant="h4" component="h2" align="left" sx={{ mb: 2 }}>
                    You can get these <span style={{ color: '#82ca9d' }}>post-tax returns</span>...
                </Typography>
                <SummaryCard summary={summary} inputs={inputs} investments={investments} />

                <Typography variant="h4" component="h2" align="left" sx={{ mb: 2 }}>
                    {investments.length === 1 ? (
                        <>By saving in this{' '}
                            <span style={{ color: '#82ca9d', fontWeight: 'bold' }}>account</span>...
                        </>
                    ) : (
                        <>By saving in these{' '}
                            <span style={{ color: '#82ca9d', fontWeight: 'bold' }}>{investments.length} accounts</span>...
                        </>
                    )}
                </Typography>
                <Grid container spacing={4}>
                    {investments.map((item, index) => (
                        <Grid xs={12} sm={6} md={4} key={index}>
                            <CardActionArea component="a" href={item.url} target="_blank" rel="noopener noreferrer" sx={{ width: '100%', height: '100%' }}>
                                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2.5 }}>
                                        {/* Card Header */}
                                        <Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="subtitle1" color="text.secondary" sx={{ fontWeight: 'medium' }}>
                                                    {item.platform}
                                                </Typography>
                                                <Chip label={item.is_isa ? 'ISA' : 'Standard'} size="small" variant="outlined" />
                                            </Box>
                                            <Typography gutterBottom variant="h5" component="h2" sx={{ fontWeight: 'bold', wordWrap: 'break-word', minHeight: '2.8em', lineHeight: '1.4em', my: 1.5 }}>
                                                {item.account_name}
                                            </Typography>
                                        </Box>

                                        {/* Financial Details */}
                                        <Box sx={{ mt: 'auto', pt: 2, borderTop: 1, borderColor: 'divider' }}>
                                            <Grid container spacing={0.5}>
                                                <Grid item xs={7}>
                                                    <Typography variant="body1" color="text.secondary">Amount to Invest:</Typography>
                                                </Grid>
                                                <Grid item xs={5} sx={{ textAlign: 'right' }}>
                                                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>£{parseFloat(item.amount).toLocaleString()}</Typography>
                                                </Grid>
                                                <Grid item xs={7}>
                                                    <Typography variant="body1" color="text.secondary">AER:</Typography>
                                                </Grid>
                                                <Grid item xs={5} sx={{ textAlign: 'right' }}>
                                                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{item.aer}%</Typography>
                                                </Grid>
                                                <Grid item xs={7}>
                                                    <Typography variant="body1" color="text.secondary">Term:</Typography>
                                                </Grid>
                                                <Grid item xs={5} sx={{ textAlign: 'right' }}>
                                                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{item.term}</Typography>
                                                </Grid>
                                            </Grid>
                                        </Box>
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
        </Container>
    );
};

export default ResultsPage; 