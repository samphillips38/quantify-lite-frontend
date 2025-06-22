import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Container, Box, Typography, Button, Grid,
    Card, CardContent, CardActionArea, Chip, Accordion,
    AccordionSummary, AccordionDetails, TextField,
    RadioGroup, FormControlLabel, Radio, FormLabel, FormControl
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SummaryCard from '../components/SummaryCard';
import { submitFeedback } from '../services/api';

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

const ResultsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const resultsData = location.state?.results;
    const inputs = location.state?.inputs;
    const investments = resultsData?.investments || [];
    const summary = resultsData?.summary || null;

    const [nps, setNps] = useState('');
    const [useful, setUseful] = useState('');
    const [improvements, setImprovements] = useState('');
    const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
    const [feedbackError, setFeedbackError] = useState('');

    const handleGoBack = () => {
        navigate('/');
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
            setFeedbackError('There was an error submitting your feedback. Please try again.');
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
                    Optimisation Results
                </Typography>
                <Typography variant="h6" color="text.secondary" align="center" sx={{ mb: 4 }}>
                    Here is your personalised investment plan. Click on an account to learn more.
                </Typography>

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
                                    <Typography color="error" sx={{ mt: 2 }}>
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