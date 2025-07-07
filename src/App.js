import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import InputPage from './pages/InputPage';
import ResultsPage from './pages/ResultsPage';
import AboutPage from './pages/AboutPage';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from '@mui/material/GlobalStyles';
import { themes } from './theme';
import { AnimatePresence, motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import ThemeSpeedDial from './components/ThemeSpeedDial';

const pageVariants = {
  initial: {
    opacity: 0,
    x: "-100vw",
    scale: 0.8
  },
  in: {
    opacity: 1,
    x: 0,
    scale: 1
  },
  out: {
    opacity: 0,
    x: "100vw",
    scale: 1.2
  }
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.8
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <InputPage />
          </motion.div>
        } />
        <Route path="/results" element={
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <ResultsPage />
          </motion.div>
        } />
        <Route path="/about" element={
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <AboutPage />
          </motion.div>
        } />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  const [themeName, setThemeName] = useState('Purple Dark');
  const theme = themes[themeName] || themes['Purple Dark'];

  // Compute background gradient based on theme
  const backgroundGradient = useMemo(() => {
    const bgDefault = theme.palette.background?.default || '#2c0a4d';
    const bgPaper = theme.palette.background?.paper || '#8a4d80';
    return (
      <GlobalStyles
        styles={{
          body: {
            background: `linear-gradient(to bottom, ${bgDefault}, ${bgPaper})`,
            backgroundAttachment: 'fixed',
            transition: 'background 0.5s',
          },
        }}
      />
    );
  }, [theme]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {backgroundGradient}
      <Router>
        <div className="App">
          <AnimatedRoutes />
          <ThemeSpeedDial currentTheme={themeName} setTheme={setThemeName} />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
