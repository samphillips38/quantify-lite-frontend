import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Container, Box, Typography, Button
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
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
    const [age, setAge] = useState('');

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

    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 4 }}>
                <Typography variant="h3" component="h1" gutterBottom align="center">
                    Ka-Ching!
                </Typography>
                <Typography variant="h6" color="text.secondary" align="center" sx={{ mb: 4 }}>
                    This is how much money your savings could make for you after tax. It is different depending on how long you lock it away.
                </Typography>

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
                <InputsCard inputs={inputs} isSimpleAnalysis={isSimpleAnalysis} />

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