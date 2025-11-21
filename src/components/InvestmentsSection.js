import React from 'react';
import { Box, Typography, Card, CardContent, CardActionArea, Chip } from '@mui/material';
import Grid from '@mui/material/Grid';

const InvestmentsSection = ({ investments }) => {
    if (!investments || investments.length === 0) return null;
    return (
        <>
            <Typography variant="h5" component="h2" align="left" sx={{ mb: 3, mt: 8, fontWeight: 600, color: '#2D1B4E' }}>
                {investments.length === 1 ? (
                    <>By saving in this{' '}
                        <span style={{ color: '#9B7EDE', fontWeight: 600 }}>account</span>...
                    </>
                ) : (
                    <>By saving in these{' '}
                        <span style={{ color: '#9B7EDE', fontWeight: 600 }}>{investments.length} accounts</span>...
                    </>
                )}
            </Typography>
            <Grid container spacing={4}>
                {investments.map((item, index) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                        <CardActionArea component="a" href={item.url} target="_blank" rel="noopener noreferrer" sx={{ width: '100%', height: '100%' }}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2.5 }}>
                                    {/* Card Header */}
                                    <Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="subtitle1" color="text.secondary" sx={{ fontWeight: 'medium' }}>
                                                {item.platform}
                                            </Typography>
                                            <Chip label={item.is_isa ? 'ISA' : 'Standard'} size="small" variant="outlined" />
                                        </Box>
                                        <Typography gutterBottom variant="h5" component="h2" sx={{ fontWeight: 'bold', wordWrap: 'break-word', minHeight: '2.8em', lineHeight: '1.4em', my: 1.5 }}>
                                            {item.account_name}
                                        </Typography>
                                    </Box>

                                    {/* Financial Details */}
                                    <Box sx={{ mt: 'auto', pt: 2, borderTop: 1, borderColor: 'divider' }}>
                                        <Grid container spacing={0.5}>
                                            <Grid size={{ xs: 7 }}>
                                                <Typography variant="body1" color="text.secondary">Amount to Invest:</Typography>
                                            </Grid>
                                            <Grid size={{ xs: 5 }} sx={{ textAlign: 'right' }}>
                                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>£{parseFloat(item.amount).toLocaleString()}</Typography>
                                            </Grid>
                                            <Grid size={{ xs: 7 }}>
                                                <Typography variant="body1" color="text.secondary">AER:</Typography>
                                            </Grid>
                                            <Grid size={{ xs: 5 }} sx={{ textAlign: 'right' }}>
                                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{item.aer}%</Typography>
                                            </Grid>
                                            <Grid size={{ xs: 7 }}>
                                                <Typography variant="body1" color="text.secondary">Term:</Typography>
                                            </Grid>
                                            <Grid size={{ xs: 5 }} sx={{ textAlign: 'right' }}>
                                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{item.term}</Typography>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </CardContent>
                            </Card>
                        </CardActionArea>
                    </Grid>
                ))}
            </Grid>
        </>
    );
};

export default InvestmentsSection; 