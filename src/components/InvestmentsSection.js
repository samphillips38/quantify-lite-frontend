import { useState } from 'react';
import { 
    Box, Typography, Card, CardContent, CardActionArea, Chip, 
    Button, Dialog, DialogTitle, DialogContent, DialogActions, 
    TextField, Alert, CircularProgress, Tooltip
} from '@mui/material';
import Grid from '@mui/material/Grid';
import EmailIcon from '@mui/icons-material/Email';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import { emailResults, getBatchId } from '../services/api';

const RAISIN_REFERRAL_LINK = "https://www.raisin.com/en-gb/referral/?raf=a0495aca4e4081660f489a2c0d43c67087de8602&utm_source=transactional&utm_campaign=mandrill_customer-referral";

const InvestmentsSection = ({ investments, inputs, summary, sessionId, optimizationRecordId }) => {
    const [emailDialogOpen, setEmailDialogOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [emailSuccess, setEmailSuccess] = useState(false);
    const [referralDialogOpen, setReferralDialogOpen] = useState(false);

    if (!investments || investments.length === 0) return null;

    const handleEmailClick = () => {
        setEmailDialogOpen(true);
        setEmailError('');
        setEmailSuccess(false);
        setEmail('');
    };

    const handleEmailClose = () => {
        if (!isSending) {
            setEmailDialogOpen(false);
            setEmail('');
            setEmailError('');
            setEmailSuccess(false);
        }
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSendEmail = async () => {
        setEmailError('');
        setEmailSuccess(false);

        if (!email.trim()) {
            setEmailError('Please enter your email address');
            return;
        }

        if (!validateEmail(email)) {
            setEmailError('Please enter a valid email address');
            return;
        }

        if (!inputs || !summary) {
            setEmailError('Missing data. Please go back and try again.');
            return;
        }

        setIsSending(true);

        try {
            await emailResults({
                email: email.trim(),
                inputs,
                summary,
                investments,
                session_id: sessionId,
                optimization_record_id: optimizationRecordId,
                batch_id: getBatchId()
            });
            setEmailSuccess(true);
            setTimeout(() => {
                setEmailDialogOpen(false);
                setEmailSuccess(false);
                setEmail('');
            }, 2000);
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message || 'Unknown error';
            setEmailError(`Failed to send email: ${errorMessage}`);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <>
            <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between', 
                alignItems: { xs: 'flex-start', sm: 'center' },
                gap: { xs: 2, sm: 0 },
                mb: 3, 
                mt: 8 
            }}>
                <Typography variant="h5" component="h2" align="left" sx={{ fontWeight: 600, color: '#2D1B4E' }}>
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
                <Button
                    variant="contained"
                    startIcon={<EmailIcon />}
                    onClick={handleEmailClick}
                    sx={{
                        backgroundColor: '#9B7EDE',
                        '&:hover': {
                            backgroundColor: '#7B5EBE',
                        },
                        borderRadius: 2,
                        px: 3,
                        py: 1.5,
                        textTransform: 'none',
                        fontWeight: 600,
                        width: { xs: '100%', sm: 'auto' },
                    }}
                >
                    Email me My Results
                </Button>
            </Box>
            <Box sx={{ position: 'relative', overflow: 'visible' }}>
                <Grid container spacing={4}>
                    {investments.map((item, index) => {
                        // Detect referral eligibility: Raisin platform AND fixed_term account type
                        const hasReferral = item.platform === "Raisin" && item.account_type === "fixed_term";
                        
                        return (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index} sx={{ position: 'relative', overflow: 'visible', pt: 2, pr: 2 }}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'visible' }}>
                            {/* Referral Badge - positioned on top like iOS notification */}
                            {hasReferral && (
                                <Tooltip 
                                    title="Click for bonus details"
                                    placement="top"
                                    arrow
                                >
                                    <Box
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setReferralDialogOpen(true);
                                        }}
                                        sx={{
                                            position: 'absolute',
                                            top: -15,
                                            right: -15,
                                            zIndex: 5,
                                            backgroundColor: '#4caf50',
                                            color: 'white',
                                            borderRadius: '12px',
                                            px: 1.5,
                                            py: 0.5,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 0.5,
                                            cursor: 'pointer',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                                            '&:hover': {
                                                backgroundColor: '#45a049',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                                            },
                                            transition: 'all 0.2s ease-in-out',
                                        }}
                                    >
                                        <CardGiftcardIcon sx={{ fontSize: 16 }} />
                                        <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.7rem', whiteSpace: 'nowrap' }}>
                                            +£100 Bonus
                                        </Typography>
                                    </Box>
                                </Tooltip>
                            )}
                            <CardActionArea 
                                component="a" 
                                href={item.url || '#'} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                sx={{ 
                                    width: '100%', 
                                    height: '100%',
                                    flex: 1,
                                }}
                            >
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
                            </CardActionArea>
                            </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            </Box>

            <Dialog 
                open={emailDialogOpen} 
                onClose={handleEmailClose}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                    }
                }}
            >
                <DialogTitle sx={{ color: '#2D1B4E', fontWeight: 600 }}>
                    Email My Results
                </DialogTitle>
                <DialogContent>
                    {emailSuccess ? (
                        <Alert severity="success" sx={{ mt: 2 }}>
                            Email sent successfully! Check your inbox.
                        </Alert>
                    ) : (
                        <>
                            <Typography variant="body1" sx={{ mb: 2, color: '#6B5B8A' }}>
                                Enter your email address and we'll send you a summary of your optimization results.
                            </Typography>
                            <TextField
                                autoFocus
                                margin="dense"
                                label="Email Address"
                                type="email"
                                fullWidth
                                variant="outlined"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setEmailError('');
                                }}
                                error={!!emailError}
                                helperText={emailError}
                                disabled={isSending}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                    }
                                }}
                            />
                        </>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 2 }}>
                    <Button 
                        onClick={handleEmailClose} 
                        disabled={isSending}
                        sx={{ textTransform: 'none' }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleSendEmail} 
                        variant="contained"
                        disabled={isSending || emailSuccess}
                        startIcon={isSending ? <CircularProgress size={20} /> : <EmailIcon />}
                        sx={{
                            backgroundColor: '#9B7EDE',
                            '&:hover': {
                                backgroundColor: '#7B5EBE',
                            },
                            textTransform: 'none',
                            borderRadius: 2,
                            px: 3,
                        }}
                    >
                        {isSending ? 'Sending...' : 'Send Email'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Referral Bonus Dialog */}
            <Dialog 
                open={referralDialogOpen} 
                onClose={() => setReferralDialogOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                    }
                }}
            >
                <DialogTitle sx={{ color: '#2D1B4E', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CardGiftcardIcon sx={{ color: '#4caf50' }} />
                    Get £100 Bonus
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1" sx={{ mb: 2, color: '#6B5B8A' }}>
                        When you create a Raisin UK account using the link below, you'll receive an extra £100 bonus!
                    </Typography>
                    
                    <Typography variant="h6" sx={{ mt: 3, mb: 1.5, color: '#2D1B4E', fontWeight: 600 }}>
                        To qualify for the bonus:
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1.5, color: '#6B5B8A' }}>
                            <strong>1.</strong> Create your Raisin UK account using the referral link below.
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1.5, color: '#6B5B8A' }}>
                            <strong>2.</strong> Open a fixed rate bond with a term over 1 year (more than 12 months) with a minimum investment of £10,000.
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1.5, color: '#6B5B8A' }}>
                            <strong>3.</strong> Both you and Quantify will receive £100 when your qualifying account is opened with Raisin UK.
                        </Typography>
                    </Box>

                    <Box sx={{ mt: 3, mb: 1 }}>
                        <Button
                            component="a"
                            href={RAISIN_REFERRAL_LINK}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="contained"
                            fullWidth
                            sx={{
                                backgroundColor: '#4caf50',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: '#45a049',
                                },
                                textTransform: 'none',
                                borderRadius: 2,
                                py: 1.5,
                                fontWeight: 600,
                            }}
                        >
                            Open a Raisin UK Account
                        </Button>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 1, justifyContent: 'space-between', flexDirection: 'row' }}>
                    <Button 
                        onClick={() => {
                            navigator.clipboard.writeText(RAISIN_REFERRAL_LINK);
                        }}
                        variant="outlined"
                        sx={{ textTransform: 'none', borderRadius: 2, px: 3 }}
                    >
                        Copy Link
                    </Button>
                    <Button 
                        onClick={() => setReferralDialogOpen(false)} 
                        variant="contained"
                        sx={{
                            backgroundColor: '#9B7EDE',
                            '&:hover': {
                                backgroundColor: '#7B5EBE',
                            },
                            textTransform: 'none',
                            borderRadius: 2,
                            px: 3,
                        }}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default InvestmentsSection; 