import React from 'react';
import { Card, CardContent, Typography, Box, Tooltip } from '@mui/material';
import Grid from '@mui/material/Grid';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const getHorizonLabel = (value) => {
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
    const option = horizonOptions.find(option => option.value === value);
    return option ? option.label : 'N/A';
};

const InputsCard = ({ inputs, isSimpleAnalysis }) => {
    const navigate = useNavigate();
    if (!inputs) {
        return null;
    }

    const savingsGoals = inputs.savings_goals || [];

    const inputItems = [
        {
            title: 'Annual Earnings',
            value: `£${inputs.earnings.toLocaleString()}`,
            icon: <MonetizationOnOutlinedIcon fontSize="large" color="primary" />,
            tooltip: 'Your gross annual income, used to calculate your Personal Savings Allowance.'
        },
        {
            title: 'ISA Allowance Used',
            value: `£${inputs.isa_allowance_used.toLocaleString()}`,
            icon: <AccountBalanceWalletOutlinedIcon fontSize="large" color="primary" />,
            tooltip: 'How much of your £20,000 ISA allowance you have used this tax year.'
        },
        {
            title: 'Savings Goals',
            value: savingsGoals.length > 0
                ? savingsGoals.map((goal, idx) => `£${goal.amount.toLocaleString()} for ${getHorizonLabel(goal.horizon)}`).join('\n')
                : 'None',
            icon: <SavingsOutlinedIcon fontSize="large" color="primary" />,
            tooltip: 'Your specific savings goals and how long you plan to save for each.'
        }
    ];

    return (
        <Card sx={{ mb: 4, borderRadius: 3 }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Grid container spacing={2} justifyContent="center" sx={{ mt: 1 }}>
                    {inputItems.map(item => (
                        <Grid item xs={12} sm={4} key={item.title}>
                            <Box sx={{ textAlign: 'center', p: 1 }}>
                                {item.icon}
                                <Typography variant="h6" component="h3" sx={{ mt: 1 }}>
                                    {item.title}
                                    <Tooltip title={item.tooltip} placement="top" arrow>
                                        <InfoOutlinedIcon sx={{ fontSize: '1rem', ml: 0.5, verticalAlign: 'middle', color: 'rgba(255, 255, 255, 0.7)' }} />
                                    </Tooltip>
                                </Typography>
                                {item.title === 'Savings Goals' ? (
                                    <Box sx={{ mt: 1 }}>
                                        {savingsGoals.length > 0 ? (
                                            savingsGoals.map((goal, idx) => (
                                                <Typography key={idx} variant="body1">
                                                    £{goal.amount.toLocaleString()} for {getHorizonLabel(goal.horizon)}
                                                </Typography>
                                            ))
                                        ) : (
                                            <Typography variant="body1">None</Typography>
                                        )}
                                    </Box>
                                ) : (
                                    <Typography variant="h4" color="text.primary">{item.value}</Typography>
                                )}
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </CardContent>
            <Box sx={{ p: 0, borderTop: 1, borderColor: 'divider', textAlign: 'center' }}>
                <Button
                    onClick={() => navigate('/', { state: { inputs, isSimpleAnalysis } })}
                    fullWidth
                    disableElevation
                    variant="text"
                    sx={{
                        borderRadius: 0,
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        color: 'text.primary',
                        py: 1.5,
                        textTransform: 'none',
                    }}
                    startIcon={<ArrowBackIcon />}
                >
                    Edit your inputs
                </Button>
            </Box>
        </Card>
    );
};

export default InputsCard; 