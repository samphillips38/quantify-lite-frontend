import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Container, Box, Typography, Button, IconButton, Popover
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SummaryCard from '../components/SummaryCard';
import InputsCard from '../components/InputsCard';
import SimpleAnalysisSection from '../components/SimpleAnalysisSection';
import InvestmentsSection from '../components/InvestmentsSection';
import FeedbackSection from '../components/FeedbackSection';
import { submitFeedback } from '../services/api';
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

    const handleInfoClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleInfoClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'equivalent-rate-info-popover' : undefined;

    const handleGoBack = () => {
        navigate('/', { state: { inputs: inputs, isSimpleAnalysis: isSimpleAnalysis, showIsaSlider } });
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
            age: age,
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

    // Calculate the key numbers for the highlight section
    const netAnnualInterest = summary?.net_annual_interest || 0;
    const equivalentPreTaxRate = (() => {
        if (!summary) return 0;
        const { net_annual_interest, tax_free_allowance_remaining, tax_rate, total_investment } = summary;
        return ((net_annual_interest - tax_free_allowance_remaining) / (1 - tax_rate) + tax_free_allowance_remaining) / total_investment * 100;
    })();

    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 4 }}>
                {/* Punchy Results Highlight */}

                <Typography variant="h3" component="h1" gutterBottom align="center">
                    Ka-Ching!
                </Typography>
                <Box sx={{ 
                    textAlign: 'center', 
                    mb: 6, 
                    p: 4, 
                    backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                    borderRadius: 3,
                    border: '2px solid rgba(130, 202, 157, 0.3)'
                }}>
                    <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                        Your Savings Could Earn You
                    </Typography>
                    <Box sx={{ 
                        display: 'flex', 
                        flexDirection: { xs: 'column', md: 'row' },
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        gap: { xs: 1, md: 3 }
                    }}>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h3" component="div" sx={{ 
                                fontWeight: 'bold', 
                                color: '#82ca9d',
                                textShadow: '0 0 20px rgba(130, 202, 157, 0.3)'
                            }}>
                                £{netAnnualInterest.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                            </Typography>
                        </Box>
                        <Typography variant="h8" sx={{ color: 'text.secondary' }}>
                            after tax, equivalent to a
                        </Typography>
                        <Box sx={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography variant="h3" component="div" sx={{ 
                                fontWeight: 'bold', 
                                color: '#82ca9d',
                                textShadow: '0 0 20px rgba(130, 202, 157, 0.3)'
                            }}>
                                {equivalentPreTaxRate.toFixed(2)}%
                            </Typography>
                            <IconButton
                                size="small"
                                onClick={handleInfoClick}
                                sx={{ ml: 0.5, p: 0.5 }}
                            >
                                <InfoOutlinedIcon sx={{ fontSize: '1rem', color: 'rgba(255, 255, 255, 0.7)' }} />
                            </IconButton>
                        </Box>
                    </Box>
                    <Typography variant="h8" sx={{ color: 'text.secondary', mt: 2 }}>
                        per year pre-tax rate
                    </Typography>
                </Box>

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
                >
                    <Box sx={{ p: 2, maxWidth: 400, border: '1px solid #ddd', borderRadius: '4px', boxShadow: 3 }}>
                        <Typography variant="h6" gutterBottom>Equivalent Rate Explained</Typography>
                        <Typography variant="body2">
                            This is the interest rate you would need to find on a standard savings account 
                            (without ISA benefits or our optimization strategies) to achieve the same after-tax returns 
                            as our optimized portfolio.
                        </Typography>
                    </Box>
                </Popover>
                {/* <Typography variant="h6" color="text.secondary" align="center" sx={{ mb: 4 }}>
                    This is how much money your savings could make for you <span style={{ textDecoration: 'underline' }}>after</span> tax. It is different depending on how long you lock it away.
                </Typography> */}

                <SimpleAnalysisSection
                    allResults={allResults}
                    isSimpleAnalysis={isSimpleAnalysis}
                    chartData={chartData}
                    yAxisDomain={yAxisDomain}
                    maxInterest={maxInterest}
                    optimalHorizon={optimalHorizon}
                    inputs={inputs}
                    ref={ref}
                    width={width}
                    height={height}
                    getHorizonLabel={getHorizonLabel}
                />

                <Typography variant="h4" component="h2" align="left" sx={{ mb: 2, mt: 8 }}>
                    Using these <span style={{ color: '#82ca9d' }}>inputs</span>...
                </Typography>
                <InputsCard inputs={inputs} isSimpleAnalysis={isSimpleAnalysis} showIsaSlider={showIsaSlider} />

                <Typography variant="h4" component="h2" align="left" sx={{ mb: 2, mt: 8 }}>
                    You can get these <span style={{ color: '#82ca9d' }}>post-tax returns</span>...
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