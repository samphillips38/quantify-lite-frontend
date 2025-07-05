import { createTheme, responsiveFontSizes } from '@mui/material/styles';

const purpleDark = responsiveFontSizes(createTheme({
  palette: {
    mode: 'dark', // Use dark mode for light text
    primary: {
      main: '#f0c3f0', // A light, soft purple/pink
    },
    secondary: {
      main: '#a36fbb', // A muted purple for accents
    },
    background: {
      default: '#25103a', // slightly lighter than before
      paper: 'rgba(50, 20, 80, 0.85)', // slightly lighter, still glassy
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
}));

const purpleLight = responsiveFontSizes(createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#a36fbb' }, // Muted purple
    secondary: { main: '#f0c3f0' }, // Light purple/pink accent
    background: {
      default: '#f7f3fa', // Soft light purple background
      paper: '#fff8fc', // Slightly purple-tinted white for paper
    },
    text: { primary: '#2c0a4d', secondary: '#6d4a7b' },
  },
  typography: {
    fontFamily: [
      '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif',
    ].join(','),
    h1: { fontWeight: 700 }, h2: { fontWeight: 600 }, h3: { fontWeight: 600 }, h4: { fontWeight: 600 }, h5: { fontWeight: 500 }, h6: { fontWeight: 500 },
  },
  components: {
    MuiPaper: { styleOverrides: { root: { boxShadow: '0 1px 4px rgba(163, 111, 187, 0.08)', border: '1px solid #e0d7ef', background: '#fff8fc' } } },
    MuiButton: { styleOverrides: { root: { borderRadius: 8, textTransform: 'none', fontWeight: 'bold' }, containedPrimary: { background: '#a36fbb', color: '#fff', '&:hover': { background: '#8a4d80' } } } },
    MuiTextField: { styleOverrides: { root: { '& .MuiOutlinedInput-root': { borderRadius: 8, backgroundColor: '#f7f3fa' } } } },
    MuiChip: { styleOverrides: { root: { backgroundColor: '#f0c3f0', color: '#6d4a7b' } } },
  },
}));

const minimalist = responsiveFontSizes(createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#222222' },
    secondary: { main: '#888888' },
    background: {
      default: '#f7f7f7',
      paper: '#ffffff',
    },
    text: { primary: '#222222', secondary: '#555555' },
  },
  typography: {
    fontFamily: 'Inter, Arial, sans-serif',
    h1: { fontWeight: 600 }, h2: { fontWeight: 500 }, h3: { fontWeight: 500 }, h4: { fontWeight: 500 }, h5: { fontWeight: 400 }, h6: { fontWeight: 400 },
  },
  components: {
    MuiPaper: { styleOverrides: { root: { boxShadow: '0 1px 4px rgba(0,0,0,0.03)', border: '1px solid #e0e0e0', background: '#fff' } } },
    MuiButton: { styleOverrides: { root: { borderRadius: 6, textTransform: 'none', fontWeight: 500 }, containedPrimary: { background: '#222', color: '#fff', '&:hover': { background: '#444' } } } },
    MuiTextField: { styleOverrides: { root: { '& .MuiOutlinedInput-root': { borderRadius: 6, backgroundColor: '#fafafa' } } } },
    MuiChip: { styleOverrides: { root: { backgroundColor: '#f0f0f0', color: '#222' } } },
  },
}));

const vibrantBlue = responsiveFontSizes(createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
    secondary: { main: '#00bcd4' },
    background: {
      default: '#bbdefb',
      paper: '#e3f2fd',
    },
    text: { primary: '#0d47a1', secondary: '#1976d2' },
  },
  typography: {
    fontFamily: 'Montserrat, Arial, sans-serif',
    h1: { fontWeight: 800 }, h2: { fontWeight: 700 }, h3: { fontWeight: 700 }, h4: { fontWeight: 600 }, h5: { fontWeight: 500 }, h6: { fontWeight: 500 },
  },
  components: {
    MuiPaper: { styleOverrides: { root: { boxShadow: '0 2px 8px rgba(25, 118, 210, 0.08)', border: '1px solid #90caf9', background: '#e3f2fd' } } },
    MuiButton: { styleOverrides: { root: { borderRadius: 10, textTransform: 'none', fontWeight: 700 }, containedPrimary: { background: '#1976d2', color: '#fff', '&:hover': { background: '#1565c0' } } } },
    MuiTextField: { styleOverrides: { root: { '& .MuiOutlinedInput-root': { borderRadius: 10, backgroundColor: '#bbdefb' } } } },
    MuiChip: { styleOverrides: { root: { backgroundColor: '#90caf9', color: '#0d47a1' } } },
  },
}));

export const themes = {
  'Purple Dark': purpleDark,
  'Purple Light': purpleLight,
  'Minimalist': minimalist,
  'Vibrant Blue': vibrantBlue,
}; 