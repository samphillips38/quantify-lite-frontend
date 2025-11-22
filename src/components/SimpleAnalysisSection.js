import React, { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';

const CustomTooltip = React.memo(({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <Box sx={{ 
                p: 2, 
                backgroundColor: '#FFFFFF', 
                border: '1px solid rgba(155, 126, 222, 0.2)', 
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(155, 126, 222, 0.2)'
            }}>
                <Box>
                    {data.investments.length > 0 ? data.investments.map((inv, index) => (
                        <Typography key={index} variant="body2" sx={{ color: '#2D1B4E', lineHeight: 1.6 }}>
                            {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(inv.amount)} @ {inv.aer}% {inv.is_isa ? '(ISA)' : ''}
                        </Typography>
                    )) : (
                        <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#6B5B8A' }}>
                            No specific investments.
                        </Typography>
                    )}
                </Box>
            </Box>
        );
    }
    return null;
});

CustomTooltip.displayName = 'CustomTooltip';

const SimpleAnalysisSection = React.memo(({ allResults, isSimpleAnalysis, chartData, yAxisDomain, maxInterest, optimalHorizon, inputs }) => {
    // Memoize the cell colors to avoid recalculating on every render
    const cellColors = useMemo(() => {
        return chartData.map((entry) => 
            entry["Net Annual Interest"] === maxInterest ? '#9B7EDE' : '#C4B5E8'
        );
    }, [chartData, maxInterest]);

    // Memoize the label formatter
    const labelFormatter = useMemo(() => 
        (value) => `£${Math.round(value).toLocaleString()}`,
        []
    );

    if (!(isSimpleAnalysis && allResults)) return null;
    
    return (
        <Box sx={{ mb: 4 }}>
            <Typography variant="h5" component="h2" align="left" sx={{ mb: 3, mt: 8, fontWeight: 600, color: '#2D1B4E' }}>
                <span style={{ color: '#9B7EDE' }}>How long</span> should you lock it away for?
            </Typography>
            <Box sx={{ width: '100%', height: 300 }}>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                        data={chartData}
                        margin={{ top: 0, right: 0, left: 20, bottom: 1 }}
                    >
                        <XAxis 
                            dataKey="name" 
                            tick={{ fill: '#2D1B4E', fontSize: 12 }}
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
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(155, 126, 222, 0.1)' }}/>
                        <Bar dataKey="Net Annual Interest" fill="#9B7EDE">
                            <LabelList
                                dataKey="Net Annual Interest"
                                position="top"
                                style={{ fill: '#2D1B4E', fontSize: 12, fontWeight: 500 }}
                                formatter={labelFormatter}
                            />
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={cellColors[index]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </Box>
            {optimalHorizon && (
                <Box sx={{ mt: 8, mb: 5 }}>
                    <Typography variant="h5" align="center">
                        The best return today is over
                    </Typography>
                    <Typography variant="h1" align="center" sx={{ color: '#9B7EDE', fontWeight: 700, mb: 3 }}>
                        {optimalHorizon.name}
                    </Typography>
                    <Typography variant="h5" align="center">
                        with your <strong>£{inputs.savings_goals[0].amount.toLocaleString()}</strong> invested like this:
                    </Typography>
                </Box>
            )}
        </Box>
    );
});

SimpleAnalysisSection.displayName = 'SimpleAnalysisSection';

export default SimpleAnalysisSection; 