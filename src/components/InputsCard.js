import React from 'react';
import { Card, CardContent, Typography, Box, Button, Popover, IconButton } from '@mui/material';
import Grid from '@mui/material/Grid';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useTheme } from '@mui/material/styles';

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

const InputsCard = ({ inputs, isSimpleAnalysis, showIsaSlider }) => {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [popoverIndex, setPopoverIndex] = React.useState(null);
    const theme = useTheme();

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
            title: 'Savings Breakdown',
            value: savingsGoals.length > 0
                ? savingsGoals.map((goal, idx) => `£${goal.amount.toLocaleString()} for ${getHorizonLabel(goal.horizon)}`).join('\n')
                : 'None',
            icon: <SavingsOutlinedIcon fontSize="large" color="primary" />,
            tooltip: 'Your specific savings breakdown and how long you plan to save for each.'
        }
    ];

    const handleInfoClick = (event, idx) => {
        setAnchorEl(event.currentTarget);
        setPopoverIndex(idx);
    };
    const handlePopoverClose = () => {
        setAnchorEl(null);
        setPopoverIndex(null);
    };
    const open = Boolean(anchorEl);

    return (
        <Card sx={{ mb: 4, borderRadius: 3 }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Grid container spacing={2} justifyContent="center" sx={{ mt: 1 }}>
                    {inputItems.map((item, idx) => (
                        <Grid item xs={12} sm={4} key={item.title}>
                            <Box sx={{ textAlign: 'center', p: 1 }}>
                                {item.icon}
                                <Typography variant="h6" component="h3" sx={{ mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {item.title}
                                    <IconButton
                                        size="small"
                                        onClick={e => handleInfoClick(e, idx)}
                                        sx={{ ml: 0.5, p: 0.5 }}
                                    >
                                        <InfoOutlinedIcon sx={{ fontSize: '1rem', color: theme.palette.text.secondary }} />
                                    </IconButton>
                                    <Popover
                                        open={open && popoverIndex === idx}
                                        anchorEl={anchorEl}
                                        onClose={handlePopoverClose}
                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                                        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                                        PaperProps={{ sx: { p: 2, maxWidth: 250 } }}
                                    >
                                        <Typography variant="body2">{item.tooltip}</Typography>
                                    </Popover>
                                </Typography>
                                {item.title === 'Savings Breakdown' ? (
                                    <Box sx={{ mt: 1 }}>
                                        {savingsGoals.length > 0 ? (
                                            savingsGoals.map((goal, idx) => (
                                                <Typography key={idx} 
                                                    variant={savingsGoals.length === 1 ? 'h4' : 'body2'} 
                                                    color="text.primary"
                                                    sx={savingsGoals.length === 1 ? { fontWeight: 'bold' } : { fontSize: '1.25rem' }}>
                                                    £{goal.amount.toLocaleString()} for {getHorizonLabel(goal.horizon)}
                                                </Typography>
                                            ))
                                        ) : (
                                            <Typography variant="body2">None</Typography>
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
                    onClick={() => navigate('/', { state: { inputs, isSimpleAnalysis, showIsaSlider } })}
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