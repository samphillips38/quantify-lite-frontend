import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Container, Box, Typography, TextField, Button,
    Select, MenuItem, FormControl, InputLabel, IconButton,
    CircularProgress, Paper, Slider, Popover, InputAdornment
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import InfoIcon from '@mui/icons-material/Info';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

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
    const [otherSavingsIncome, setOtherSavingsIncome] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isSimpleView, setIsSimpleView] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);
    const [savingsAnchorEl, setSavingsAnchorEl] = useState(null);
    const [showFineTuneSection, setShowFineTuneSection] = useState(false);
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

    const handleInfoClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleInfoClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'tax-info-popover' : undefined;

    const handleSavingsInfoClick = (event) => {
        setSavingsAnchorEl(event.currentTarget);
    };

    const handleSavingsInfoClose = () => {
        setSavingsAnchorEl(null);
    };

    const savingsInfoOpen = Boolean(savingsAnchorEl);
    const savingsInfoId = savingsInfoOpen ? 'savings-info-popover' : undefined;

    useEffect(() => {
        if (location.state?.inputs) {
            const { inputs, isSimpleAnalysis } = location.state;

            // Restore earnings
            const rawEarnings = inputs.earnings?.toString() || '';
            setEarnings(rawEarnings);
            setDisplayEarnings(formatCurrency(rawEarnings));

            // Restore ISA allowance
            setIsaAllowanceUsed(inputs.isa_allowance_used || 0);
            setOtherSavingsIncome(inputs.other_savings_income || 0);
            setShowFineTuneSection((inputs.isa_allowance_used > 0) || (inputs.other_savings_income > 0));

            // Restore view mode
            setIsSimpleView(isSimpleAnalysis);

            if (isSimpleAnalysis) {
                // Restore total savings
                const rawTotalSavings = inputs.savings_goals?.[0]?.amount?.toString() || '';
                setTotalSavings(rawTotalSavings);
                setDisplayTotalSavings(formatCurrency(rawTotalSavings));
                setSavingsGoals([{ amount: '', displayAmount: '', horizon: 0 }]);
            } else {
                // Restore savings goals breakdown
                const restoredGoals = (inputs.savings_goals || []).map(goal => {
                    const rawAmount = goal.amount?.toString() || '';
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

    const handleFineTuneToggle = () => {
        setShowFineTuneSection((prev) => {
            const newShow = !prev;
            if (!newShow) {
                setIsaAllowanceUsed(0); // Full ISA left if hidden
                setOtherSavingsIncome(0); // Reset savings income if hidden
            }
            return newShow;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Prepare the data to pass to the loading page
        const inputs = isSimpleView 
            ? {
                earnings: parseFloat(earnings),
                savings_goals: [{
                    amount: parseFloat(totalSavings),
                    horizon: 0, // This will be overridden in loading page
                }],
                isa_allowance_used: isaAllowanceUsed,
                other_savings_income: otherSavingsIncome,
            }
            : {
                earnings: parseFloat(earnings),
                savings_goals: savingsGoals.map(goal => ({
                    amount: parseFloat(goal.amount),
                    horizon: goal.horizon,
                })),
                isa_allowance_used: isaAllowanceUsed,
                other_savings_income: otherSavingsIncome,
            };

        // Navigate to loading page with the inputs
        navigate('/loading', {
            state: {
                inputs: inputs,
                isSimpleAnalysis: isSimpleView
            }
        });
    };

    return (
        <Container maxWidth="md">
            <Paper elevation={3} sx={{ my: { xs: 2, sm: 4 }, p: { xs: 2, sm: 4 }, borderRadius: 3 }}>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <DotLottieReact
                        src="/animations/ThinkingCharts.lottie"
                        loop
                        autoplay
                        style={{ height: '150px', width: '150px', margin: 'auto', marginBottom: '16px' }}
                    />
                    <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Just Save It.
                    </Typography>
                    <Typography variant="h7" color="text.secondary">
                        No time to sort out your savings? Overwhelmed by your options? In a tangle over your tax? Intimidated by ISAs?
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                        Answer these two questions and get your savings sorted.
                    </Typography>
                </Box>
                <form onSubmit={handleSubmit}>
                    <Popover
                        id={id}
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleInfoClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                    >
                        <Box sx={{ p: 2, maxWidth: 400, border: '1px solid #ddd', borderRadius: '4px', boxShadow: 3 }}>
                            <Typography variant="h6" gutterBottom>Don't Worry!</Typography>
                            <Typography variant="body2" paragraph>
                                A rough estimate is all we need! You only have to be accurate if you are near:
                            </Typography>
                            <Typography variant="body2" paragraph>
                                <strong>£50,270 (when tax goes from 20% to 40%)</strong>
                            </Typography>
                            <Typography variant="body2" paragraph>
                                <strong>£125,140 (when tax goes from 40% to 45%)</strong>
                            </Typography>
                            <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                                By earnings we mean your total income; salary, bonuses, dividends, rent receipts, etc. before tax.
                            </Typography>
                        </Box>
                    </Popover>
                    <Popover
                        id={savingsInfoId}
                        open={savingsInfoOpen}
                        anchorEl={savingsAnchorEl}
                        onClose={handleSavingsInfoClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                    >
                        <Box sx={{ p: 2, maxWidth: 400, border: '1px solid #ddd', borderRadius: '4px', boxShadow: 3 }}>
                            <Typography variant="h6" gutterBottom>About Total Savings</Typography>
                            <Typography variant="body2">
                                Please enter the amount you're looking to save. Don't include the money you can't access because its locked away.
                            </Typography>
                        </Box>
                    </Popover>
                    <Typography variant="h5" sx={{ mt: 4, mb: 2, textAlign: 'center' }}>
                        Roughly how much...
                    </Typography>
                    <TextField
                        fullWidth
                        label="...will you earn this tax year?"
                        value={displayEarnings}
                        onChange={handleEarningsChange}
                        placeholder="e.g., £50,000"
                        required
                        variant="outlined"
                        margin="normal"
                        inputProps={{ inputMode: 'numeric' }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleInfoClick} edge="end">
                                        <InfoIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    {isSimpleView ? (
                        <>
                            <TextField
                                fullWidth
                                label="...would you like to save?"
                                value={displayTotalSavings}
                                onChange={handleTotalSavingsChange}
                                placeholder="e.g., £25,000"
                                required
                                variant="outlined"
                                margin="normal"
                                inputProps={{ inputMode: 'numeric' }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={handleSavingsInfoClick} edge="end">
                                                <InfoIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1, mb: 2 }}>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={() => setIsSimpleView(false)}
                                >
                                    Savings Breakdown
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={handleFineTuneToggle}
                                >
                                    {showFineTuneSection ? 'Hide Fine-tune Options' : 'Fine-tune Options'}
                                </Button>
                            </Box>
                        </>
                    ) : (
                        <>
                            <Typography variant="h5" component="h2" sx={{ mt: 4, mb: 2 }}>
                                Savings Breakdown
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
                            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                                <Button
                                    type="button"
                                    onClick={handleAddGoal}
                                    startIcon={<AddCircleOutlineIcon />}
                                >
                                    Add Another Savings Goal
                                </Button>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1, mb: 2 }}>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={() => setIsSimpleView(true)}
                                >
                                    Use Total Savings
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={handleFineTuneToggle}
                                >
                                    {showFineTuneSection ? 'Hide Fine-tune Options' : 'Fine-tune Options'}
                                </Button>
                            </Box>
                        </>
                    )}

                    {showFineTuneSection && (
                        <Box sx={{ mt: 3 }}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'medium' }}>
                                Fine-tune Your Optimization
                            </Typography>
                            
                            <Box sx={{ mb: 3 }}>
                                <Typography id="isa-slider-label" gutterBottom sx={{ fontWeight: 'medium' }}>
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
                            </Box>

                            <Box>
                                <Typography id="savings-income-slider-label" gutterBottom sx={{ fontWeight: 'medium' }}>
                                    Other Savings Income (£{otherSavingsIncome.toLocaleString()}{otherSavingsIncome >= 1000 ? ' or more' : ''})
                                </Typography>
                                <Box sx={{ px: 1 }}>
                                    <Slider
                                        aria-labelledby="savings-income-slider-label"
                                        value={otherSavingsIncome}
                                        onChange={(e, newValue) => setOtherSavingsIncome(newValue)}
                                        valueLabelDisplay="auto"
                                        step={50}
                                        marks
                                        min={0}
                                        max={1000}
                                    />
                                </Box>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    Enter any savings interest you're already earning from other accounts
                                </Typography>
                            </Box>
                        </Box>
                    )}

                    <Box sx={{ mt: 3, position: 'relative' }}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            size="large"
                            fullWidth
                            disabled={loading}
                            sx={{
                                backgroundColor: 'rgba(255,255,255,0.15)',
                                color: '#fff',
                                '&:hover': {
                                    backgroundColor: 'rgba(255,255,255,0.25)',
                                },
                                boxShadow: 'none',
                            }}
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