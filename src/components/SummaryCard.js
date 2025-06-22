import React from 'react';
import { Card, CardContent, Typography, Grid, Box, Tooltip } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import PieChartOutlineOutlinedIcon from '@mui/icons-material/PieChartOutlineOutlined';

const SummaryCard = ({ results, earnings }) => {

    const getTaxInfo = (income) => {
        if (income <= 50270) return { rate: 0.20, psa: 1000, band: 'Basic Rate' };
        if (income <= 150000) return { rate: 0.40, psa: 500, band: 'Higher Rate' };
        return { rate: 0.45, psa: 0, band: 'Additional Rate' };
    };

    const taxInfo = getTaxInfo(parseFloat(earnings));

    let taxableInterest = 0;
    const nonIsaInterest = results
        .filter(item => !item.is_isa)
        .reduce((sum, item) => sum + (item.amount * (item.aer / 100)), 0);

    if (nonIsaInterest > taxInfo.psa) {
        taxableInterest = nonIsaInterest - taxInfo.psa;
    }

    const taxDue = taxableInterest * taxInfo.rate;
    
    const totalInvestment = results.reduce((sum, item) => sum + item.amount, 0);
    const grossInterest = results.reduce((sum, item) => sum + (item.amount * (item.aer / 100)), 0);
    const netInterest = grossInterest - taxDue;
    const netEffectiveAer = totalInvestment > 0 ? (netInterest / totalInvestment) * 100 : 0;

    const summaryItems = [
        {
            title: 'Total Savings',
            value: `£${totalInvestment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            icon: <AccountBalanceWalletOutlinedIcon fontSize="large" color="primary" />,
            tooltip: 'The total amount allocated across all recommended accounts.'
        },
        {
            title: 'Net Annual Interest',
            value: `£${netInterest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            icon: <TrendingUpOutlinedIcon fontSize="large" color="primary" />,
            tooltip: 'The estimated interest earned in one year, after tax is deducted based on your Personal Savings Allowance.'
        },
        {
            title: 'Effective Net AER',
            value: `${netEffectiveAer.toFixed(2)}%`,
            icon: <PieChartOutlineOutlinedIcon fontSize="large" color="primary" />,
            tooltip: 'The weighted average annual equivalent rate across all investments, after tax.'
        }
    ];

    return (
        <Card sx={{ mb: 4, borderRadius: 3, p: { xs: 1, sm: 2 } }}>
            <CardContent>
                <Typography variant="h4" gutterBottom align="center">
                    Post-Tax Summary
                </Typography>
                <Grid container spacing={2} justifyContent="center" sx={{ mt: 1 }}>
                    {summaryItems.map(item => (
                        <Grid size={{ xs: 12, sm: 4 }} key={item.title}>
                            <Box sx={{ textAlign: 'center', p: 1 }}>
                                {item.icon}
                                <Typography variant="h6" component="h3" sx={{ mt: 1 }}>
                                    {item.title}
                                    <Tooltip title={item.tooltip} placement="top" arrow>
                                        <InfoOutlinedIcon sx={{ fontSize: '1rem', ml: 0.5, verticalAlign: 'middle', color: 'rgba(255, 255, 255, 0.7)' }} />
                                    </Tooltip>
                                </Typography>
                                <Typography variant="h4" color="text.primary">{item.value}</Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
                <Box sx={{ textAlign: 'center', mt: 3, pt: 2, borderTop: 1, borderColor: 'rgba(255, 255, 255, 0.2)' }}>
                     <Typography variant="body1" color="text.secondary">
                        Your post-tax calculations are based on a <strong>{taxInfo.band}</strong> tax rate and a Personal Savings Allowance of <strong>£{taxInfo.psa.toLocaleString()}</strong>.
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

export default SummaryCard; 