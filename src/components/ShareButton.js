import React, { useState, useEffect } from 'react';
import {
    Box,
    Fab,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Snackbar,
    Alert,
    Tooltip,
    Typography
} from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import LinkIcon from '@mui/icons-material/Link';
import FacebookIcon from '@mui/icons-material/Facebook';
import CloseIcon from '@mui/icons-material/Close';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import IconButton from '@mui/material/IconButton';
import { motion, AnimatePresence } from 'framer-motion';
import { useShare } from '../contexts/ShareContext';

const ShareButton = () => {
    const { showEncouragement, hideEncouragementBubble } = useShare();
    const [anchorEl, setAnchorEl] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const open = Boolean(anchorEl);

    const appUrl = window.location.origin;
    const shareText = "Share this with friends to stop winging it with ISAs and savings; Quantify uses your tax and savings goals, actually runs the numbers, and tells you exactly what to do!🚀";

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        // Hide encouragement bubble when user clicks share button
        if (showEncouragement) {
            hideEncouragementBubble();
        }
    };

    // Auto-hide encouragement bubble after 8 seconds
    useEffect(() => {
        if (showEncouragement) {
            const timer = setTimeout(() => {
                hideEncouragementBubble();
            }, 8000);
            return () => clearTimeout(timer);
        }
    }, [showEncouragement, hideEncouragementBubble]);

    const handleClose = () => {
        setAnchorEl(null);
    };

    const showSnackbar = (message) => {
        setSnackbarMessage(message);
        setSnackbarOpen(true);
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(appUrl);
            showSnackbar('Link copied to clipboard!');
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = appUrl;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                showSnackbar('Link copied to clipboard!');
            } catch (err) {
                showSnackbar('Failed to copy link. Please copy manually.');
            }
            document.body.removeChild(textArea);
        }
        handleClose();
    };

    const handleWhatsApp = () => {
        const url = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${appUrl}`)}`;
        window.open(url, '_blank');
        handleClose();
    };

    const handleEmail = () => {
        const subject = encodeURIComponent('Optimise your Savings');
        const body = encodeURIComponent(`${shareText}\n\n${appUrl}`);
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
        handleClose();
    };

    const handleFacebook = () => {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(appUrl)}`;
        window.open(url, '_blank', 'width=600,height=400');
        handleClose();
    };

    const handleX = () => {
        const url = `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(appUrl)}`;
        window.open(url, '_blank', 'width=600,height=400');
        handleClose();
    };

    const handleBookmark = () => {
        // Try to use the bookmark API if available (Chrome/Edge)
        if (window.sidebar && window.sidebar.addPanel) {
            // Firefox
            window.sidebar.addPanel(document.title, appUrl, '');
            showSnackbar('Bookmark added!');
        } else if (window.external && ('AddFavorite' in window.external)) {
            // Internet Explorer
            window.external.AddFavorite(appUrl, document.title);
            showSnackbar('Bookmark added!');
        } else if (window.chrome && window.chrome.bookmarks) {
            // Chrome extension API (requires extension permission)
            window.chrome.bookmarks.create({
                title: document.title,
                url: appUrl
            }, () => {
                showSnackbar('Bookmark added!');
            });
        } else {
            // Fallback: Show instructions for manual bookmarking
            const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
            const shortcut = isMac ? 'Cmd+D' : 'Ctrl+D';
            showSnackbar(`Press ${shortcut} to bookmark this page, or use your browser's menu`);
        }
        handleClose();
    };

    // X (Twitter) Icon Component
    const XIcon = ({ fontSize, sx }) => (
        <Box
            component="svg"
            viewBox="0 0 24 24"
            sx={{
                width: fontSize === 'small' ? 20 : 24,
                height: fontSize === 'small' ? 20 : 24,
                fill: 'currentColor',
                ...sx,
            }}
        >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </Box>
    );

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Quantify',
                    text: shareText,
                    url: appUrl,
                });
                handleClose();
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error('Error sharing:', err);
                }
            }
        } else {
            // Fallback to copy link if native share is not available
            handleCopyLink();
        }
    };

    return (
        <>
            <Box
                component={motion.div}
                whileTap={{ scale: 0.95 }}
                sx={{
                    position: 'fixed',
                    bottom: 24,
                    right: 24,
                    zIndex: 1000,
                }}
            >
                {/* Speech Bubble */}
                <AnimatePresence>
                    {showEncouragement && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: 10 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            style={{
                                position: 'absolute',
                                bottom: 80,
                                right: 0,
                                zIndex: 1001,
                            }}
                        >
                            <Box
                                sx={{
                                    position: 'relative',
                                    backgroundColor: 'rgba(255, 255, 255, 0.98)',
                                    borderRadius: 3,
                                    padding: 2.5,
                                    minWidth: 220,
                                    maxWidth: 280,
                                    boxShadow: '0 8px 32px rgba(155, 126, 222, 0.3)',
                                    border: '1px solid rgba(155, 126, 222, 0.2)',
                                    // Speech bubble tail pointing to FAB center
                                    '&::after': {
                                        content: '""',
                                        position: 'absolute',
                                        bottom: -8,
                                        right: 28, // Align with FAB center (FAB is 56px wide, center at 28px)
                                        width: 0,
                                        height: 0,
                                        borderLeft: '8px solid transparent',
                                        borderRight: '8px solid transparent',
                                        borderTop: '8px solid rgba(255, 255, 255, 0.98)',
                                    },
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        bottom: -9,
                                        right: 28,
                                        width: 0,
                                        height: 0,
                                        borderLeft: '9px solid transparent',
                                        borderRight: '9px solid transparent',
                                        borderTop: '9px solid rgba(155, 126, 222, 0.2)',
                                    },
                                }}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5, pr: 0.5 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#2D1B4E', flex: 1, pr: 1 }}>
                                        Found this useful? 🎉
                                    </Typography>
                                    <IconButton
                                        size="small"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            hideEncouragementBubble();
                                        }}
                                        sx={{
                                            p: 0.75,
                                            color: '#6B5B8A',
                                            minWidth: 32,
                                            minHeight: 32,
                                            '&:hover': {
                                                backgroundColor: 'rgba(155, 126, 222, 0.15)',
                                            },
                                        }}
                                    >
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                                <Typography variant="body2" sx={{ color: '#6B5B8A', fontSize: '0.85rem', pr: 0.5 }}>
                                    Share with others who might benefit!
                                </Typography>
                            </Box>
                        </motion.div>
                    )}
                </AnimatePresence>

                <Tooltip title="Share this app" placement="left" arrow>
                    <Fab
                        color="primary"
                        aria-label="share"
                        onClick={handleClick}
                        sx={{
                            boxShadow: '0 4px 20px rgba(155, 126, 222, 0.4)',
                            '&:hover': {
                                boxShadow: '0 6px 24px rgba(155, 126, 222, 0.6)',
                            },
                        }}
                    >
                        <ShareIcon />
                    </Fab>
                </Tooltip>
            </Box>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        boxShadow: '0 8px 32px rgba(155, 126, 222, 0.2)',
                        border: '1px solid rgba(155, 126, 222, 0.2)',
                        mt: -1,
                        minWidth: 200,
                    }
                }}
            >
                {navigator.share && (
                    <MenuItem onClick={handleNativeShare}>
                        <ListItemIcon>
                            <ShareIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Share via...</ListItemText>
                    </MenuItem>
                )}
                <MenuItem onClick={handleWhatsApp}>
                    <ListItemIcon>
                        <WhatsAppIcon fontSize="small" sx={{ color: '#25D366' }} />
                    </ListItemIcon>
                    <ListItemText>WhatsApp</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleEmail}>
                    <ListItemIcon>
                        <EmailIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Email</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleCopyLink}>
                    <ListItemIcon>
                        <LinkIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Copy Link</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleFacebook}>
                    <ListItemIcon>
                        <FacebookIcon fontSize="small" sx={{ color: '#1877F2' }} />
                    </ListItemIcon>
                    <ListItemText>Facebook</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleX}>
                    <ListItemIcon>
                        <XIcon fontSize="small" sx={{ color: '#000000' }} />
                    </ListItemIcon>
                    <ListItemText>X (Twitter)</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleBookmark}>
                    <ListItemIcon>
                        <BookmarkAddIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Add to Bookmarks</ListItemText>
                </MenuItem>
            </Menu>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert 
                    onClose={() => setSnackbarOpen(false)} 
                    severity="success" 
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default ShareButton;

