import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ChartPage from './pages/ChartPage/ChartPage';
import './App.css';

function App() {
  return (
    <div className='App'>
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/chart" element={<ChartPage />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
