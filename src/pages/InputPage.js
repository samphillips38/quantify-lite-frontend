import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
    const [displayEarnings, setDisplayEarnings] = useState('');
    const [totalSavings, setTotalSavings] = useState('');
    const [displayTotalSavings, setDisplayTotalSavings] = useState('');
    const [savingsGoals, setSavingsGoals] = useState([{ amount: '', displayAmount: '', horizon: 0 }]);
    const [isaAllowanceUsed, setIsaAllowanceUsed] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isSimpleView, setIsSimpleView] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    const formatCurrency = (rawValue) => {
        if (!rawValue && rawValue !== 0) return '';
        return new Intl.NumberFormat('en-GB', {
            style: 'currency',
            currency: 'GBP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(Number(rawValue));
    };

    useEffect(() => {
        if (location.state?.inputs) {
            const { inputs, isSimpleAnalysis } = location.state;

            const rawEarnings = inputs.earnings.toString();
            setEarnings(rawEarnings);
            setDisplayEarnings(formatCurrency(rawEarnings));

            setIsaAllowanceUsed(inputs.isa_allowance_used || 0);
            setIsSimpleView(isSimpleAnalysis);

            if (isSimpleAnalysis) {
                const rawTotalSavings = inputs.savings_goals[0]?.amount.toString() || '';
                setTotalSavings(rawTotalSavings);
                setDisplayTotalSavings(formatCurrency(rawTotalSavings));
                setSavingsGoals([{ amount: '', displayAmount: '', horizon: 0 }]);
            } else {
                const restoredGoals = inputs.savings_goals.map(goal => {
                    const rawAmount = goal.amount.toString();
                    return {
                        amount: rawAmount,
                        displayAmount: formatCurrency(rawAmount),
                        horizon: goal.horizon
                    };
                });
                setSavingsGoals(restoredGoals.length > 0 ? restoredGoals : [{ amount: '', displayAmount: '', horizon: 0 }]);
                setTotalSavings('');
                setDisplayTotalSavings('');
            }
        }
    }, [location.state]);

    const handleEarningsChange = (e) => {
        const rawValue = e.target.value.replace(/[^0-9]/g, '');
        setEarnings(rawValue);

        if (rawValue) {
            const formattedValue = new Intl.NumberFormat('en-GB', {
                style: 'currency',
                currency: 'GBP',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }).format(Number(rawValue));
            setDisplayEarnings(formattedValue);
        } else {
            setDisplayEarnings('');
        }
    };

    const handleTotalSavingsChange = (e) => {
        const rawValue = e.target.value.replace(/[^0-9]/g, '');
        setTotalSavings(rawValue);

        if (rawValue) {
            const formattedValue = new Intl.NumberFormat('en-GB', {
                style: 'currency',
                currency: 'GBP',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }).format(Number(rawValue));
            setDisplayTotalSavings(formattedValue);
        } else {
            setDisplayTotalSavings('');
        }
    };

    const handleAddGoal = () => {
        setSavingsGoals([...savingsGoals, { amount: '', displayAmount: '', horizon: 0 }]);
    };

    const handleGoalChange = (index, event) => {
        const { name, value } = event.target;
        const newGoals = savingsGoals.map((goal, i) => {
            if (i === index) {
                if (name === 'amount') {
                    const rawValue = value.replace(/[^0-9]/g, '');
                    const formattedValue = rawValue
                        ? new Intl.NumberFormat('en-GB', {
                            style: 'currency',
                            currency: 'GBP',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                        }).format(Number(rawValue))
                        : '';
                    return { ...goal, amount: rawValue, displayAmount: formattedValue };
                }
                return { ...goal, [name]: value };
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

        if (isSimpleView) {
            const horizonsToTest = [0, 6, 12, 36, 60];
            const promises = horizonsToTest.map(horizon => {
                const data = {
                    earnings: parseFloat(earnings),
                    savings_goals: [{
                        amount: parseFloat(totalSavings),
                        horizon: horizon,
                    }],
                    isa_allowance_used: 0,
                };
                return optimiseSavings(data, MOCK_DATA_ENABLED).then(result => ({ data: result.data, inputs: data }));
            });

            try {
                const results = await Promise.all(promises);
                const bestResult = results.reduce((best, current) => {
                    const currentInterest = current.data.summary?.net_annual_interest || 0;
                    const bestInterest = best.data.summary?.net_annual_interest || 0;
                    return currentInterest > bestInterest ? current : best;
                });
                navigate('/results', {
                    state: {
                        results: bestResult.data,
                        inputs: bestResult.inputs,
                        allResults: results,
                        isSimpleAnalysis: true
                    }
                });
            } catch (error) {
                console.error("Optimisation failed", error);
            } finally {
                setLoading(false);
            }
        } else {
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
                navigate('/results', { state: { results: result.data, inputs: data, isSimpleAnalysis: false } });
            } catch (error) {
                console.error("Optimisation failed", error);
            } finally {
                setLoading(false);
            }
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
                        label="Annual Earnings"
                        value={displayEarnings}
                        onChange={handleEarningsChange}
                        placeholder="e.g., £50,000"
                        required
                        variant="outlined"
                        margin="normal"
                        inputProps={{ inputMode: 'numeric' }}
                    />

                    {isSimpleView ? null : (
                        <>
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
                        </>
                    )}

                    {isSimpleView ? (
                        <>
                            <TextField
                                fullWidth
                                label="Total Savings Amount"
                                value={displayTotalSavings}
                                onChange={handleTotalSavingsChange}
                                placeholder="e.g., £25,000"
                                required
                                variant="outlined"
                                margin="normal"
                                inputProps={{ inputMode: 'numeric' }}
                            />
                            <Button onClick={() => setIsSimpleView(false)} sx={{ mt: 1 }}>
                                Specify Specific Savings Goals
                            </Button>
                        </>
                    ) : (
                        <>
                            <Typography variant="h5" component="h2" sx={{ mt: 4, mb: 2 }}>
                                Savings Goals
                            </Typography>

                            {savingsGoals.map((goal, index) => (
                                <Paper key={index} variant="outlined" sx={{ p: 2, mb: 2, position: 'relative', borderRadius: 2 }}>
                                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, alignItems: 'center' }}>
                                        <TextField
                                            label="Amount to Save"
                                            name="amount"
                                            value={goal.displayAmount}
                                            onChange={(e) => handleGoalChange(index, e)}
                                            placeholder="e.g., £10,000"
                                            required
                                            sx={{ flexGrow: 1, width: '100%' }}
                                            inputProps={{ inputMode: 'numeric' }}
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
                            <Button onClick={() => setIsSimpleView(true)} sx={{ mt: 1, ml: 2 }}>
                                Use Total Savings Amount
                            </Button>
                        </>
                    )}

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