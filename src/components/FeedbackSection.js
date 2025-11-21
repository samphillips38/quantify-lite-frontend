import React from 'react';
import { Box, Typography, Card, CardContent, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, TextField, Button } from '@mui/material';

const usefulOptions = [
    { value: '1', label: 'Not at all' },
    { value: '2', label: '' },
    { value: '3', label: 'Somewhat' },
    { value: '4', label: '' },
    { value: '5', label: 'Extremely' },
];

const FeedbackSection = ({ nps, setNps, useful, setUseful, improvements, setImprovements, feedbackSubmitted, feedbackError, handleFeedbackSubmit, age, setAge }) => {
    return (
        !feedbackSubmitted ? (
            <Box>
                <Typography variant="h5" component="h2" align="left" sx={{ mb: 3, mt: 8, fontWeight: 600, color: '#2D1B4E' }}>
                    We'd love your <span style={{ color: '#9B7EDE' }}>feedback</span>!
                </Typography>
                <Card sx={{ mt: 4, p: 2 }}>
                    <CardContent>
                        <form onSubmit={handleFeedbackSubmit}>
                            <FormControl component="fieldset" margin="normal" required={false} fullWidth sx={{ mb: 4 }}>
                                <FormLabel component="legend">How useful did you find these recommendations?</FormLabel>
                                <RadioGroup
                                    row
                                    aria-label="useful"
                                    name="useful"
                                    value={useful}
                                    onChange={(e) => setUseful(e.target.value)}
                                    sx={{ justifyContent: 'space-between', width: '100%', display: 'flex', mt: 3 }}
                                >
                                    {usefulOptions.map(option => (
                                        <FormControlLabel
                                            key={option.value}
                                            value={option.value}
                                            control={<Radio />}
                                            label={<span style={{ fontSize: '0.8rem' }}>{option.label}</span>}
                                            labelPlacement="bottom"
                                            sx={{ flex: 1, m: 0, minWidth: 0, textAlign: 'center' }}
                                        />
                                    ))}
                                </RadioGroup>
                            </FormControl>
                            <FormControl component="fieldset" margin="normal" required={false} fullWidth sx={{ mb: 4 }}>
                                <FormLabel component="legend">On a scale of 1-10, how likely are you to recommend us to a friend or colleague?</FormLabel>
                                <Box sx={{ overflowX: 'auto', width: '100%' }}>
                                    <RadioGroup
                                        row
                                        aria-label="nps"
                                        name="nps"
                                        value={nps}
                                        onChange={(e) => setNps(e.target.value)}
                                        sx={{ flexWrap: 'nowrap', justifyContent: 'space-between', width: '100%', display: 'flex', mt: 3 }}
                                    >
                                        {[...Array(10).keys()].map(i => (
                                            <FormControlLabel
                                                key={i}
                                                value={i + 1}
                                                control={<Radio />}
                                                label={<span style={{ fontSize: '0.8rem' }}>{i + 1}</span>}
                                                labelPlacement="bottom"
                                                sx={{ flex: 1, m: 0, minWidth: 0, textAlign: 'center' }}
                                            />
                                        ))}
                                    </RadioGroup>
                                </Box>
                            </FormControl>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Your age"
                                type="number"
                                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', min: 0, max: 120, step: 1 }}
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                sx={{ mb: 4 }}
                                required
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Any other comments or improvements?"
                                multiline
                                rows={4}
                                value={improvements}
                                onChange={(e) => setImprovements(e.target.value)}
                                sx={{ mb: 2 }}
                            />
                            {feedbackError && (
                                <Typography color="error" sx={{ mt: 2, whiteSpace: 'pre-wrap' }}>
                                    {feedbackError}
                                </Typography>
                            )}
                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="medium"
                                    fullWidth
                                    sx={{
                                        fontWeight: 600,
                                        fontSize: '1.1rem',
                                        py: 2,
                                    }}
                                >
                                    Submit Feedback
                                </Button>
                            </Box>
                        </form>
                    </CardContent>
                </Card>
            </Box>
        ) : (
            <Typography variant="h6" align="center" sx={{ mt: 4 }}>
                Thank you for your feedback!
            </Typography>
        )
    );
};

export default FeedbackSection; 