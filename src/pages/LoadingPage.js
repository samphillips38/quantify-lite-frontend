import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { optimiseSavings } from '../services/api';
import {
    Container, Box, Typography, Button
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';


// Comprehensive list of UK banks and account providers
const UK_BANKS_AND_PROVIDERS = [
    // Major High Street Banks
    'Lloyds Bank', 'Barclays', 'HSBC UK', 'NatWest', 'Royal Bank of Scotland',
    'Santander UK', 'TSB Bank', 'Metro Bank', 'Nationwide Building Society',
    'Yorkshire Building Society', 'Coventry Building Society', 'Leeds Building Society',
    
    // Challenger Banks
    'Monzo', 'Starling Bank', 'Revolut', 'Chime', 'Atom Bank', 'Zopa Bank',
    'Oaknorth Bank', 'Aldermore', 'Shawbrook Bank', 'Paragon Bank',
    
    // Online Savings Platforms
    'Raisin UK', 'Flagstone', 'Hargreaves Lansdown', 'AJ Bell', 'Vanguard',
    'Interactive Investor', 'Freetrade', 'Trading 212', 'eToro',
    
    // Specialist Savings Providers
    'Charter Savings Bank', 'Secure Trust Bank', 'Close Brothers Savings',
    'United Trust Bank', 'Gatehouse Bank', 'Al Rayan Bank', 'BLME',
    'QIB UK', 'Ahli United Bank', 'Bank of London and The Middle East',
    
    // Building Societies
    'Skipton Building Society', 'Principality Building Society',
    'Newcastle Building Society', 'Cambridge Building Society',
    'Dudley Building Society', 'Earl Shilton Building Society',
    'Hinckley & Rugby Building Society', 'Ipswich Building Society',
    'Market Harborough Building Society', 'Melton Mowbray Building Society',
    'Nottingham Building Society', 'Penrith Building Society',
    'Scottish Building Society', 'Saffron Building Society',
    'Vernon Building Society', 'West Bromwich Building Society',
    
    // Credit Unions & Community Banks
    'Cambridge & Counties Bank', 'Cynergy Bank', 'Redwood Bank',
    'Triodos Bank', 'Ecology Building Society', 'Charity Bank',
    
    // Investment Platforms with Savings
    'Nutmeg', 'Wealthify', 'Moneyfarm', 'Scalable Capital', 'Moneybox',
    
    // International Banks with UK Operations
    'First Direct', 'M&S Bank', 'Tesco Bank', 'Sainsbury\'s Bank',
    'John Lewis Finance', 'Post Office Money',
    
    // Specialist ISA Providers
    'Moneybox', 'Chip', 'Marcus by Goldman Sachs', 'Ford Money',
    'ICICI Bank UK', 'State Bank of India UK', 'Axis Bank UK',
    
    // Additional Providers
    'Vanquis Bank', 'NewDay', 'Aqua', 'Opus', 'Fluid', 'Tesco Bank',
    'Virgin Money', 'Clydesdale Bank', 'Yorkshire Bank', 'Bank of Scotland',
    'Ulster Bank', 'Danske Bank', 'Handelsbanken', 'Close Brothers',
    'Investec', 'Rathbone Brothers', 'Charles Stanley', 'Brewin Dolphin',
    
    // More Building Societies
    'Buckinghamshire Building Society', 'Dudley Building Society',
    'Earl Shilton Building Society', 'Hinckley & Rugby Building Society',
    'Ipswich Building Society', 'Market Harborough Building Society',
    'Melton Mowbray Building Society', 'Penrith Building Society',
    'Scottish Building Society', 'Vernon Building Society',
    
    // Additional Challenger & Digital Banks
    'Monese', 'Curve', 'Pockit', 'Loot', 'GoHenry', 'Osper', 'RoosterMoney',
    'Tide', 'Anna Money', 'Countingup', 'Cashplus', 'Suits Me',
    
    // More Savings Platforms
    'RateSetter', 'Funding Circle', 'Assetz Capital', 'CrowdProperty',
    'Property Partner', 'Landbay', 'LendInvest', 'Wellesley',
    
    // Additional Providers
    'Charter Savings Bank', 'Secure Trust Bank', 'United Trust Bank',
    'Gatehouse Bank', 'Al Rayan Bank', 'BLME', 'QIB UK',
    'Ahli United Bank', 'Bank of London and The Middle East',
    
    // More Building Societies
    'Buckinghamshire Building Society', 'Dudley Building Society',
    'Earl Shilton Building Society', 'Hinckley & Rugby Building Society',
    'Ipswich Building Society', 'Market Harborough Building Society',
    'Melton Mowbray Building Society', 'Penrith Building Society',
    'Scottish Building Society', 'Vernon Building Society',
];

// Bank cycling display component using existing animations
const BankCyclingDisplay = ({ currentIndex }) => {
    const currentBank = UK_BANKS_AND_PROVIDERS[currentIndex % UK_BANKS_AND_PROVIDERS.length];
    const totalBanks = UK_BANKS_AND_PROVIDERS.length;
    
    return (
        <Box sx={{ 
            width: '100%',
            maxWidth: '500px',
            mx: 'auto',
            mb: 4,
            minHeight: '120px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
        }}>
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                >
                    <Typography 
                        variant="h6" 
                        sx={{ 
                            color: '#9B7EDE',
                            fontWeight: 600,
                            mb: 1,
                            minHeight: '2em',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            px: 2
                        }}
                    >
                        {currentBank}
                    </Typography>
                </motion.div>
            </AnimatePresence>
            
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                gap: 1,
                mt: 2
            }}>
                <Typography 
                    variant="caption" 
                    sx={{ 
                        color: '#6B5B8A',
                        fontSize: '0.75rem',
                        fontWeight: 500
                    }}
                >
                    Scanning {Math.min(currentIndex + 1, totalBanks)} of {totalBanks}+ providers
                </Typography>
            </Box>
        </Box>
    );
};

