import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { optimiseSavings } from '../services/api';
import {
    Container, Box, Typography, TextField, Button,
    Select, MenuItem, FormControl, InputLabel, IconButton,
    CircularProgress, Slider, Popover, InputAdornment,
    Alert, Collapse, Chip, Stack
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import InfoIcon from '@mui/icons-material/Info';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import LoadingOverlay from '../components/LoadingOverlay';
import FormPersistenceNotification from '../components/FormPersistenceNotification';

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
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [showIsaSlider, setShowIsaSlider] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [savingsAnchorEl, setSavingsAnchorEl] = useState(null);
    const [showFineTuneSection, setShowFineTuneSection] = useState(false);
    const [formTouched, setFormTouched] = useState(false);
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

    // Form validation functions
    const validateEarnings = (value) => {
        const numValue = parseFloat(value);
        if (!value) return 'Annual earnings is required';
        if (isNaN(numValue)) return 'Please enter a valid number';
        if (numValue < 0) return 'Earnings cannot be negative';
        if (numValue > 10000000) return 'Please enter a realistic amount';
        return '';
    };

    const validateSavings = (value, fieldName = 'savings amount') => {
        const numValue = parseFloat(value);
        if (!value) return `${fieldName} is required`;
        if (isNaN(numValue)) return 'Please enter a valid number';
        if (numValue < 0) return 'Amount cannot be negative';
        if (numValue > 1000000) return 'Please enter a realistic amount';
        return '';
    };

    // Form persistence
    const saveFormToStorage = useCallback(() => {
        const formData = {
            earnings,
            totalSavings,
            savingsGoals,
            isaAllowanceUsed,
            isSimpleView,
            showAdvanced,
            showIsaSlider,
            timestamp: Date.now()
        };
        localStorage.setItem('quantifyLiteForm', JSON.stringify(formData));
    }, [earnings, totalSavings, savingsGoals, isaAllowanceUsed, isSimpleView, showAdvanced, showIsaSlider]);

    const loadFormFromStorage = () => {
        try {
            const saved = localStorage.getItem('quantifyLiteForm');
            if (saved) {
                const formData = JSON.parse(saved);
                // Only restore if saved within last 24 hours
                if (Date.now() - formData.timestamp < 24 * 60 * 60 * 1000) {
                    return formData;
                }
            }
        } catch (error) {
            console.error('Error loading form data:', error);
        }
        return null;
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
            setShowIsaSlider(inputs.isa_allowance_used > 0);

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
        } else {
            // Try to load saved form data if no state from navigation
            const savedData = loadFormFromStorage();
            if (savedData) {
                setEarnings(savedData.earnings || '');
                setDisplayEarnings(formatCurrency(savedData.earnings));
                setTotalSavings(savedData.totalSavings || '');
                setDisplayTotalSavings(formatCurrency(savedData.totalSavings));
                setSavingsGoals(savedData.savingsGoals || [{ amount: '', displayAmount: '', horizon: 0 }]);
                setIsaAllowanceUsed(savedData.isaAllowanceUsed || 0);
                setIsSimpleView(savedData.isSimpleView ?? true);
                setShowAdvanced(savedData.showAdvanced || false);
                setShowIsaSlider(savedData.showIsaSlider || false);
            }
        }
    }, [location.state]);

    // Auto-save form data when it changes
    useEffect(() => {
        if (formTouched) {
            const timeoutId = setTimeout(() => {
                saveFormToStorage();
            }, 1000); // Save 1 second after user stops typing
            return () => clearTimeout(timeoutId);
        }
    }, [earnings, totalSavings, savingsGoals, isaAllowanceUsed, isSimpleView, showAdvanced, showIsaSlider, formTouched, saveFormToStorage]);

    const handleEarningsChange = (e) => {
        const rawValue = e.target.value.replace(/[^0-9]/g, '');
        setEarnings(rawValue);
        setFormTouched(true);

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
        setFormTouched(true);

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
        setFormTouched(true);
        
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
        
        // Validate form before submission
        const earningsValidation = validateEarnings(earnings);
        const savingsValidation = isSimpleView 
            ? validateSavings(totalSavings, 'total savings amount')
            : '';
        
        // Check savings goals validation in breakdown mode
        let hasGoalErrors = false;
        if (!isSimpleView) {
            const goalErrors = savingsGoals.some(goal => {
                const error = validateSavings(goal.amount, 'savings goal amount');
                return error !== '';
            });
            hasGoalErrors = goalErrors;
        }
        
        if (earningsValidation || savingsValidation || hasGoalErrors) {
            return;
        }
        
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
                    isa_allowance_used: isaAllowanceUsed,
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
                setSubmitError('Failed to optimize your savings. Please check your internet connection and try again.');
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
                setSubmitError('Failed to optimize your savings. Please check your internet connection and try again.');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <Container maxWidth="sm" sx={{ py: 3 }}>
            <Box sx={{ mb: 3, textAlign: 'center' }}>
                <DotLottieReact
                    src="/animations/ThinkingCharts.lottie"
                    loop
                    autoplay
                    style={{ height: '120px', width: '120px', margin: 'auto', marginBottom: '16px' }}
                />
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 300, mb: 1 }}>
                    Just Save It
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Two simple questions to optimize your savings
                </Typography>
            </Box>

            <FormPersistenceNotification 
                show={showRestoredNotification}
                onClose={() => setShowRestoredNotification(false)}
            />

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
                    <Box sx={{ p: 2, maxWidth: 300 }}>
                        <Typography variant="body2" paragraph>
                            Enter your total income before tax (salary, bonuses, dividends, etc.)
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            Key tax brackets: £50,270 (40% tax) and £125,140 (45% tax)
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
                    <Box sx={{ p: 2, maxWidth: 300 }}>
                        <Typography variant="body2">
                            Enter the amount you want to save (excluding locked-away money)
                        </Typography>
                    </Box>
                </Popover>

                <Box sx={{ mb: 3 }}>
                    <TextField
                        fullWidth
                        label="Annual earnings"
                        value={displayEarnings}
                        onChange={handleEarningsChange}
                        placeholder="e.g., £50,000"
                        required
                        variant="outlined"
                        error={!!earningsError}
                        helperText={earningsError}
                        inputProps={{ inputMode: 'numeric' }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleInfoClick} edge="end" size="small">
                                        <InfoIcon fontSize="small" />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    
                    {/* Quick select for earnings - fewer options */}
                    <Stack direction="row" spacing={1} sx={{ mt: 1 }} useFlexGap flexWrap>
                        {quickSelectEarnings.map((amount) => (
                            <Chip
                                key={amount}
                                label={formatCurrency(amount)}
                                onClick={() => handleQuickSelectEarnings(amount)}
                                variant="outlined"
                                size="small"
                                clickable
                            />
                        ))}
                    </Stack>
                </Box>

                {isSimpleView ? (
                    <Box sx={{ mb: 3 }}>
                        <TextField
                            fullWidth
                            label="Amount to save"
                            value={displayTotalSavings}
                            onChange={handleTotalSavingsChange}
                            placeholder="e.g., £25,000"
                            required
                            variant="outlined"
                            error={!!savingsError}
                            helperText={savingsError}
                            inputProps={{ inputMode: 'numeric' }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={handleSavingsInfoClick} edge="end" size="small">
                                            <InfoIcon fontSize="small" />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        
                        {/* Quick select for savings - fewer options */}
                        <Stack direction="row" spacing={1} sx={{ mt: 1 }} useFlexGap flexWrap>
                            {quickSelectSavings.map((amount) => (
                                <Chip
                                    key={amount}
                                    label={formatCurrency(amount)}
                                    onClick={() => handleQuickSelectSavings(amount)}
                                    variant="outlined"
                                    size="small"
                                    clickable
                                />
                            ))}
                        </Stack>
                    </Box>
                ) : (
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Savings Goals
                        </Typography>
                        {savingsGoals.map((goal, index) => (
                            <Box key={index} sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1, mb: 2 }}>
                                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, alignItems: 'center' }}>
                                    <TextField
                                        label="Amount"
                                        name="amount"
                                        value={goal.displayAmount}
                                        onChange={(e) => handleGoalChange(index, e)}
                                        placeholder="e.g., £10,000"
                                        required
                                        sx={{ flexGrow: 1 }}
                                        inputProps={{ inputMode: 'numeric' }}
                                        size="small"
                                    />
                                    <FormControl sx={{ minWidth: 120 }}>
                                        <InputLabel size="small">Horizon</InputLabel>
                                        <Select
                                            name="horizon"
                                            value={goal.horizon}
                                            onChange={(e) => handleGoalChange(index, e)}
                                            label="Horizon"
                                            size="small"
                                        >
                                            {horizonOptions.map(option => (
                                                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    {savingsGoals.length > 1 && (
                                        <IconButton onClick={() => handleRemoveGoal(index)} size="small">
                                            <RemoveCircleOutlineIcon />
                                        </IconButton>
                                    )}
                                </Box>
                            </Box>
                        ))}
                        <Box sx={{ textAlign: 'center', mb: 2 }}>
                            <Button
                                type="button"
                                onClick={handleAddGoal}
                                startIcon={<AddCircleOutlineIcon />}
                                size="small"
                                variant="outlined"
                            >
                                Add Goal
                            </Button>
                        </Box>
                    </Box>
                )}

                {/* ISA Selection as separate button */}
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={handleIsaToggle}
                    >
                        {showIsaSlider ? 'Hide ISA Allowance' : 'Edit ISA Allowance'}
                    </Button>
                    
                    <Button
                        type="button"
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        startIcon={showAdvanced ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        size="small"
                        variant="text"
                    >
                        {isSimpleView ? 'Breakdown View' : 'Simple View'}
                    </Button>
                </Box>

                {/* ISA Slider */}
                <Collapse in={showIsaSlider}>
                    <Box sx={{ mb: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                            ISA Allowance Used: £{isaAllowanceUsed.toLocaleString()}
                        </Typography>
                        <Slider
                            value={isaAllowanceUsed}
                            onChange={(e, newValue) => setIsaAllowanceUsed(newValue)}
                            valueLabelDisplay="auto"
                            step={1000}
                            min={0}
                            max={20000}
                            size="small"
                        />
                    </Box>
                </Collapse>
                
                {/* Advanced Options */}
                <Collapse in={showAdvanced}>
                    <Box sx={{ mb: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={() => setIsSimpleView(!isSimpleView)}
                            fullWidth
                        >
                            Switch to {isSimpleView ? 'Breakdown View' : 'Simple View'}
                        </Button>
                    </Box>
                </Collapse>

                {submitError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {submitError}
                    </Alert>
                )}

                <Box sx={{ position: 'relative' }}>
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={loading}
                        sx={{ py: 1.5 }}
                    >
                        {loading ? 'Optimizing...' : 'Optimize Savings'}
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

            <LoadingOverlay 
                open={loading} 
                message="Optimizing your savings..."
            />
        </Container>
    );
};

export default InputPage; 