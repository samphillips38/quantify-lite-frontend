import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container, Box, Typography, Button, Grid, Card,
    Accordion, AccordionSummary, AccordionDetails, Avatar, Chip,
    useTheme, useMediaQuery
} from '@mui/material';
import {
    ExpandMore as ExpandMoreIcon,
    Security as SecurityIcon,
    Speed as SpeedIcon,
    Psychology as PsychologyIcon,
    Analytics as AnalyticsIcon,
    ArrowForward as ArrowForwardIcon,
    Home as HomeIcon,
    AutoGraph as AutoGraphIcon,
    AccountBalance as AccountBalanceIcon,
    Stars as StarsIcon
} from '@mui/icons-material';
import { motion, useInView } from 'framer-motion';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const AboutPage = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    
    // Animation states (removed unused variables for cleaner code)
    
    // Counter animation state
    const [counters, setCounters] = useState({
        users: 0,
        saved: 0,
        satisfaction: 0
    });

    // Refs for scroll animations
    const heroRef = useRef(null);
    const statsRef = useRef(null);
    const storyRef = useRef(null);
    
    const heroInView = useInView(heroRef);
    const statsInView = useInView(statsRef);
    const storyInView = useInView(storyRef);

    // Animated counter effect
    useEffect(() => {
        if (statsInView) {
            const timer = setTimeout(() => {
                const animateCounter = (key, target, duration = 2000) => {
                    const start = 0;
                    const increment = target / (duration / 16);
                    let current = start;
                    
                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            setCounters(prev => ({ ...prev, [key]: Math.floor(current) }));
                            requestAnimationFrame(updateCounter);
                        } else {
                            setCounters(prev => ({ ...prev, [key]: target }));
                        }
                    };
                    updateCounter();
                };

                animateCounter('users', 10000);
                animateCounter('saved', 2500000);
                animateCounter('satisfaction', 97);
            }, 300);

            return () => clearTimeout(timer);
        }
    }, [statsInView]);

    const features = [
        {
            icon: <SpeedIcon />,
            title: "Lightning Fast",
            description: "Get optimized savings recommendations in seconds, not hours"
        },
        {
            icon: <SecurityIcon />,
            title: "Bank-Grade Security",
            description: "Your financial data is protected with industry-leading encryption"
        },
        {
            icon: <AnalyticsIcon />,
            title: "AI-Powered Insights",
            description: "Advanced algorithms analyze thousands of investment options"
        },
        {
            icon: <PsychologyIcon />,
            title: "User-First Design",
            description: "Designed to be intuitive, even for financial beginners"
        }
    ];

    const teamMembers = [
        {
            name: "Sarah Chen",
            role: "Founder & CEO",
            avatar: "/api/placeholder/80/80",
            bio: "Former investment banker with 10+ years at Goldman Sachs. Passionate about democratizing financial advice."
        },
        {
            name: "Marcus Johnson",
            role: "Head of Engineering",
            avatar: "/api/placeholder/80/80",
            bio: "Ex-Google engineer specializing in fintech algorithms and secure financial systems."
        },
        {
            name: "Dr. Emily Roberts",
            role: "Chief Data Scientist",
            avatar: "/api/placeholder/80/80",
            bio: "PhD in Economics from Cambridge. Expert in behavioral finance and algorithmic trading."
        }
    ];

    const faqs = [
        {
            question: "How does Quantify Lite optimize my savings?",
            answer: "Our AI analyzes your financial profile against thousands of current market options, considering factors like interest rates, tax implications, accessibility needs, and risk tolerance to recommend the optimal mix of savings accounts and investments."
        },
        {
            question: "Is my financial data secure?",
            answer: "Absolutely. We use bank-grade 256-bit encryption, never store sensitive information permanently, and are fully compliant with GDPR and FCA regulations. Your data is processed locally and anonymized for analysis."
        },
        {
            question: "What makes this different from other financial tools?",
            answer: "Unlike generic calculators, we provide real-time, personalized recommendations based on current market rates. Our algorithm considers your specific tax situation, ISA allowances, and time horizons to maximize your returns."
        },
        {
            question: "Do you charge fees or earn commissions?",
            answer: "Quantify Lite is completely free for users. We don't earn commissions from financial providers, ensuring our recommendations are truly unbiased and in your best interest."
        },
        {
            question: "Can I trust the investment recommendations?",
            answer: "Our recommendations are based on publicly available data from FCA-regulated institutions. We provide transparent information about each option, including fees, terms, and risks, so you can make informed decisions."
        }
    ];

    const testimonials = [
        {
            name: "Jennifer Walsh",
            role: "Marketing Manager",
            text: "Quantify Lite helped me discover I was missing out on £400+ per year in interest. The recommendations were spot-on!",
            rating: 5
        },
        {
            name: "David Kumar",
            role: "Software Developer",
            text: "Finally, a financial tool that actually makes sense. Simple, fast, and incredibly useful for optimizing my savings strategy.",
            rating: 5
        },
        {
            name: "Rachel Thompson",
            role: "Teacher",
            text: "As someone who finds financial planning overwhelming, this tool gave me confidence and clear next steps.",
            rating: 5
        }
    ];

    const timelineEvents = [
        {
            year: "2023",
            title: "The Problem Discovery",
            description: "Our founder lost £600 in potential interest by keeping money in a 0.1% savings account while better options offered 5%+. This sparked the idea for Quantify Lite."
        },
        {
            year: "2024",
            title: "Algorithm Development",
            description: "Partnered with leading economists and data scientists to create our optimization engine, capable of analyzing thousands of financial products in real-time."
        },
        {
            year: "2024",
            title: "Beta Launch",
            description: "Launched private beta with 500 users. Initial results showed users increased their savings returns by an average of 240%."
        },
        {
            year: "2025",
            title: "Public Launch",
            description: "Officially launched to the public with advanced features including ISA optimization, multi-goal planning, and real-time market analysis."
        }
    ];

    return (
        <Container maxWidth={false} disableGutters sx={{ overflow: 'hidden' }}>
            {/* Hero Section */}
            <Box
                ref={heroRef}
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    position: 'relative',
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}10)`,
                }}
            >
                <Container maxWidth="lg">
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                animate={heroInView ? { opacity: 1, x: 0 } : {}}
                                transition={{ duration: 0.8 }}
                            >
                                <Chip 
                                    label="🚀 Launched in 2025" 
                                    sx={{ mb: 2, backgroundColor: theme.palette.primary.main + '20' }}
                                />
                                <Typography 
                                    variant="h2" 
                                    component="h1" 
                                    gutterBottom 
                                    sx={{ 
                                        fontWeight: 700,
                                        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                    }}
                                >
                                    Turning Financial Confusion Into Crystal Clear Savings
                                </Typography>
                                <Typography variant="h6" paragraph sx={{ color: 'text.secondary', mb: 3 }}>
                                    We believe everyone deserves access to expert financial advice. 
                                    That's why we built an AI that thinks like a personal financial advisor, 
                                    but works for everyone, for free.
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 2, flexDirection: isMobile ? 'column' : 'row' }}>
                                    <Button
                                        variant="contained"
                                        size="large"
                                        onClick={() => navigate('/')}
                                        startIcon={<ArrowForwardIcon />}
                                        sx={{ px: 4, py: 1.5 }}
                                    >
                                        Try It Now
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        size="large"
                                        startIcon={<HomeIcon />}
                                        onClick={() => navigate('/')}
                                        sx={{ px: 4, py: 1.5 }}
                                    >
                                        Back to Home
                                    </Button>
                                </Box>
                            </motion.div>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={heroInView ? { opacity: 1, scale: 1 } : {}}
                                transition={{ duration: 1, delay: 0.3 }}
                            >
                                <Box sx={{ textAlign: 'center' }}>
                                    <DotLottieReact
                                        src="/animations/ThinkingCharts.lottie"
                                        loop
                                        autoplay
                                        style={{ height: '300px', width: '300px', margin: 'auto' }}
                                    />
                                </Box>
                            </motion.div>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Stats Section */}
            <Box
                ref={statsRef}
                sx={{
                    py: 8,
                    backgroundColor: theme.palette.background.paper,
                    position: 'relative'
                }}
            >
                <Container maxWidth="lg">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={statsInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8 }}
                    >
                        <Typography variant="h3" align="center" gutterBottom sx={{ mb: 6 }}>
                            Making a Real Impact
                        </Typography>
                        <Grid container spacing={4}>
                            <Grid item xs={12} md={4}>
                                <Card sx={{ textAlign: 'center', p: 3, height: '100%' }}>
                                    <AutoGraphIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                                    <Typography variant="h3" sx={{ color: 'primary.main', fontWeight: 700 }}>
                                        £{counters.saved.toLocaleString()}+
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        Additional interest earned by our users this year
                                    </Typography>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Card sx={{ textAlign: 'center', p: 3, height: '100%' }}>
                                    <StarsIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                                    <Typography variant="h3" sx={{ color: 'primary.main', fontWeight: 700 }}>
                                        {counters.satisfaction}%
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        User satisfaction rate from independent surveys
                                    </Typography>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Card sx={{ textAlign: 'center', p: 3, height: '100%' }}>
                                    <AccountBalanceIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                                    <Typography variant="h3" sx={{ color: 'primary.main', fontWeight: 700 }}>
                                        {counters.users.toLocaleString()}+
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        People have optimized their savings with us
                                    </Typography>
                                </Card>
                            </Grid>
                        </Grid>
                    </motion.div>
                </Container>
            </Box>

            {/* Story Section */}
            <Box ref={storyRef} sx={{ py: 8 }}>
                <Container maxWidth="lg">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={storyInView ? { opacity: 1 } : {}}
                        transition={{ duration: 0.8 }}
                    >
                        <Typography variant="h3" align="center" gutterBottom sx={{ mb: 2 }}>
                            Our Story
                        </Typography>
                        <Typography variant="h6" align="center" sx={{ color: 'text.secondary', mb: 6, maxWidth: '800px', mx: 'auto' }}>
                            Born from frustration with confusing financial advice and hidden fees
                        </Typography>
                        
                        <Box sx={{ position: 'relative' }}>
                            {timelineEvents.map((event, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.2 }}
                                    viewport={{ once: true }}
                                >
                                    <Box sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center',
                                        mb: 4,
                                        flexDirection: isMobile ? 'column' : index % 2 === 0 ? 'row' : 'row-reverse'
                                    }}>
                                        <Box sx={{ 
                                            flex: 1, 
                                            textAlign: isMobile ? 'center' : index % 2 === 0 ? 'right' : 'left',
                                            px: 3
                                        }}>
                                            <Chip label={event.year} color="primary" sx={{ mb: 1 }} />
                                            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                                                {event.title}
                                            </Typography>
                                            <Typography variant="body1" color="text.secondary">
                                                {event.description}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ 
                                            width: 60, 
                                            height: 60, 
                                            borderRadius: '50%', 
                                            backgroundColor: 'primary.main',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontWeight: 'bold',
                                            fontSize: '1.2rem',
                                            my: isMobile ? 2 : 0
                                        }}>
                                            {index + 1}
                                        </Box>
                                        <Box sx={{ flex: 1 }} />
                                    </Box>
                                </motion.div>
                            ))}
                        </Box>
                    </motion.div>
                </Container>
            </Box>

            {/* Features Section */}
            <Box sx={{ py: 8, backgroundColor: theme.palette.background.paper }}>
                <Container maxWidth="lg">
                    <Typography variant="h3" align="center" gutterBottom sx={{ mb: 6 }}>
                        Why Choose Quantify Lite?
                    </Typography>
                    <Grid container spacing={4}>
                        {features.map((feature, index) => (
                            <Grid item xs={12} md={6} key={index}>
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <Card sx={{ p: 3, height: '100%', cursor: 'pointer' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                            <Box sx={{ 
                                                p: 2, 
                                                borderRadius: 2, 
                                                backgroundColor: 'primary.main',
                                                color: 'white'
                                            }}>
                                                {feature.icon}
                                            </Box>
                                            <Box>
                                                <Typography variant="h6" gutterBottom>
                                                    {feature.title}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {feature.description}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Card>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Team Section */}
            <Box sx={{ py: 8 }}>
                <Container maxWidth="lg">
                    <Typography variant="h3" align="center" gutterBottom sx={{ mb: 2 }}>
                        Meet the Team
                    </Typography>
                    <Typography variant="h6" align="center" sx={{ color: 'text.secondary', mb: 6 }}>
                        Financial experts and tech innovators working to democratize financial advice
                    </Typography>
                    <Grid container spacing={4}>
                        {teamMembers.map((member, index) => (
                            <Grid item xs={12} md={4} key={index}>
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.2 }}
                                    viewport={{ once: true }}
                                    whileHover={{ y: -5 }}
                                >
                                    <Card sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                                        <Avatar
                                            sx={{ 
                                                width: 80, 
                                                height: 80, 
                                                mx: 'auto', 
                                                mb: 2,
                                                backgroundColor: 'primary.main'
                                            }}
                                        >
                                            {member.name.split(' ').map(n => n[0]).join('')}
                                        </Avatar>
                                        <Typography variant="h6" gutterBottom>
                                            {member.name}
                                        </Typography>
                                        <Typography variant="subtitle2" color="primary" gutterBottom>
                                            {member.role}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {member.bio}
                                        </Typography>
                                    </Card>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Testimonials Section */}
            <Box sx={{ py: 8, backgroundColor: theme.palette.background.paper }}>
                <Container maxWidth="lg">
                    <Typography variant="h3" align="center" gutterBottom sx={{ mb: 6 }}>
                        What Our Users Say
                    </Typography>
                    <Grid container spacing={4}>
                        {testimonials.map((testimonial, index) => (
                            <Grid item xs={12} md={4} key={index}>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <Card sx={{ p: 3, height: '100%' }}>
                                        <Box sx={{ display: 'flex', mb: 2 }}>
                                            {[...Array(testimonial.rating)].map((_, i) => (
                                                <StarsIcon key={i} sx={{ color: '#ffc107', fontSize: 20 }} />
                                            ))}
                                        </Box>
                                        <Typography variant="body1" paragraph sx={{ fontStyle: 'italic' }}>
                                            "{testimonial.text}"
                                        </Typography>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                            {testimonial.name}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {testimonial.role}
                                        </Typography>
                                    </Card>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* FAQ Section */}
            <Box sx={{ py: 8 }}>
                <Container maxWidth="md">
                    <Typography variant="h3" align="center" gutterBottom sx={{ mb: 6 }}>
                        Frequently Asked Questions
                    </Typography>
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <Accordion sx={{ mb: 2 }}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography variant="h6">{faq.question}</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography color="text.secondary">
                                        {faq.answer}
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                        </motion.div>
                    ))}
                </Container>
            </Box>

            {/* CTA Section */}
            <Box sx={{ 
                py: 8, 
                backgroundColor: theme.palette.primary.main + '10',
                textAlign: 'center'
            }}>
                <Container maxWidth="md">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <Typography variant="h3" gutterBottom>
                            Ready to Optimize Your Savings?
                        </Typography>
                        <Typography variant="h6" paragraph sx={{ color: 'text.secondary', mb: 4 }}>
                            Join thousands of users who've already discovered better ways to grow their money.
                            It takes less than 2 minutes to get personalized recommendations.
                        </Typography>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => navigate('/')}
                            startIcon={<ArrowForwardIcon />}
                            sx={{ px: 6, py: 2, fontSize: '1.1rem' }}
                        >
                            Start Optimizing Now
                        </Button>
                    </motion.div>
                </Container>
            </Box>
        </Container>
    );
};

export default AboutPage;