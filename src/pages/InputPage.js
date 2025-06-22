import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { optimiseSavings } from '../services/api';
import {
    Container, Box, Typography, TextField, Button,
    Select, MenuItem, FormControl, InputLabel, IconButton,
    CircularProgress, Paper, Slider
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

const MOCK_DATA_ENABLED = false; // Set to false to use live data

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

const InputPage = () => {
    const [earnings, setEarnings] = useState('');
    const [savingsGoals, setSavingsGoals] = useState([{ amount: '', horizon: 0 }]);
    const [isaAllowanceUsed, setIsaAllowanceUsed] = useState(0);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleAddGoal = () => {
        setSavingsGoals([...savingsGoals, { amount: '', horizon: 0 }]);
    };

    const handleGoalChange = (index, event) => {
        const newGoals = savingsGoals.map((goal, i) => {
            if (i === index) {
                return { ...goal, [event.target.name]: event.target.value };
            }
            return goal;
        });
        setSavingsGoals(newGoals);
    };

    const handleRemoveGoal = (index) => {
        const newGoals = savingsGoals.filter((_, i) => i !== index);
        setSavingsGoals(newGoals);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = {
            earnings: parseFloat(earnings),
            savings_goals: savingsGoals.map(goal => ({
                amount: parseFloat(goal.amount),
                horizon: goal.horizon,
            })),
            isa_allowance_used: isaAllowanceUsed,
        };

        try {
            const result = await optimiseSavings(data, MOCK_DATA_ENABLED);
            navigate('/results', { state: { results: result.data, inputs: data } });
        } catch (error) {
            console.error("Optimisation failed", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md">
            <Paper elevation={3} sx={{ my: { xs: 2, sm: 4 }, p: { xs: 2, sm: 4 }, borderRadius: 3 }}>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography variant="h3" component="h1" gutterBottom>
                        Savings Optimiser
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                        Enter your financial details to get a personalised investment plan.
                    </Typography>
                </Box>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Annual Earnings (£)"
                        type="number"
                        value={earnings}
                        onChange={(e) => setEarnings(e.target.value)}
                        placeholder="e.g., 50000"
                        required
                        variant="outlined"
                        margin="normal"
                    />

                    <Typography id="isa-slider-label" gutterBottom sx={{ mt: 4, fontWeight: 'medium' }}>
                        ISA Allowance Used (£{isaAllowanceUsed.toLocaleString()})
                    </Typography>
                    <Box sx={{ px: 1 }}>
                        <Slider
                            aria-labelledby="isa-slider-label"
                            value={isaAllowanceUsed}
                            onChange={(e, newValue) => setIsaAllowanceUsed(newValue)}
                            valueLabelDisplay="auto"
                            step={500}
                            marks
                            min={0}
                            max={20000}
                        />
                    </Box>

                    <Typography variant="h5" component="h2" sx={{ mt: 4, mb: 2 }}>
                        Savings Goals
                    </Typography>

                    {savingsGoals.map((goal, index) => (
                        <Paper key={index} variant="outlined" sx={{ p: 2, mb: 2, position: 'relative', borderRadius: 2 }}>
                            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, alignItems: 'center' }}>
                                <TextField
                                    label="Amount to Save (£)"
                                    type="number"
                                    name="amount"
                                    value={goal.amount}
                                    onChange={(e) => handleGoalChange(index, e)}
                                    placeholder="e.g., 10000"
                                    required
                                    sx={{ flexGrow: 1, width: '100%' }}
                                />
                                <FormControl sx={{ minWidth: {sm: 180}, width: '100%' }}>
                                    <InputLabel>Time Horizon</InputLabel>
                                    <Select
                                        name="horizon"
                                        value={goal.horizon}
                                        onChange={(e) => handleGoalChange(index, e)}
                                        label="Time Horizon"
                                    >
                                        {horizonOptions.map(option => (
                                            <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                {savingsGoals.length > 1 && (
                                    <IconButton onClick={() => handleRemoveGoal(index)} color="secondary" sx={{ position: { xs: 'absolute', sm: 'static' }, top: 16, right: 8}}>
                                        <RemoveCircleOutlineIcon />
                                    </IconButton>
                                )}
                            </Box>
                        </Paper>
                    ))}

                    <Button
                        type="button"
                        onClick={handleAddGoal}
                        startIcon={<AddCircleOutlineIcon />}
                        sx={{ mt: 1 }}
                    >
                        Add Another Savings Goal
                    </Button>

                    <Box sx={{ mt: 3, position: 'relative' }}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            size="large"
                            fullWidth
                            disabled={loading}
                        >
                            Optimise Savings
                        </Button>
                        {loading && (
                            <CircularProgress
                                size={24}
                                sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    marginTop: '-12px',
                                    marginLeft: '-12px',
                                }}
                            />
                        )}
                    </Box>
                </form>
            </Paper>
        </Container>
    );
};

export default InputPage; 