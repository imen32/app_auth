import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Authentification from './components/Authentification';
import Home from './components/Home';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Authentification />} />
                <Route path="/home" element={<Home />} />
            </Routes>
        </Router>
    );
}

export default App;
