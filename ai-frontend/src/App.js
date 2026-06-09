import React, { useState } from 'react';
import PredictPage from './pages/PredictPage';
import DashboardPage from './pages/DashboardPage';
import ModelPage from './pages/ModelPage';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('predict');

  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-brand">Project Budget AI</div>
        <div className="nav-links">
          <button
            className={currentPage === 'predict' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setCurrentPage('predict')}
          >
            Predict Budget
          </button>
          <button
            className={currentPage === 'dashboard' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setCurrentPage('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={currentPage === 'model' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setCurrentPage('model')}
          >
            Model Info
          </button>
        </div>
      </nav>

      <main className="main-content">
        {currentPage === 'predict'   && <PredictPage />}
        {currentPage === 'dashboard' && <DashboardPage />}
        {currentPage === 'model'     && <ModelPage />}
      </main>
    </div>
  );
}

export default App;
