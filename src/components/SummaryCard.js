import React from 'react';
import { Card, CardContent, Typography, Grid, Box, Tooltip } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import PieChartOutlineOutlinedIcon from '@mui/icons-material/PieChartOutlineOutlined';

const SummaryCard = ({ summary }) => {

    if (!summary) {
        return null;
    }

    const summaryItems = [
        {
            title: 'Total Savings',
            value: `£${summary.total_investment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            icon: <AccountBalanceWalletOutlinedIcon fontSize="large" color="primary" />,
            tooltip: 'The total amount allocated across all recommended accounts.'
        },
        {
            title: 'Net Annual Interest',
            value: `£${summary.net_annual_interest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            icon: <TrendingUpOutlinedIcon fontSize="large" color="primary" />,
            tooltip: 'The estimated interest earned in one year, after tax is deducted based on your Personal Savings Allowance.'
        },
        {
            title: 'Effective Net AER',
            value: `${summary.net_effective_aer.toFixed(2)}%`,
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
                        <Grid item xs={12} sm={4} key={item.title}>
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
                        Your post-tax calculations are based on a <strong>{summary.tax_band}</strong> tax rate and a Personal Savings Allowance of <strong>£{summary.personal_savings_allowance.toLocaleString()}</strong>.
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

export default SummaryCard; 