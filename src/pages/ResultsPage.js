import React, { useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Container, Box, Typography, Button, IconButton, Popover, Card, CardContent
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SummaryCard from '../components/SummaryCard';
import InputsCard from '../components/InputsCard';
import SimpleAnalysisSection from '../components/SimpleAnalysisSection';
import InvestmentsSection from '../components/InvestmentsSection';
import FeedbackSection from '../components/FeedbackSection';
import { submitFeedback } from '../services/api';
import { motion } from 'framer-motion';

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
    const allResults = location.state?.allResults;
    const isSimpleAnalysis = location.state?.isSimpleAnalysis;
    const sessionId = location.state?.sessionId;
    const investments = resultsData?.investments || [];
    const summary = resultsData?.summary || null;

    const [showIsaSlider] = useState(location.state?.showIsaSlider || false);
    const [anchorEl, setAnchorEl] = useState(null);

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
        const lowerBound = minInterest - (range * 2.5);
        const upperBound = maxInterest + (range * 0.8);
        return [Math.floor(lowerBound > 0 ? lowerBound : 0), Math.ceil(upperBound)];
    })();

    const [nps, setNps] = useState('');
    const [useful, setUseful] = useState('');
    const [improvements, setImprovements] = useState('');
    const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
    const [feedbackError, setFeedbackError] = useState('');
    const [age, setAge] = useState('');

    const handleInfoClick = useCallback((event) => {
        setAnchorEl(event.currentTarget);
    }, []);

    const handleInfoClose = useCallback(() => {
        setAnchorEl(null);
    }, []);

    const open = Boolean(anchorEl);
    const id = open ? 'equivalent-rate-info-popover' : undefined;

    const handleGoBack = useCallback(() => {
        navigate('/', { state: { inputs: inputs, isSimpleAnalysis: isSimpleAnalysis, showIsaSlider } });
    }, [navigate, inputs, isSimpleAnalysis, showIsaSlider]);

    const handleFeedbackSubmit = async (e) => {
        e.preventDefault();
        if (!nps || !useful) {
            setFeedbackError('Please fill in all required fields.');
            return;
        }
        
        if (!resultsData?.optimization_record_id) {
            setFeedbackError('Missing optimization record ID. Please go back and try again.');
            console.error('Missing optimization_record_id in resultsData:', resultsData);
            return;
        }
        
        setFeedbackError('');

        const feedbackData = {
            optimization_record_id: resultsData.optimization_record_id,
            session_id: sessionId,  // Link feedback to the user session
            nps_score: parseInt(nps, 10),
            useful: useful,
            improvements: improvements || undefined,
            ...(age && age.trim() !== '' && { age: parseInt(age, 10) }),
        };

        console.log('Submitting feedback with data:', feedbackData);

        try {
            await submitFeedback(feedbackData);
            setFeedbackSubmitted(true);
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message || 'Unknown error';
            console.error('Feedback submission error:', error);
            console.error('Error response data:', error.response?.data);
            setFeedbackError(`There was an error submitting your feedback. Please try again. \n${errorMessage}`);
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

    // Calculate the key numbers for the highlight section
    const netAnnualInterest = summary?.net_annual_interest || 0;
    const equivalentPreTaxRate = (() => {
        if (!summary) return 0;
        const { net_annual_interest, tax_free_allowance_remaining, tax_rate, total_investment } = summary;
        return ((net_annual_interest - tax_free_allowance_remaining) / (1 - tax_rate) + tax_free_allowance_remaining) / total_investment * 100;
    })();

    return (
        <Container maxWidth="lg" sx={{ py: { xs: 3, sm: 6 } }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Box sx={{ my: 4 }}>
                    {/* Punchy Results Highlight */}
                    <Typography 
                        variant="h3" 
                        component="h1" 
                        gutterBottom 
                        align="center"
                        sx={{ 
                            fontWeight: 700,
                            color: '#2D1B4E',
                            mb: 3,
                            letterSpacing: '-0.02em'
                        }}
                    >
                        Congratulations!
                    </Typography>
                    
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <Card sx={{ 
                            textAlign: 'center', 
                            mb: 6, 
                            p: { xs: 3, sm: 5 },
                            borderRadius: 3,
                            background: 'linear-gradient(135deg, rgba(155, 126, 222, 0.1) 0%, rgba(196, 181, 232, 0.1) 100%)',
                            border: '2px solid rgba(155, 126, 222, 0.2)'
                        }}>
                            <CardContent>
                                <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 4, color: '#2D1B4E' }}>
                                    Your Savings Could Earn You
                                </Typography>
                                <Box sx={{ 
                                    display: 'flex', 
                                    flexDirection: 'column',
                                    justifyContent: 'center', 
                                    alignItems: 'center', 
                                    gap: 2
                                }}>
                                    <Box sx={{ textAlign: 'center' }}>
                                        <Typography variant="h3" component="div" sx={{ 
                                            fontWeight: 700, 
                                            color: '#9B7EDE',
                                            mb: 2
                                        }}>
                                            £{netAnnualInterest.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} after tax
                                        </Typography>
                                    </Box>
                                    <Typography variant="body1" sx={{ color: '#6B5B8A', mb: 1 }}>
                                        equivalent to
                                    </Typography>
                                    <Box sx={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Typography variant="h3" component="div" sx={{ 
                                            fontWeight: 700, 
                                            color: '#9B7EDE'
                                        }}>
                                            {equivalentPreTaxRate.toFixed(2)}%
                                        </Typography>
                                        <IconButton
                                            size="small"
                                            onClick={handleInfoClick}
                                            sx={{ ml: 0.5, p: 0.5, color: '#9B7EDE' }}
                                        >
                                            <InfoOutlinedIcon sx={{ fontSize: '1rem' }} />
                                        </IconButton>
                                    </Box>
                                </Box>
                                <Typography variant="body1" sx={{ color: '#6B5B8A', mt: 3 }}>
                                    per year pre-tax rate
                                </Typography>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <Popover
                        id={id}
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleInfoClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}
                        PaperProps={{
                            sx: {
                                borderRadius: 3,
                                boxShadow: '0 8px 32px rgba(155, 126, 222, 0.2)',
                                border: '1px solid rgba(155, 126, 222, 0.2)',
                            }
                        }}
                    >
                        <Box sx={{ p: 3, maxWidth: 400 }}>
                            <Typography variant="h6" gutterBottom sx={{ color: '#2D1B4E', fontWeight: 600 }}>Equivalent Rate Explained</Typography>
                            <Typography variant="body2" sx={{ color: '#6B5B8A' }}>
                                This is the interest rate you would need to find on a standard savings account 
                                (without ISA benefits or our optimization strategies) to achieve the same after-tax returns 
                                as our optimized portfolio.
                            </Typography>
                        </Box>
                    </Popover>

                    <SimpleAnalysisSection
                        allResults={allResults}
                        isSimpleAnalysis={isSimpleAnalysis}
                        chartData={chartData}
                        yAxisDomain={yAxisDomain}
                        maxInterest={maxInterest}
                        optimalHorizon={optimalHorizon}
                        inputs={inputs}
                    />

                    <Typography variant="h5" component="h2" align="left" sx={{ mb: 3, mt: 8, fontWeight: 600, color: '#2D1B4E' }}>
                        Using these <span style={{ color: '#9B7EDE' }}>inputs</span>...
                    </Typography>
                    <InputsCard inputs={inputs} isSimpleAnalysis={isSimpleAnalysis} showIsaSlider={showIsaSlider} />

                    <Typography variant="h5" component="h2" align="left" sx={{ mb: 3, mt: 8, fontWeight: 600, color: '#2D1B4E' }}>
                        You can get these <span style={{ color: '#9B7EDE' }}>post-tax returns</span>...
                    </Typography>
                    <SummaryCard summary={summary} inputs={inputs} investments={investments} />

                    <InvestmentsSection investments={investments} />

                    <FeedbackSection
                        nps={nps}
                        setNps={setNps}
                        useful={useful}
                        setUseful={setUseful}
                        improvements={improvements}
                        setImprovements={setImprovements}
                        feedbackSubmitted={feedbackSubmitted}
                        feedbackError={feedbackError}
                        handleFeedbackSubmit={handleFeedbackSubmit}
                        age={age}
                        setAge={setAge}
                    />

                    <Box sx={{ mt: 6, textAlign: 'center' }}>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button
                                variant="outlined"
                                onClick={handleGoBack}
                                startIcon={<ArrowBackIcon />}
                                size="large"
                            >
                                Go Back
                            </Button>
                        </motion.div>
                    </Box>
                </Box>
            </motion.div>
        </Container>
    );
};

export default ResultsPage; 