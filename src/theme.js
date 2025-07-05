import { createTheme, responsiveFontSizes } from '@mui/material/styles';

let theme = createTheme({
  palette: {
    mode: 'dark', // Use dark mode for light text
    primary: {
      main: '#f0c3f0', // A light, soft purple/pink
    },
    secondary: {
      main: '#a36fbb', // A muted purple for accents
    },
    background: {
      paper: 'rgba(255, 255, 255, 0.1)', // This is the glass background
    },
    text: {
      primary: '#ffffff',
      secondary: '#e0e0e0',
    },
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
    h1: { fontWeight: 700 },
    h2: { fontWeight: 600 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 500 },
    h6: { fontWeight: 500 },
  },
  components: {
    MuiPaper: {
        styleOverrides: {
            root: {
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
            }
        }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 'bold',
          padding: '8px 16px',
          '@media (max-width: 600px)': {
            padding: '10px 16px',
            fontSize: '0.9rem',
          },
        },
      },
    },
    MuiTextField: {
        styleOverrides: {
            root: {
                '& .MuiOutlinedInput-root': {
                    borderRadius: 8,
                    backgroundColor: 'rgba(255, 255, 255, 0.05)'
                },
                '@media (max-width: 600px)': {
                    '& .MuiInputLabel-root': {
                        fontSize: '0.9rem',
                    },
                },
            }
        }
    },
    MuiChip: {
        styleOverrides: {
            root: {
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(5px)',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.25)',
                    transform: 'translateY(-1px)',
                },
                '@media (max-width: 600px)': {
                    fontSize: '0.75rem',
                    height: '28px',
                },
            }
        }
    },
    MuiContainer: {
        styleOverrides: {
            root: {
                '@media (max-width: 600px)': {
                    paddingLeft: '16px',
                    paddingRight: '16px',
                },
            }
        }
    },
    MuiTypography: {
        styleOverrides: {
            h3: {
                '@media (max-width: 600px)': {
                    fontSize: '1.8rem',
                },
            },
            h4: {
                '@media (max-width: 600px)': {
                    fontSize: '1.5rem',
                },
            },
            h5: {
                '@media (max-width: 600px)': {
                    fontSize: '1.2rem',
                },
            },
        }
    }
  },
});

theme = responsiveFontSizes(theme);

export default theme; 