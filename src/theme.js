import { createTheme, responsiveFontSizes } from '@mui/material/styles';

let theme = responsiveFontSizes(createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#9B7EDE', // Soft purple matching screenshots
      light: '#B8A5E8',
      dark: '#7A5FB8',
    },
    secondary: {
      main: '#C4B5E8', // Lighter purple for accents
      light: '#E0D5F0',
      dark: '#A896D0',
    },
    background: {
      default: '#F5F3FA', // Very light lavender background
      paper: '#FFFFFF', // Pure white cards
    },
    text: {
      primary: '#2D1B4E', // Dark purple for text
      secondary: '#6B5B8A', // Muted purple for secondary text
    },
    divider: 'rgba(155, 126, 222, 0.2)',
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: { fontWeight: 700, color: '#2D1B4E' },
    h2: { fontWeight: 600, color: '#2D1B4E' },
    h3: { fontWeight: 600, color: '#2D1B4E' },
    h4: { fontWeight: 600, color: '#2D1B4E' },
    h5: { fontWeight: 500, color: '#2D1B4E' },
    h6: { fontWeight: 500, color: '#2D1B4E' },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiPaper: {
        styleOverrides: {
            root: {
                borderRadius: 16,
                boxShadow: '0 4px 20px rgba(155, 126, 222, 0.1)',
                border: '1px solid rgba(155, 126, 222, 0.1)',
            }
        }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          padding: '12px 24px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 24px rgba(155, 126, 222, 0.3)',
          },
          '&:active': {
            transform: 'translateY(0px)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #9B7EDE 0%, #7A5FB8 100%)',
          color: '#FFFFFF',
          boxShadow: '0 4px 16px rgba(155, 126, 222, 0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #A896D0 0%, #8B6FC8 100%)',
            boxShadow: '0 8px 24px rgba(155, 126, 222, 0.4)',
          },
        },
        outlined: {
          borderColor: '#9B7EDE',
          color: '#9B7EDE',
          '&:hover': {
            borderColor: '#7A5FB8',
            backgroundColor: 'rgba(155, 126, 222, 0.08)',
          },
        },
        text: {
          color: '#9B7EDE',
          '&:hover': {
            backgroundColor: 'rgba(155, 126, 222, 0.08)',
          },
        },
      },
    },
    MuiTextField: {
        styleOverrides: {
            root: {
                '& .MuiOutlinedInput-root': {
                    borderRadius: 12,
                    backgroundColor: '#FFFFFF',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                        boxShadow: '0 2px 8px rgba(155, 126, 222, 0.15)',
                    },
                    '&.Mui-focused': {
                        boxShadow: '0 4px 16px rgba(155, 126, 222, 0.2)',
                    },
                    '& fieldset': {
                        borderColor: 'rgba(155, 126, 222, 0.3)',
                    },
                    '&:hover fieldset': {
                        borderColor: '#9B7EDE',
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: '#9B7EDE',
                        borderWidth: '2px',
                    },
                },
                '& .MuiInputLabel-root': {
                    color: '#6B5B8A',
                    '&.Mui-focused': {
                        color: '#9B7EDE',
                    },
                },
            }
        }
    },
    MuiChip: {
        styleOverrides: {
            root: {
                backgroundColor: 'rgba(155, 126, 222, 0.1)',
                color: '#7A5FB8',
                border: '1px solid rgba(155, 126, 222, 0.2)',
                fontWeight: 500,
            }
        }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 32px rgba(155, 126, 222, 0.15)',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            backgroundColor: 'rgba(155, 126, 222, 0.1)',
            transform: 'scale(1.1)',
          },
        },
      },
    },
  },
}));

export default theme; 