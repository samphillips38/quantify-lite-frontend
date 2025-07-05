import React from 'react';
import { 
    Backdrop, 
    CircularProgress, 
    Typography, 
    Box,
    LinearProgress 
} from '@mui/material';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const LoadingOverlay = ({ open, message = 'Optimizing your savings...', progress = null }) => {
    const loadingMessages = [
        'Analyzing interest rates...',
        'Calculating tax implications...',
        'Finding optimal allocations...',
        'Comparing investment options...',
        'Finalizing recommendations...'
    ];

    const [currentMessageIndex, setCurrentMessageIndex] = React.useState(0);

    React.useEffect(() => {
        if (!open) return;

        const interval = setInterval(() => {
            setCurrentMessageIndex((prevIndex) => 
                (prevIndex + 1) % loadingMessages.length
            );
        }, 2000);

        return () => clearInterval(interval);
    }, [open, loadingMessages.length]);

    return (
        <Backdrop
            sx={{
                color: '#fff',
                zIndex: (theme) => theme.zIndex.drawer + 1,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(4px)',
            }}
            open={open}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    p: 4,
                }}
            >
                <DotLottieReact
                    src="/animations/ThinkingCharts.lottie"
                    loop
                    autoplay
                    style={{ 
                        height: '120px', 
                        width: '120px', 
                        marginBottom: '24px',
                        filter: 'brightness(1.2)' 
                    }}
                />
                
                <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {message}
                </Typography>
                
                <Typography 
                    variant="body1" 
                    color="text.secondary" 
                    sx={{ 
                        mb: 3,
                        minHeight: '1.5em',
                        transition: 'opacity 0.3s ease-in-out',
                    }}
                >
                    {loadingMessages[currentMessageIndex]}
                </Typography>

                {progress !== null ? (
                    <Box sx={{ width: '100%', maxWidth: 400, mb: 2 }}>
                        <LinearProgress 
                            variant="determinate" 
                            value={progress} 
                            sx={{
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                '& .MuiLinearProgress-bar': {
                                    borderRadius: 4,
                                    background: 'linear-gradient(90deg, #f0c3f0, #a36fbb)',
                                },
                            }}
                        />
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            {Math.round(progress)}% complete
                        </Typography>
                    </Box>
                ) : (
                    <CircularProgress 
                        size={40} 
                        sx={{ 
                            color: '#f0c3f0',
                            '& .MuiCircularProgress-circle': {
                                strokeLinecap: 'round',
                            },
                        }} 
                    />
                )}

                <Typography 
                    variant="body2" 
                    sx={{ 
                        mt: 2, 
                        opacity: 0.7,
                        fontStyle: 'italic' 
                    }}
                >
                    This usually takes just a few seconds...
                </Typography>
            </Box>
        </Backdrop>
    );
};

export default LoadingOverlay;