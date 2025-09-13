import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { optimiseSavings } from '../services/api';
import {
    Container, Box, Typography, Paper, CircularProgress
} from '@mui/material';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { motion } from 'framer-motion';

const MOCK_DATA_ENABLED = false; // Set to false to use live data

const LoadingPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);
    const [optimizationData, setOptimizationData] = useState(null);
    const [error, setError] = useState(null);

    const loadingSteps = [
        "Analyzing your financial profile...",
        "Scanning thousands of savings accounts...",
        "Calculating tax implications...",
        "Optimizing across time horizons...",
        "Finding the best rates for you...",
        "Finalizing your personalized plan..."
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.5,
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5 }
        }
    };

    const pulseVariants = {
        pulse: {
            scale: [1, 1.1, 1],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    const floatingVariants = {
        float: {
            y: [-10, 10, -10],
            transition: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    useEffect(() => {
        const startTime = Date.now();
        const minLoadingTime = 2000; // 2 seconds minimum

        // Simulate progress through loading steps
        const stepInterval = setInterval(() => {
            setCurrentStep(prev => {
                const nextStep = prev + 1;
                if (nextStep < loadingSteps.length) {
                    setLoadingProgress((nextStep / loadingSteps.length) * 100);
                    return nextStep;
                }
                return prev;
            });
        }, 500);

        // Start the actual optimization
        const performOptimization = async () => {
            try {
                const { inputs, isSimpleAnalysis } = location.state;
                
                if (isSimpleAnalysis) {
                    const horizonsToTest = [0, 6, 12, 36, 60];
                    const promises = horizonsToTest.map(horizon => {
                        const data = {
                            earnings: parseFloat(inputs.earnings),
                            savings_goals: [{
                                amount: parseFloat(inputs.savings_goals[0].amount),
                                horizon: horizon,
                            }],
                            isa_allowance_used: inputs.isa_allowance_used,
                        };
                        return optimiseSavings(data, MOCK_DATA_ENABLED).then(result => ({ data: result.data, inputs: data }));
                    });

                    const results = await Promise.all(promises);
                    const bestResult = results.reduce((best, current) => {
                        const currentInterest = current.data.summary?.net_annual_interest || 0;
                        const bestInterest = best.data.summary?.net_annual_interest || 0;
                        return currentInterest > bestInterest ? current : best;
                    });
                    
                    setOptimizationData({
                        results: bestResult.data,
                        inputs: bestResult.inputs,
                        allResults: results,
                        isSimpleAnalysis: true
                    });
                } else {
                    const data = {
                        earnings: parseFloat(inputs.earnings),
                        savings_goals: inputs.savings_goals.map(goal => ({
                            amount: parseFloat(goal.amount),
                            horizon: goal.horizon,
                        })),
                        isa_allowance_used: inputs.isa_allowance_used,
                    };

                    const result = await optimiseSavings(data, MOCK_DATA_ENABLED);
                    setOptimizationData({
                        results: result.data,
                        inputs: data,
                        isSimpleAnalysis: false
                    });
                }
            } catch (error) {
                console.error("Optimisation failed", error);
                setError(error);
            }
        };

        // Start optimization immediately
        performOptimization();

        // Ensure minimum loading time and handle completion
        const checkCompletion = () => {
            const elapsedTime = Date.now() - startTime;
            const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
            
            setTimeout(() => {
                clearInterval(stepInterval);
                setLoadingProgress(100);
                setCurrentStep(loadingSteps.length - 1);
                
                // Navigate to results after a brief delay
                setTimeout(() => {
                    if (optimizationData) {
                        navigate('/results', { state: optimizationData });
                    } else if (error) {
                        // Handle error case - could navigate back to input page
                        navigate('/', { state: { error: 'Optimization failed. Please try again.' } });
                    }
                }, 500);
            }, remainingTime);
        };

        // Check completion periodically
        const completionInterval = setInterval(() => {
            if (optimizationData || error) {
                clearInterval(completionInterval);
                checkCompletion();
            }
        }, 100);

        return () => {
            clearInterval(stepInterval);
            clearInterval(completionInterval);
        };
    }, [location.state, navigate, optimizationData, error]);

    return (
        <Container maxWidth="md">
            <Paper elevation={3} sx={{ my: { xs: 2, sm: 4 }, p: { xs: 2, sm: 4 }, borderRadius: 3 }}>
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <motion.div variants={floatingVariants} animate="float">
                            <DotLottieReact
                                src="/animations/ThinkingCharts.lottie"
                                loop
                                autoplay
                                style={{ height: '200px', width: '200px', margin: 'auto', marginBottom: '24px' }}
                            />
                        </motion.div>
                        
                        <motion.div variants={itemVariants}>
                            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                                Optimizing Your Savings...
                            </Typography>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                                We're analyzing thousands of savings accounts to find the perfect plan for you
                            </Typography>
                        </motion.div>

                        {/* Animated progress bar */}
                        <motion.div variants={itemVariants}>
                            <Box sx={{ width: '100%', mb: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Progress
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {Math.round(loadingProgress)}%
                                    </Typography>
                                </Box>
                                <Box sx={{ width: '100%', height: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden' }}>
                                    <motion.div
                                        style={{
                                            height: '100%',
                                            backgroundColor: '#82ca9d',
                                            borderRadius: 4,
                                        }}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${loadingProgress}%` }}
                                        transition={{ duration: 0.5, ease: "easeOut" }}
                                    />
                                </Box>
                            </Box>
                        </motion.div>

                        {/* Current step indicator */}
                        <motion.div variants={itemVariants}>
                            <Box sx={{ mb: 3 }}>
                                <motion.div
                                    variants={pulseVariants}
                                    animate="pulse"
                                >
                                    <CircularProgress
                                        size={40}
                                        thickness={4}
                                        sx={{
                                            color: '#82ca9d',
                                            mb: 2
                                        }}
                                    />
                                </motion.div>
                                <Typography variant="h6" sx={{ fontWeight: 'medium', minHeight: '1.5em' }}>
                                    {loadingSteps[currentStep] || loadingSteps[loadingSteps.length - 1]}
                                </Typography>
                            </Box>
                        </motion.div>

                        {/* Floating savings icons animation */}
                        <motion.div variants={itemVariants}>
                            <Box sx={{ position: 'relative', height: 100, overflow: 'hidden' }}>
                                {[...Array(6)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        style={{
                                            position: 'absolute',
                                            fontSize: '24px',
                                            color: 'rgba(130, 202, 157, 0.3)',
                                            left: `${10 + i * 15}%`,
                                            top: `${20 + (i % 2) * 40}px`,
                                        }}
                                        animate={{
                                            y: [-20, 20, -20],
                                            opacity: [0.3, 0.8, 0.3],
                                        }}
                                        transition={{
                                            duration: 2 + i * 0.3,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                            delay: i * 0.2,
                                        }}
                                    >
                                        💰
                                    </motion.div>
                                ))}
                            </Box>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 3, fontStyle: 'italic' }}>
                                This usually takes just a few seconds...
                            </Typography>
                        </motion.div>
                    </Box>
                </motion.div>
            </Paper>
        </Container>
    );
};

export default LoadingPage;
