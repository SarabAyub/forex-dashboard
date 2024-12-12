import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ChartPage from './pages/ChartPage/ChartPage';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider, CssBaseline, Switch, FormControlLabel, Box } from '@mui/material';
import { lightTheme, darkTheme } from './theme/theme';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleThemeChange = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <ToastContainer />
      <Box sx={{ p: 2 }}>
        <FormControlLabel
          control={<Switch checked={isDarkMode} onChange={handleThemeChange} />}
          label="Dark Mode"
        />
        <Router>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/chart" element={<ChartPage />} />
          </Routes>
        </Router>
      </Box>
    </ThemeProvider>

  );
}

export default App;
