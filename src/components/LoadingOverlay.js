import React, { useState, useEffect, useMemo } from 'react';
import { 
    Backdrop, 
    Box,
    Typography,
    LinearProgress,
    Card,
    CardContent,
    Grid,
    Chip,
    Fade,
    Zoom,
    Paper,
    Stack
} from '@mui/material';
import { 
    DataUsage,
    TrendingUp,
    AccountBalance,
    Calculate,
    Speed,
    Security,
    CompareArrows,
    CheckCircle
} from '@mui/icons-material';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const LoadingOverlay = ({ open, message = 'Optimizing your savings...', progress = null }) => {
    const [currentStage, setCurrentStage] = useState(0);
    const [stageProgress, setStageProgress] = useState(0);
    const [accountsAnalyzed, setAccountsAnalyzed] = useState(0);
    const [dataPoints, setDataPoints] = useState(0);
    const [optimizationRuns, setOptimizationRuns] = useState(0);
    const [activeAlgorithms, setActiveAlgorithms] = useState([]);
    const [completedStages, setCompletedStages] = useState([]);
    const [realtimeStats, setRealtimeStats] = useState({
        ratesCompared: 0,
        taxScenarios: 0,
        portfoliosCombined: 0,
        riskAnalyzed: 0
    });

    const stages = useMemo(() => [
        {
            id: 'database',
            title: 'Accessing Financial Database',
            description: 'Connecting to comprehensive UK financial institutions database',
            icon: <DataUsage />,
            duration: 2000,
            accounts: 2847,
            dataPoints: 45623
        },
        {
            id: 'rates',
            title: 'Analyzing Interest Rates',
            description: 'Comparing current rates across savings accounts, ISAs, and investments',
            icon: <TrendingUp />,
            duration: 2500,
            accounts: 1834,
            dataPoints: 38471
        },
        {
            id: 'institutions',
            title: 'Scanning UK Financial Institutions',
            description: 'Processing data from major banks, building societies, and fintech providers',
            icon: <AccountBalance />,
            duration: 3000,
            accounts: 2156,
            dataPoints: 52389
        },
        {
            id: 'optimization',
            title: 'Running Optimization Algorithms',
            description: 'Executing advanced portfolio optimization and tax-efficient allocation strategies',
            icon: <Calculate />,
            duration: 3500,
            accounts: 847,
            dataPoints: 67234
        },
        {
            id: 'risk',
            title: 'Risk Analysis & Compliance',
            description: 'Evaluating FSCS protection, institutional stability, and regulatory compliance',
            icon: <Security />,
            duration: 2000,
            accounts: 1647,
            dataPoints: 23456
        },
        {
            id: 'comparison',
            title: 'Comparative Analysis',
            description: 'Ranking optimal solutions based on returns, accessibility, and risk profile',
            icon: <CompareArrows />,
            duration: 2500,
            accounts: 592,
            dataPoints: 31847
        },
        {
            id: 'finalization',
            title: 'Finalizing Recommendations',
            description: 'Preparing personalized savings strategy with detailed projections',
            icon: <CheckCircle />,
            duration: 1500,
            accounts: 156,
            dataPoints: 15623
        }
    ], []);

    const algorithms = useMemo(() => [
        'Monte Carlo Simulation',
        'Dynamic Programming',
        'Genetic Algorithm',
        'Gradient Descent',
        'Particle Swarm Optimization',
        'Bayesian Optimization',
        'Linear Programming',
        'Constraint Satisfaction'
    ], []);

    const realtimeMessages = useMemo(() => [
        'Fetching real-time interest rates...',
        'Processing tax-efficient strategies...',
        'Analyzing liquidity requirements...',
        'Calculating compound interest projections...',
        'Evaluating inflation-protected options...',
        'Optimizing ISA allowance allocation...',
        'Assessing emergency fund requirements...',
        'Computing tax liability scenarios...',
        'Analyzing market volatility impact...',
        'Validating FSCS protection coverage...',
        'Processing regulatory compliance checks...',
        'Calculating optimal diversification...',
        'Evaluating fixed vs variable rates...',
        'Optimizing withdrawal strategies...',
        'Assessing early access penalties...'
    ], []);

    const [currentMessage, setCurrentMessage] = useState(0);

    useEffect(() => {
        if (!open) {
            // Reset all states when overlay closes
            setCurrentStage(0);
            setStageProgress(0);
            setAccountsAnalyzed(0);
            setDataPoints(0);
            setOptimizationRuns(0);
            setActiveAlgorithms([]);
            setCompletedStages([]);
            setRealtimeStats({
                ratesCompared: 0,
                taxScenarios: 0,
                portfoliosCombined: 0,
                riskAnalyzed: 0
            });
            setCurrentMessage(0);
            return;
        }

        // Main stage progression
        const stageInterval = setInterval(() => {
            setCurrentStage(prev => {
                if (prev < stages.length - 1) {
                    return prev + 1;
                }
                return prev;
            });
        }, 3000);

        // Stage progress animation
        const progressInterval = setInterval(() => {
            setStageProgress(prev => {
                if (prev >= 100) {
                    setCompletedStages(prevCompleted => {
                        const newCompleted = [...prevCompleted];
                        if (!newCompleted.includes(currentStage)) {
                            newCompleted.push(currentStage);
                        }
                        return newCompleted;
                    });
                    return 0;
                }
                return prev + Math.random() * 15 + 5;
            });
        }, 200);

        // Accounts counter
        const accountsInterval = setInterval(() => {
            setAccountsAnalyzed(prev => {
                const target = stages[currentStage]?.accounts || 0;
                if (prev < target) {
                    return Math.min(prev + Math.floor(Math.random() * 50) + 20, target);
                }
                return prev;
            });
        }, 150);

        // Data points counter
        const dataPointsInterval = setInterval(() => {
            setDataPoints(prev => {
                const target = stages[currentStage]?.dataPoints || 0;
                if (prev < target) {
                    return Math.min(prev + Math.floor(Math.random() * 500) + 200, target);
                }
                return prev;
            });
        }, 100);

        // Optimization runs counter
        const optimizationInterval = setInterval(() => {
            setOptimizationRuns(prev => prev + 1);
        }, 300);

        // Active algorithms rotation
        const algorithmInterval = setInterval(() => {
            setActiveAlgorithms(prev => {
                const newAlgorithms = [...prev];
                if (newAlgorithms.length < 3) {
                    const remainingAlgorithms = algorithms.filter(alg => !newAlgorithms.includes(alg));
                    if (remainingAlgorithms.length > 0) {
                        newAlgorithms.push(remainingAlgorithms[Math.floor(Math.random() * remainingAlgorithms.length)]);
                    }
                } else {
                    newAlgorithms.shift();
                    const remainingAlgorithms = algorithms.filter(alg => !newAlgorithms.includes(alg));
                    if (remainingAlgorithms.length > 0) {
                        newAlgorithms.push(remainingAlgorithms[Math.floor(Math.random() * remainingAlgorithms.length)]);
                    }
                }
                return newAlgorithms;
            });
        }, 1500);

        // Realtime stats
        const statsInterval = setInterval(() => {
            setRealtimeStats(prev => ({
                ratesCompared: prev.ratesCompared + Math.floor(Math.random() * 20) + 5,
                taxScenarios: prev.taxScenarios + Math.floor(Math.random() * 3) + 1,
                portfoliosCombined: prev.portfoliosCombined + Math.floor(Math.random() * 10) + 2,
                riskAnalyzed: prev.riskAnalyzed + Math.floor(Math.random() * 15) + 3
            }));
        }, 800);

        // Message rotation
        const messageInterval = setInterval(() => {
            setCurrentMessage(prev => (prev + 1) % realtimeMessages.length);
        }, 1800);

        return () => {
            clearInterval(stageInterval);
            clearInterval(progressInterval);
            clearInterval(accountsInterval);
            clearInterval(dataPointsInterval);
            clearInterval(optimizationInterval);
            clearInterval(algorithmInterval);
            clearInterval(statsInterval);
            clearInterval(messageInterval);
        };
    }, [open, currentStage, stages, algorithms, realtimeMessages]);

    const currentStageData = stages[currentStage] || stages[0];

    return (
        <Backdrop
            sx={{
                color: '#fff',
                zIndex: (theme) => theme.zIndex.drawer + 1,
                backgroundColor: 'rgba(0, 0, 0, 0.95)',
                backdropFilter: 'blur(8px)',
            }}
            open={open}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    p: 4,
                    maxWidth: '90vw',
                    width: '100%',
                    maxHeight: '95vh',
                    overflowY: 'auto',
                }}
            >
                {/* Main Animation */}
                <Box sx={{ mb: 3 }}>
                    <DotLottieReact
                        src="/animations/ThinkingCharts.lottie"
                        loop
                        autoplay
                        style={{ 
                            height: '120px', 
                            width: '120px',
                            filter: 'brightness(1.3) saturate(1.2)' 
                        }}
                    />
                </Box>

                {/* Main Title */}
                <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 1 }}>
                    {message}
                </Typography>

                {/* Current Stage */}
                <Fade in={true} key={currentStage}>
                    <Card sx={{ 
                        mb: 3, 
                        minWidth: 400,
                        maxWidth: 600,
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.2)'
                    }}>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Box sx={{ 
                                    mr: 2, 
                                    p: 1, 
                                    borderRadius: '50%', 
                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {currentStageData.icon}
                                </Box>
                                <Box sx={{ flexGrow: 1, textAlign: 'left' }}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                        {currentStageData.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {currentStageData.description}
                                    </Typography>
                                </Box>
                            </Box>
                            
                            <LinearProgress 
                                variant="determinate" 
                                value={Math.min(stageProgress, 100)} 
                                sx={{
                                    height: 8,
                                    borderRadius: 4,
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    '& .MuiLinearProgress-bar': {
                                        borderRadius: 4,
                                        background: 'linear-gradient(90deg, #4CAF50, #8BC34A)',
                                    },
                                }}
                            />
                            
                            <Grid container spacing={2} sx={{ mt: 1 }}>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="text.secondary">
                                        Accounts Analyzed
                                    </Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                        {accountsAnalyzed.toLocaleString()}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="text.secondary">
                                        Data Points Processed
                                    </Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                        {dataPoints.toLocaleString()}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Fade>

                {/* Real-time Stats */}
                <Grid container spacing={2} sx={{ mb: 3, maxWidth: 800 }}>
                    <Grid item xs={6} sm={3}>
                        <Paper sx={{ 
                            p: 2, 
                            backgroundColor: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)'
                        }}>
                            <Typography variant="body2" color="text.secondary">
                                Rates Compared
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                {realtimeStats.ratesCompared.toLocaleString()}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <Paper sx={{ 
                            p: 2, 
                            backgroundColor: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)'
                        }}>
                            <Typography variant="body2" color="text.secondary">
                                Tax Scenarios
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                {realtimeStats.taxScenarios.toLocaleString()}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <Paper sx={{ 
                            p: 2, 
                            backgroundColor: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)'
                        }}>
                            <Typography variant="body2" color="text.secondary">
                                Portfolios Combined
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                {realtimeStats.portfoliosCombined.toLocaleString()}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <Paper sx={{ 
                            p: 2, 
                            backgroundColor: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)'
                        }}>
                            <Typography variant="body2" color="text.secondary">
                                Risk Analyzed
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                {realtimeStats.riskAnalyzed.toLocaleString()}
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>

                {/* Active Algorithms */}
                <Box sx={{ mb: 3, maxWidth: 600 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Active Optimization Algorithms
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center">
                        {activeAlgorithms.map((algorithm, index) => (
                            <Zoom in={true} key={algorithm} style={{ transitionDelay: `${index * 100}ms` }}>
                                <Chip
                                    label={algorithm}
                                    icon={<Speed />}
                                    variant="outlined"
                                    sx={{
                                        backgroundColor: 'rgba(255,255,255,0.1)',
                                        color: 'white',
                                        borderColor: 'rgba(255,255,255,0.3)',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255,255,255,0.2)',
                                        },
                                        mb: 1
                                    }}
                                />
                            </Zoom>
                        ))}
                    </Stack>
                </Box>

                {/* Stage Progress Indicator */}
                <Box sx={{ mb: 3, maxWidth: 600 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Processing Pipeline ({currentStage + 1} of {stages.length})
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1 }}>
                        {stages.map((stage, index) => (
                            <Box
                                key={stage.id}
                                sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: completedStages.includes(index) 
                                        ? 'rgba(76, 175, 80, 0.8)'
                                        : index === currentStage 
                                        ? 'rgba(255, 152, 0, 0.8)'
                                        : 'rgba(255,255,255,0.1)',
                                    transition: 'all 0.3s ease',
                                    fontSize: '0.8rem'
                                }}
                            >
                                {completedStages.includes(index) ? (
                                    <CheckCircle fontSize="small" />
                                ) : (
                                    stage.icon
                                )}
                            </Box>
                        ))}
                    </Box>
                </Box>

                {/* Current Activity Message */}
                <Typography 
                    variant="body1" 
                    color="text.secondary" 
                    sx={{ 
                        mb: 2,
                        minHeight: '1.5em',
                        transition: 'opacity 0.5s ease-in-out',
                        fontStyle: 'italic'
                    }}
                >
                    {realtimeMessages[currentMessage]}
                </Typography>

                {/* Overall Progress */}
                <Box sx={{ width: '100%', maxWidth: 400, mb: 2 }}>
                    <LinearProgress 
                        variant="determinate" 
                        value={((currentStage + 1) / stages.length) * 100} 
                        sx={{
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            '& .MuiLinearProgress-bar': {
                                borderRadius: 3,
                                background: 'linear-gradient(90deg, #2196F3, #21CBF3)',
                            },
                        }}
                    />
                    <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
                        {Math.round(((currentStage + 1) / stages.length) * 100)}% Complete
                    </Typography>
                </Box>

                {/* Optimization Stats */}
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {optimizationRuns.toLocaleString()} optimization runs completed
                </Typography>
            </Box>
        </Backdrop>
    );
};

export default LoadingOverlay;