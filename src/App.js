import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import InputPage from './pages/InputPage';
import LoadingPage from './pages/LoadingPage';
import ResultsPage from './pages/ResultsPage';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from '@mui/material/GlobalStyles';
import defaultTheme from './theme';
import { AnimatePresence, motion } from 'framer-motion';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1
  },
  out: {
    opacity: 0,
    y: -20,
    scale: 0.98
  }
};

const pageTransition = {
  type: "tween",
  ease: [0.4, 0, 0.2, 1], // Custom cubic-bezier for smooth easing
  duration: 0.5
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
        <Route path="/loading" element={
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <LoadingPage />
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
      </Routes>
    </AnimatePresence>
  )
}

const backgroundGradient = (
  <GlobalStyles
    styles={{
      body: {
        background: 'linear-gradient(135deg, #F5F3FA 0%, #E8E3F5 50%, #F5F3FA 100%)',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
      },
      '*': {
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'rgba(155, 126, 222, 0.1)',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'rgba(155, 126, 222, 0.3)',
          borderRadius: '4px',
          '&:hover': {
            background: 'rgba(155, 126, 222, 0.5)',
          },
        },
      },
    }}
  />
);

function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      {backgroundGradient}
      <Router>
        <div className="App">
          <AnimatedRoutes />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
