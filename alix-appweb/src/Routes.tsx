import React from 'react';
import { Route, BrowserRouter } from 'react-router-dom';
import LandingPage from './pages/landingPage';
import MentionsLegales from './pages/mentionLegale';

const Routes: React.FC = () => {
    return (
        <BrowserRouter>
            <Route path="/" element={<LandingPage />} />
            <Route path='/mention-legale' element={<MentionsLegales />} />
        </BrowserRouter>
    );
};

export default Routes;