// Highly detailed iridescent mutating cloud animation
const IridescentCloud = () => {
    // Generate iridescent colors that shift
    const getIridescentGradient = (offset) => {
        const hue1 = (155 + offset * 30) % 360;
        const hue2 = (200 + offset * 25) % 360;
        const hue3 = (250 + offset * 20) % 360;
        return `linear-gradient(135deg, 
            hsla(${hue1}, 70%, 65%, 0.9) 0%,
            hsla(${hue2}, 75%, 70%, 0.85) 30%,
            hsla(${hue3}, 80%, 75%, 0.8) 60%,
            hsla(${hue1 + 20}, 65%, 70%, 0.75) 100%
        )`;
    };

    return (
        <Box sx={{ 
            position: 'relative', 
            width: '320px', 
            height: '320px', 
            margin: 'auto',
            mb: 4,
            filter: 'blur(0.5px)',
        }}>
            {/* Deep outer glow layers with iridescent effect */}
            {[...Array(6)].map((_, i) => (
                <motion.div
                    key={`outer-glow-${i}`}
                    style={{
                        position: 'absolute',
                        width: `${100 + i * 15}%`,
                        height: `${100 + i * 15}%`,
                        left: `${-i * 7.5}%`,
                        top: `${-i * 7.5}%`,
                        borderRadius: '50%',
                        background: `radial-gradient(circle, 
                            hsla(${155 + i * 10}, 60%, 70%, ${0.2 - i * 0.025}) 0%, 
                            hsla(${200 + i * 8}, 65%, 75%, ${0.15 - i * 0.02}) 40%,
                            transparent 70%
                        )`,
                        filter: `blur(${25 + i * 5}px)`,
                    }}
                    animate={{
                        scale: [1, 1.15 + i * 0.04, 1],
                        opacity: [0.2, 0.4 - i * 0.05, 0.2],
                        rotate: [0, 180 + i * 30, 360],
                    }}
                    transition={{
                        duration: 8 + i * 1.5,
                        repeat: Infinity,
                        ease: [0.4, 0, 0.6, 1],
                        delay: i * 0.5,
                    }}
                />
            ))}
            
            {/* Main cloud layers with detailed morphing */}
            {[...Array(8)].map((_, i) => {
                const size = 100 - i * 8;
                const offset = i * 3;
                return (
                    <motion.div
                        key={`cloud-layer-${i}`}
                        style={{
                            position: 'absolute',
                            width: `${size}%`,
                            height: `${size}%`,
                            left: `${offset * 0.8}%`,
                            top: `${offset * 0.6}%`,
                            borderRadius: '50%',
                            background: getIridescentGradient(i * 15),
                            filter: `blur(${Math.max(0.5, 2 - i * 0.2)}px)`,
                            mixBlendMode: i % 2 === 0 ? 'multiply' : 'screen',
                        }}
                        animate={{
                            scale: [
                                1, 
                                1.08 + i * 0.015, 
                                0.95 + i * 0.01,
                                1.05 + i * 0.02,
                                1
                            ],
                            x: [
                                0, 
                                Math.sin(i) * (8 + i * 2), 
                                Math.cos(i) * (6 + i * 1.5),
                                -Math.sin(i) * (7 + i * 1.8),
                                0
                            ],
                            y: [
                                0, 
                                Math.cos(i) * (6 + i * 1.5), 
                                -Math.sin(i) * (8 + i * 2),
                                Math.cos(i) * (5 + i * 1.2),
                                0
                            ],
                            borderRadius: [
                                '50%',
                                `${40 + i * 3}% ${60 - i * 2}% ${55 - i * 2.5}% ${45 + i * 2.5}%`,
                                `${55 - i * 2}% ${45 + i * 3}% ${50 + i * 2}% ${50 - i * 2}%`,
                                `${45 + i * 2.5}% ${55 - i * 2.5}% ${60 - i * 3}% ${40 + i * 3}%`,
                                '50%'
                            ],
                            rotate: [0, 45 + i * 15, -30 + i * 10, 60 + i * 20, 0],
                        }}
                        transition={{
                            duration: 12 + i * 2,
                            repeat: Infinity,
                            ease: [0.25, 0.1, 0.25, 1],
                            delay: i * 0.6,
                        }}
                    />
                );
            })}
            
            {/* Detailed inner cloud structures */}
            {[...Array(12)].map((_, i) => {
                const angle = (i / 12) * Math.PI * 2;
                const radius = 30 + (i % 3) * 15;
                return (
                    <motion.div
                        key={`inner-cloud-${i}`}
                        style={{
                            position: 'absolute',
                            width: `${15 + (i % 4) * 3}%`,
                            height: `${15 + (i % 4) * 3}%`,
                            left: `50%`,
                            top: `50%`,
                            borderRadius: '50%',
                            background: `radial-gradient(circle at ${30 + i * 5}% ${30 + i * 5}%, 
                                hsla(${180 + i * 15}, 75%, 75%, 0.9) 0%,
                                hsla(${220 + i * 12}, 80%, 80%, 0.7) 50%,
                                hsla(${260 + i * 10}, 70%, 70%, 0.5) 100%
                            )`,
                            filter: `blur(${1 + (i % 2) * 0.5}px)`,
                            transform: 'translate(-50%, -50%)',
                            mixBlendMode: i % 3 === 0 ? 'overlay' : i % 3 === 1 ? 'soft-light' : 'normal',
                        }}
                        animate={{
                            x: [
                                0,
                                Math.cos(angle) * radius,
                                Math.cos(angle + Math.PI / 6) * (radius * 1.2),
                                Math.cos(angle + Math.PI / 3) * (radius * 0.8),
                                Math.cos(angle) * radius,
                                0
                            ],
                            y: [
                                0,
                                Math.sin(angle) * radius,
                                Math.sin(angle + Math.PI / 6) * (radius * 1.2),
                                Math.sin(angle + Math.PI / 3) * (radius * 0.8),
                                Math.sin(angle) * radius,
                                0
                            ],
                            scale: [1, 1.2, 0.9, 1.15, 1.1, 1],
                            opacity: [0.6, 0.9, 0.7, 0.85, 0.75, 0.6],
                            borderRadius: [
                                '50%',
                                `${35 + i * 2}% ${65 - i * 2}% ${60 - i * 1.5}% ${40 + i * 1.5}%`,
                                `${60 - i * 1.5}% ${40 + i * 2}% ${45 + i * 1.5}% ${55 - i * 1.5}%`,
                                `${40 + i * 1.5}% ${60 - i * 2}% ${55 - i * 1.5}% ${45 + i * 1.5}%`,
                                '50%'
                            ],
                        }}
                        transition={{
                            duration: 10 + i * 1.5,
                            repeat: Infinity,
                            ease: [0.3, 0, 0.7, 1],
                            delay: i * 0.4,
                        }}
                    />
                );
            })}
            
            {/* Shimmer effect overlay */}
            <motion.div
                style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    background: `conic-gradient(from 0deg,
                        transparent 0deg,
                        hsla(200, 80%, 80%, 0.3) 60deg,
                        transparent 120deg,
                        hsla(250, 75%, 75%, 0.25) 180deg,
                        transparent 240deg,
                        hsla(300, 70%, 70%, 0.2) 300deg,
                        transparent 360deg
                    )`,
                    mixBlendMode: 'overlay',
                }}
                animate={{
                    rotate: [0, 360],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                }}
            />
        </Box>
    );
};

const LoadingPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [optimizationData, setOptimizationData] = useState(null);
    const [error, setError] = useState(null);
    const [currentBankIndex, setCurrentBankIndex] = useState(0);

    const loadingSteps = [
        "Initializing optimization algorithm...",
        "Scanning hundreds of savings accounts...",
        "Calculating tax implications...",
        "Running mathematical optimization...",
        "Evaluating portfolio combinations...",
        "Finalizing optimal solution..."
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


    useEffect(() => {
        const startTime = Date.now();
        const minLoadingTime = 3000; // 3 seconds minimum

        // Cycle through banks every 600ms to show activity (slightly longer for readability)
        const bankInterval = setInterval(() => {
            setCurrentBankIndex(prev => (prev + 1) % UK_BANKS_AND_PROVIDERS.length);
        }, 600);

        // Simulate progress through loading steps
        const stepInterval = setInterval(() => {
            setCurrentStep(prev => {
                const nextStep = prev + 1;
                if (nextStep < loadingSteps.length) {
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
                            other_savings_income: inputs.other_savings_income,
                        };
                        return optimiseSavings(data, false).then(result => ({ data: result.data, inputs: data }));
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
                        other_savings_income: inputs.other_savings_income,
                    };

                    const result = await optimiseSavings(data, false);
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
            clearInterval(bankInterval);
        };
    }, [location.state, navigate, optimizationData, error, loadingSteps.length]);

    return (
        <Container maxWidth="sm">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <Box sx={{ 
                    textAlign: 'center', 
                    minHeight: '80vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    py: 8
                }}>
                    {/* Iridescent Cloud Animation */}
                    <motion.div 
                        variants={itemVariants}
                        style={{ marginBottom: '32px' }}
                    >
                        <IridescentCloud />
                    </motion.div>
                    
                    {/* Searching Text */}
                    <motion.div variants={itemVariants}>
                        <Typography 
                            variant="h4" 
                            component="h1" 
                            sx={{ 
                                fontWeight: 700,
                                color: '#2D1B4E',
                                mb: 2,
                                letterSpacing: '-0.02em'
                            }}
                        >
                            Searching
                        </Typography>
                    </motion.div>

                    {/* Bank Cycling Display */}
                    <motion.div variants={itemVariants}>
                        <BankCyclingDisplay currentIndex={currentBankIndex} />
                    </motion.div>

                    {/* Current step indicator */}
                    <motion.div variants={itemVariants}>
                        <Typography 
                            variant="body2" 
                            sx={{ 
                                color: '#6B5B8A',
                                mb: 6,
                                minHeight: '1.5em',
                                maxWidth: '400px',
                                mx: 'auto',
                                fontSize: '0.875rem'
                            }}
                        >
                            {loadingSteps[currentStep] || loadingSteps[loadingSteps.length - 1]}
                        </Typography>
                    </motion.div>

                    {/* Cancel Button */}
                    <motion.div 
                        variants={itemVariants}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Button
                            variant="text"
                            onClick={() => navigate('/')}
                            sx={{
                                color: '#6B5B8A',
                                textTransform: 'none',
                                fontWeight: 500,
                                fontSize: '1rem',
                                '&:hover': {
                                    backgroundColor: 'rgba(155, 126, 222, 0.08)',
                                },
                            }}
                        >
                            Cancel
                        </Button>
                    </motion.div>
                </Box>
            </motion.div>
        </Container>
    );
};

export default LoadingPage;
