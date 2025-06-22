import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Container, Box, Typography, Button, Grid,
    Card, CardContent, CardActionArea, Chip
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SummaryCard from '../components/SummaryCard';

const ResultsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const results = location.state?.results?.investments || [];
    const earnings = location.state?.earnings || 0;

    const handleGoBack = () => {
        navigate('/');
    };

    if (results.length === 0) {
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

                <SummaryCard results={results} earnings={earnings} />

                <Grid container spacing={4} justifyContent="center">
                    {results.map((item, index) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
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