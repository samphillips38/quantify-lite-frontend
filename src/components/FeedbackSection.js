import React from 'react';
import { Box, Typography, Card, CardContent, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, TextField, Button } from '@mui/material';

const FeedbackSection = ({ nps, setNps, useful, setUseful, improvements, setImprovements, feedbackSubmitted, feedbackError, handleFeedbackSubmit }) => {
    return (
        !feedbackSubmitted ? (
            <Box>
                <Typography variant="h4" component="h2" align="left" sx={{ mb: 2, mt: 8 }}>
                    We'd love your <span style={{ color: '#82ca9d' }}>feedback</span>!
                </Typography>
                <Card sx={{ mt: 4, p: 2 }}>
                    <CardContent>
                        <form onSubmit={handleFeedbackSubmit}>
                            <FormControl component="fieldset" margin="normal" required fullWidth>
                                <FormLabel component="legend">On a scale of 0-10, how likely are you to recommend us to a friend or colleague?</FormLabel>
                                <RadioGroup
                                    row
                                    aria-label="nps"
                                    name="nps"
                                    value={nps}
                                    onChange={(e) => setNps(e.target.value)}
                                >
                                    {[...Array(11).keys()].map(i => (
                                        <FormControlLabel key={i} value={i} control={<Radio />} label={i} />
                                    ))}
                                </RadioGroup>
                            </FormControl>
                            <FormControl component="fieldset" margin="normal" required>
                                <FormLabel component="legend">Did you find these recommendations useful?</FormLabel>
                                <RadioGroup
                                    row
                                    aria-label="useful"
                                    name="useful"
                                    value={useful}
                                    onChange={(e) => setUseful(e.target.value)}
                                >
                                    <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                                    <FormControlLabel value="no" control={<Radio />} label="No" />
                                </RadioGroup>
                            </FormControl>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="How could we improve the recommendations?"
                                multiline
                                rows={4}
                                value={improvements}
                                onChange={(e) => setImprovements(e.target.value)}
                            />
                            {feedbackError && (
                                <Typography color="error" sx={{ mt: 2, whiteSpace: 'pre-wrap' }}>
                                    {feedbackError}
                                </Typography>
                            )}
                            <Box sx={{ mt: 2 }}>
                                <Button type="submit" variant="contained">
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