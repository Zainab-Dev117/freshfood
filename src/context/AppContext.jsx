import React, { createContext, useContext, useState, useEffect } from 'react';
import marketsData from '../data/markets.json';
import productsData from '../data/products.json';
import seasonalData from '../data/seasonal.json';
import chatbotData from '../data/chatbot.json';

const AppContext = createContext();

const BOOKMARKS_KEY = 'freshfind_bookmarks';
const NOTES_KEY = 'freshfind_session_notes';

export function AppProvider({ children }) {
    // 1. Bookmarks State (localStorage)
    const [bookmarks, setBookmarks] = useState(() => {
        try {
            const raw = localStorage.getItem(BOOKMARKS_KEY);
            return raw ? JSON.parse(raw) : { markets: [], produce: [] };
        } catch {
            return { markets: [], produce: [] };
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
        } catch (e) {
            console.error('Error saving bookmarks to localStorage', e);
        }
    }, [bookmarks]);

    const isBookmarked = (type, id) => {
        const numId = parseInt(id, 10);
        if (type === 'market') return bookmarks.markets.includes(numId);
        if (type === 'produce') return bookmarks.produce.includes(numId);
        return false;
    };

    const toggleBookmark = (type, id) => {
        const numId = parseInt(id, 10);
        let wasAdded = false;

        setBookmarks(prev => {
            const copy = {
                markets: [...prev.markets],
                produce: [...prev.produce]
            };

            if (type === 'market') {
                const idx = copy.markets.indexOf(numId);
                if (idx > -1) {
                    copy.markets.splice(idx, 1);
                    wasAdded = false;
                } else {
                    copy.markets.push(numId);
                    wasAdded = true;
                }
            } else if (type === 'produce') {
                const idx = copy.produce.indexOf(numId);
                if (idx > -1) {
                    copy.produce.splice(idx, 1);
                    wasAdded = false;
                } else {
                    copy.produce.push(numId);
                    wasAdded = true;
                }
            }

            return copy;
        });

        return wasAdded;
    };

    // 2. Session Notes State (sessionStorage - Requirement 32)
    const [notes, setNotes] = useState(() => {
        try {
            const raw = sessionStorage.getItem(NOTES_KEY);
            return raw ? JSON.parse(raw) : {};
        } catch {
            return {};
        }
    });

    useEffect(() => {
        try {
            sessionStorage.setItem(NOTES_KEY, JSON.stringify(notes));
        } catch (e) {
            console.error('Error saving session notes', e);
        }
    }, [notes]);

    const saveNote = (key, text) => {
        setNotes(prev => {
            const updated = { ...prev };
            if (!text || text.trim() === '') {
                delete updated[key];
            } else {
                updated[key] = text.trim();
            }
            return updated;
        });
    };

    const deleteNote = (key) => {
        saveNote(key, '');
    };

    const getNote = (key) => notes[key] || '';

    // 3. Global Toast Notifications
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast(prev => ({ ...prev, show: false }));
        }, 3500);
    };

    // 4. Modals State
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [signupModalOpen, setSignupModalOpen] = useState(false);
    const [shareModal, setShareModal] = useState({ isOpen: false, title: '', text: '', url: '' });
    const [noteModal, setNoteModal] = useState({ isOpen: false, key: '', title: '' });

    const openShareModal = (title, text, url) => {
        const fullUrl = url || window.location.href;
        if (navigator.share) {
            navigator.share({ title, text, url: fullUrl }).catch(err => {
                if (err.name !== 'AbortError') {
                    setShareModal({ isOpen: true, title, text, url: fullUrl });
                }
            });
        } else {
            setShareModal({ isOpen: true, title, text, url: fullUrl });
        }
    };

    const openNoteModal = (key, title) => {
        setNoteModal({ isOpen: true, key, title });
    };

    // 5. User Geolocation (Requirement 13)
    const [userCoords, setUserCoords] = useState(null);
    const [geoStatus, setGeoStatus] = useState('idle'); // 'idle' | 'detecting' | 'granted' | 'denied'

    const requestUserLocation = (onSuccessCallback) => {
        if (!('geolocation' in navigator)) {
            showToast('Geolocation is not supported by your browser.', 'warning');
            return;
        }

        setGeoStatus('detecting');
        navigator.geolocation.getCurrentPosition(
            position => {
                const coords = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                setUserCoords(coords);
                setGeoStatus('granted');
                showToast('Location detected! Distances calculated.', 'success');
                if (onSuccessCallback) onSuccessCallback(coords);
            },
            () => {
                setGeoStatus('denied');
                showToast('Location access is required for distance-based features. You can still search and filter all markets.', 'info');
            },
            { timeout: 8000 }
        );
    };

    // Total bookmark counter
    const totalBookmarksCount = bookmarks.markets.length + bookmarks.produce.length;

    return (
        <AppContext.Provider
            value={{
                markets: marketsData,
                products: productsData,
                seasonalData,
                chatbotData,
                bookmarks,
                totalBookmarksCount,
                isBookmarked,
                toggleBookmark,
                notes,
                saveNote,
                deleteNote,
                getNote,
                toast,
                showToast,
                loginModalOpen,
                setLoginModalOpen,
                signupModalOpen,
                setSignupModalOpen,
                shareModal,
                setShareModal,
                openShareModal,
                noteModal,
                setNoteModal,
                openNoteModal,
                userCoords,
                geoStatus,
                requestUserLocation
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}
