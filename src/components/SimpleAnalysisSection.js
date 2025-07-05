import React from 'react';
import { Box, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { useTheme } from '@mui/material/styles';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <Box sx={{ p: 1.5, backgroundColor: 'rgba(30, 30, 30, 0.95)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: 2 }}>
                <Box>
                    {data.investments.length > 0 ? data.investments.map((inv, index) => (
                        <Typography key={index} variant="body2" sx={{ color: '#e0e0e0', lineHeight: 1.6 }}>
                            {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(inv.amount)} @ {inv.aer}% {inv.is_isa ? '(ISA)' : ''}
                        </Typography>
                    )) : (
                        <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#e0e0e0' }}>
                            No specific investments.
                        </Typography>
                    )}
                </Box>
            </Box>
        );
    }
    return null;
};

const SimpleAnalysisSection = ({ allResults, isSimpleAnalysis, chartData, yAxisDomain, maxInterest, optimalHorizon, inputs, ref, width, height, getHorizonLabel }) => {
    const theme = useTheme();
    if (!(isSimpleAnalysis && allResults)) return null;
    return (
        <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h2" align="left" sx={{ mb: 2, mt: 8 }}>
                <span style={{ color: '#82ca9d' }}>How long</span> should you lock it away for?
            </Typography>
            <Box ref={ref} sx={{ width: '100%', height: 300 }}>
                {width > 0 && height > 0 && (
                    <ResponsiveContainer width={Math.round(width)} height={Math.round(height)}>
                        <BarChart
                            data={chartData}
                            margin={{ top: 0, right: 0, left: 20, bottom: 1 }}
                        >
                            <XAxis 
                                dataKey="name" 
                                tick={{ fill: theme.palette.text.primary, fontSize: 12 }}
                                angle={-45}
                                textAnchor="end"
                                interval={0}
                                height={60}
                            />
                            <YAxis
                                domain={yAxisDomain}
                                tick={false}
                                axisLine={false}
                                width={0}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}/>
                            <Bar dataKey="Net Annual Interest" fill="#8884d8">
                                <LabelList
                                    dataKey="Net Annual Interest"
                                    position="top"
                                    style={{ fill: theme.palette.text.primary, fontSize: 12 }}
                                    formatter={(value) => `£${Math.round(value).toLocaleString()}`}
                                />
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry["Net Annual Interest"] === maxInterest ? '#82ca9d' : '#8884d8'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </Box>
            {optimalHorizon && (
                <Box sx={{ mt: 8, mb: 5 }}>
                    <Typography variant="h5" align="center">
                        For the best return use
                    </Typography>
                    <Typography variant="h1" align="center" sx={{ color: '#82ca9d', fontWeight: 'bold', mb: 3 }}>
                        {optimalHorizon.name}
                    </Typography>
                    <Typography variant="h5" align="center">
                        And invest your <strong>£{inputs.savings_goals[0].amount.toLocaleString()}</strong> as follows:
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default SimpleAnalysisSection; 