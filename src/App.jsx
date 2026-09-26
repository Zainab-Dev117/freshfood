import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Topbar from './components/common/Topbar';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Toast from './components/common/Toast';
import LoginModal from './components/common/LoginModal';
import SignupModal from './components/common/SignupModal';
import ShareModal from './components/common/ShareModal';
import NoteModal from './components/common/NoteModal';
import Chatbot from './components/chatbot/Chatbot';

import Home from './pages/Home';
import MarketDirectory from './pages/MarketDirectory';
import MarketDetail from './pages/MarketDetail';
import ProduceGuide from './pages/ProduceGuide';
import ProduceDetail from './pages/ProduceDetail';
import Bookmarks from './pages/Bookmarks';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Scroll to top or anchor on navigation
function ScrollHandler() {
    const { pathname, hash } = useLocation();

    useEffect(() => {
        if (hash) {
            setTimeout(() => {
                const element = document.getElementById(hash.replace('#', ''));
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        } else {
            window.scrollTo(0, 0);
        }
    }, [pathname, hash]);

    return null;
}

export default function App() {
    return (
        <div className="freshfind-app-wrapper min-vh-100 d-flex flex-column">
            <ScrollHandler />

            {/* Top Announcement & Clock */}
            <Topbar />

            {/* Global Navbar */}
            <Navbar />

            {/* Main Application Routes */}
            <div className="flex-grow-1">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/markets" element={<MarketDirectory />} />
                    <Route path="/markets/:id" element={<MarketDetail />} />
                    <Route path="/produce" element={<ProduceGuide />} />
                    <Route path="/produce/:id" element={<ProduceDetail />} />
                    <Route path="/bookmarks" element={<Bookmarks />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="*" element={<Home />} />
                </Routes>
            </div>

            {/* Global Site Footer */}
            <Footer />

            {/* Global Chatbot Assistant */}
            <Chatbot />

            {/* Modals */}
            <LoginModal />
            <SignupModal />
            <ShareModal />
            <NoteModal />

            {/* Toast Notifications */}
            <Toast />
        </div>
    );
}
