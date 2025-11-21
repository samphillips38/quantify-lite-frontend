import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Container, Box, Typography, TextField, Button,
    Select, MenuItem, FormControl, InputLabel, IconButton,
    CircularProgress, Slider, Popover, InputAdornment, Card, CardContent
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import InfoIcon from '@mui/icons-material/Info';
import { motion } from 'framer-motion';


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
        <Container maxWidth="md" sx={{ py: { xs: 3, sm: 6 } }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Typography 
                        variant="h3" 
                        component="h1" 
                        gutterBottom 
                        sx={{ 
                            fontWeight: 700,
                            color: '#2D1B4E',
                            mb: 2,
                            letterSpacing: '-0.02em'
                        }}
                    >
                        Just Save It.
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto' }}>
                        No time to sort out your savings? Overwhelmed by your options? In a tangle over your tax? Intimidated by ISAs?
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                        Answer these two questions and get your savings sorted.
                    </Typography>
                </Box>

                <form onSubmit={handleSubmit}>
                    <Card sx={{ mb: 3, borderRadius: 3 }}>
                        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                    <Popover
                        id={id}
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleInfoClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        PaperProps={{
                            sx: {
                                borderRadius: 3,
                                boxShadow: '0 8px 32px rgba(155, 126, 222, 0.2)',
                                border: '1px solid rgba(155, 126, 222, 0.2)',
                            }
                        }}
                    >
                        <Box sx={{ p: 3, maxWidth: 400 }}>
                            <Typography variant="h6" gutterBottom sx={{ color: '#2D1B4E', fontWeight: 600 }}>Don't Worry!</Typography>
                            <Typography variant="body2" paragraph sx={{ color: '#6B5B8A' }}>
                                A rough estimate is all we need! You only have to be accurate if you are near:
                            </Typography>
                            <Typography variant="body2" paragraph sx={{ color: '#6B5B8A' }}>
                                <strong>£50,270 (when tax goes from 20% to 40%)</strong>
                            </Typography>
                            <Typography variant="body2" paragraph sx={{ color: '#6B5B8A' }}>
                                <strong>£125,140 (when tax goes from 40% to 45%)</strong>
                            </Typography>
                            <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#6B5B8A' }}>
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
                        PaperProps={{
                            sx: {
                                borderRadius: 3,
                                boxShadow: '0 8px 32px rgba(155, 126, 222, 0.2)',
                                border: '1px solid rgba(155, 126, 222, 0.2)',
                            }
                        }}
                    >
                        <Box sx={{ p: 3, maxWidth: 400 }}>
                            <Typography variant="h6" gutterBottom sx={{ color: '#2D1B4E', fontWeight: 600 }}>About Total Savings</Typography>
                            <Typography variant="body2" sx={{ color: '#6B5B8A' }}>
                                Please enter the amount you're looking to save. Don't include the money you can't access because its locked away.
                            </Typography>
                        </Box>
                    </Popover>
                    
                    <Typography variant="h6" sx={{ mb: 3, color: '#2D1B4E', fontWeight: 600 }}>
                        Roughly how much...
                    </Typography>
                    
                    <motion.div
                        whileHover={{ scale: 1.01 }}
                        transition={{ duration: 0.2 }}
                    >
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
                                        <IconButton 
                                            onClick={handleInfoClick} 
                                            edge="end"
                                            sx={{ color: '#9B7EDE' }}
                                        >
                                            <InfoIcon />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ mb: 3 }}
                        />
                    </motion.div>

                    {isSimpleView ? (
                        <>
                            <motion.div
                                whileHover={{ scale: 1.01 }}
                                transition={{ duration: 0.2 }}
                            >
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
                                                <IconButton 
                                                    onClick={handleSavingsInfoClick} 
                                                    edge="end"
                                                    sx={{ color: '#9B7EDE' }}
                                                >
                                                    <InfoIcon />
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ mb: 3 }}
                                />
                            </motion.div>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                                <Button
                                    variant="outlined"
                                    size="medium"
                                    onClick={() => setIsSimpleView(false)}
                                    sx={{ flex: 1, minWidth: '150px' }}
                                >
                                    Savings Breakdown
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="medium"
                                    onClick={handleFineTuneToggle}
                                    sx={{ flex: 1, minWidth: '150px' }}
                                >
                                    {showFineTuneSection ? 'Hide Fine-tune' : 'Fine-tune Options'}
                                </Button>
                            </Box>
                        </>
                    ) : (
                        <>
                            <Typography variant="h6" component="h2" sx={{ mb: 3, color: '#2D1B4E', fontWeight: 600 }}>
                                Savings Breakdown
                            </Typography>
                            {savingsGoals.map((goal, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                >
                                    <Card 
                                        variant="outlined" 
                                        sx={{ 
                                            p: 2.5, 
                                            mb: 2, 
                                            position: 'relative', 
                                            borderRadius: 3,
                                            border: '1px solid rgba(155, 126, 222, 0.2)',
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, alignItems: { sm: 'center' } }}>
                                            <TextField
                                                label="Amount to Save"
                                                name="amount"
                                                value={goal.displayAmount}
                                                onChange={(e) => handleGoalChange(index, e)}
                                                placeholder="e.g., £10,000"
                                                required
                                                sx={{ flexGrow: 1 }}
                                                inputProps={{ inputMode: 'numeric' }}
                                            />
                                            <FormControl sx={{ minWidth: {sm: 180}, width: { xs: '100%', sm: 'auto' } }}>
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
                                                <IconButton 
                                                    onClick={() => handleRemoveGoal(index)} 
                                                    sx={{ 
                                                        color: '#9B7EDE',
                                                        position: { xs: 'absolute', sm: 'static' }, 
                                                        top: 16, 
                                                        right: 8
                                                    }}
                                                >
                                                    <RemoveCircleOutlineIcon />
                                                </IconButton>
                                            )}
                                        </Box>
                                    </Card>
                                </motion.div>
                            ))}
                            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                                <Button
                                    type="button"
                                    onClick={handleAddGoal}
                                    startIcon={<AddCircleOutlineIcon />}
                                    variant="outlined"
                                >
                                    Add Another Savings Goal
                                </Button>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                                <Button
                                    variant="outlined"
                                    size="medium"
                                    onClick={() => setIsSimpleView(true)}
                                    sx={{ flex: 1, minWidth: '150px' }}
                                >
                                    Use Total Savings
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="medium"
                                    onClick={handleFineTuneToggle}
                                    sx={{ flex: 1, minWidth: '150px' }}
                                >
                                    {showFineTuneSection ? 'Hide Fine-tune' : 'Fine-tune Options'}
                                </Button>
                            </Box>
                        </>
                    )}

                    {showFineTuneSection && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card sx={{ mt: 3, borderRadius: 3, border: '1px solid rgba(155, 126, 222, 0.2)' }}>
                                <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#2D1B4E' }}>
                                        Fine-tune Your Optimization
                                    </Typography>
                                    
                                    <Box sx={{ mb: 4 }}>
                                        <Typography id="isa-slider-label" gutterBottom sx={{ fontWeight: 500, color: '#2D1B4E', mb: 2 }}>
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
                                                sx={{
                                                    color: '#9B7EDE',
                                                    '& .MuiSlider-thumb': {
                                                        '&:hover': {
                                                            boxShadow: '0 0 0 8px rgba(155, 126, 222, 0.16)',
                                                        },
                                                    },
                                                }}
                                            />
                                        </Box>
                                    </Box>

                                    <Box>
                                        <Typography id="savings-income-slider-label" gutterBottom sx={{ fontWeight: 500, color: '#2D1B4E', mb: 2 }}>
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
                                                sx={{
                                                    color: '#9B7EDE',
                                                    '& .MuiSlider-thumb': {
                                                        '&:hover': {
                                                            boxShadow: '0 0 0 8px rgba(155, 126, 222, 0.16)',
                                                        },
                                                    },
                                                }}
                                            />
                                        </Box>
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                                            Enter any savings interest you're already earning from other accounts
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                        </CardContent>
                    </Card>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            fullWidth
                            disabled={loading}
                            sx={{
                                mt: 3,
                                py: 2,
                                fontSize: '1.1rem',
                                fontWeight: 600,
                            }}
                        >
                            {loading ? (
                                <CircularProgress size={24} sx={{ color: '#FFFFFF' }} />
                            ) : (
                                'Optimise Savings'
                            )}
                        </Button>
                    </motion.div>
                </form>
            </motion.div>
        </Container>
    );
};

export default InputPage; 