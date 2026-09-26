import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export default function Chatbot() {
    const { markets, products, chatbotData } = useApp();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            sender: 'bot',
            html: `<strong>Hi there! 👋 I'm your FreshFind Assistant.</strong><br/>Ask me about nearby markets, opening hours, seasonal produce, or how FreshFind works.`,
            links: [],
            time: 'Just now'
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const navigate = useNavigate();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen, messages, isTyping]);

    const suggestions = [
        { label: 'Find a market', icon: 'fa-magnifying-glass' },
        { label: 'Markets open today', icon: 'fa-clock' },
        { label: 'What produce is in season?', icon: 'fa-apple-whole' },
        { label: 'Where can I find tomatoes?', icon: 'fa-location-dot' },
        { label: 'Show Saturday markets', icon: 'fa-calendar-days' },
        { label: 'How does FreshFind work?', icon: 'fa-circle-info' }
    ];

    const processQuery = (userInput) => {
        const query = userInput.toLowerCase().trim();

        // 1. Greetings
        if (/^(hi|hello|hey|salam|assalam|greetings)/i.test(query)) {
            return {
                html: "Hello! 👋 Welcome to FreshFind. I can help you locate farmers markets, check what's open right now, and discover fresh seasonal fruits and vegetables. What are you looking for today?",
                links: [
                    { text: 'Find a Market', to: '/markets' },
                    { text: 'Seasonal Guide', to: '/produce' }
                ]
            };
        }

        // 2. Open today / Open now
        if (query.includes('open today') || query.includes('open now') || query.includes("today's markets")) {
            const now = new Date();
            const todayName = now.toLocaleDateString('en-US', { weekday: 'long' });
            const openMarkets = markets.filter(m => (m.days || []).includes(todayName));

            if (openMarkets.length > 0) {
                let html = `Here are the markets operating today (<b>${todayName}</b>):<ul class="mb-2 ps-3 mt-1">`;
                openMarkets.forEach(m => {
                    html += `<li><b>${m.name}</b> (${m.area}) — ${m.hours}</li>`;
                });
                html += `</ul>`;
                const links = openMarkets.slice(0, 3).map(m => ({
                    text: `View ${m.name}`,
                    to: `/markets/${m.id}`
                }));
                return { html, links };
            } else {
                return {
                    html: `There are no scheduled farmers markets operating on ${todayName}. Most neighborhood markets open on Friday, Saturday, and Sunday!`,
                    links: [
                        { text: 'Browse Market Directory', to: '/markets' },
                        { text: 'Saturday Markets', to: '/markets?day=Saturday' }
                    ]
                };
            }
        }

        // 3. Specific days
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        for (const day of days) {
            if (query.includes(day)) {
                const capDay = day.charAt(0).toUpperCase() + day.slice(1);
                const matching = markets.filter(m => (m.days || []).includes(capDay));
                if (matching.length > 0) {
                    let html = `Found <b>${matching.length} markets</b> operating on <b>${capDay}</b>:<ul class="mb-2 ps-3 mt-1">`;
                    matching.forEach(m => {
                        html += `<li><b>${m.name}</b> (${m.area}) — <i>${m.hours}</i></li>`;
                    });
                    html += `</ul>`;
                    const links = matching.slice(0, 3).map(m => ({
                        text: `View ${m.name}`,
                        to: `/markets/${m.id}`
                    }));
                    return { html, links };
                }
            }
        }

        // 4. Produce queries
        for (const prod of products) {
            const pNameLower = prod.name.toLowerCase();
            if (
                query.includes(pNameLower) ||
                (pNameLower === 'tomatoes' && query.includes('tomato')) ||
                (pNameLower === 'apples' && query.includes('apple')) ||
                (pNameLower === 'potatoes' && query.includes('potato'))
            ) {
                const carryingMarkets = markets.filter(m => (prod.markets || []).includes(m.id));
                let html = `<b>${prod.name}</b> (${prod.category} • ${prod.season} season) is typically available at:<ul class="mb-2 ps-3 mt-1">`;
                carryingMarkets.forEach(m => {
                    html += `<li><b>${m.name}</b> — ${m.area} (${Array.isArray(m.days) ? m.days.join(', ') : m.days})</li>`;
                });
                html += `</ul>`;
                const links = [
                    { text: `View ${prod.name} Guide`, to: `/produce/${prod.id}` }
                ];
                carryingMarkets.slice(0, 2).forEach(m => {
                    links.push({ text: `View ${m.name}`, to: `/markets/${m.id}` });
                });
                return { html, links };
            }
        }

        // 5. Predefined FAQ from chatbotData
        for (const item of chatbotData || []) {
            const matchedKeyword = (item.keywords || []).some(k => query.includes(k.toLowerCase()));
            if (matchedKeyword || query.includes(item.question.toLowerCase())) {
                const links = (item.links || []).map(l => {
                    let routePath = l.url;
                    if (routePath.includes('market.html')) routePath = '/markets';
                    else if (routePath.includes('produce.html')) routePath = '/produce';
                    else if (routePath.includes('about.html')) routePath = '/about';
                    else if (routePath.includes('contact.html')) routePath = '/contact';
                    else if (routePath.includes('bookmarks.html')) routePath = '/bookmarks';
                    return { text: l.text, to: routePath };
                });
                return { html: item.answer, links };
            }
        }

        // 6. Area search
        for (const market of markets) {
            const areaLower = market.area.toLowerCase();
            if (query.includes(areaLower)) {
                const areaMarkets = markets.filter(m => m.area.toLowerCase() === areaLower);
                let html = `Found <b>${areaMarkets.length} market(s)</b> in <b>${market.area}</b>:<ul class="mb-2 ps-3 mt-1">`;
                areaMarkets.forEach(m => {
                    html += `<li><b>${m.name}</b> — ${m.address}</li>`;
                });
                html += `</ul>`;
                const links = areaMarkets.map(m => ({
                    text: `View ${m.name}`,
                    to: `/markets/${m.id}`
                }));
                return { html, links };
            }
        }

        // 7. Fallback response
        return {
            html: "I'm sorry, I couldn't find an exact answer. Try asking about <b>markets</b>, <b>opening hours</b>, <b>produce</b>, <b>seasons</b>, or <b>locations</b>. 😊",
            links: [
                { text: 'Explore All Markets', to: '/markets' },
                { text: 'View Seasonal Produce', to: '/produce' },
                { text: 'How FreshFind Works', to: '/about' }
            ]
        };
    };

    const handleSendMessage = (textToSend) => {
        const text = textToSend || inputValue.trim();
        if (!text) return;

        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        setMessages(prev => [
            ...prev,
            { sender: 'user', html: text, links: [], time: timeStr }
        ]);
        setInputValue('');
        setIsTyping(true);

        setTimeout(() => {
            setIsTyping(false);
            const response = processQuery(text);
            const respTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            setMessages(prev => [
                ...prev,
                { sender: 'bot', html: response.html, links: response.links || [], time: respTimeStr }
            ]);
        }, 450);
    };

    const handleSuggestionClick = (query) => {
        handleSendMessage(query);
    };

    return (
        <div className="freshfind-chatbot-container" id="freshfindChatbotWidget">
            {/* Floating Launcher Button */}
            <button
                className={`chatbot-launcher ${isOpen ? 'active' : ''}`}
                id="chatbotToggleBtn"
                aria-label="Open FreshFind Assistant"
                title="Chat with FreshFind Assistant"
                onClick={() => setIsOpen(prev => !prev)}
                type="button"
            >
                <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-comments'}`}></i>
                {!isOpen && <span className="chatbot-unread-dot"></span>}
            </button>

            {/* Chatbot Window */}
            {isOpen && (
                <div className="chatbot-window" id="chatbotWindow" style={{ display: 'flex' }}>
                    {/* Header */}
                    <div className="chatbot-header">
                        <div className="d-flex align-items-center gap-2">
                            <div className="chatbot-avatar">
                                <i className="fa-solid fa-seedling"></i>
                            </div>
                            <div>
                                <h4 className="mb-0">FreshFind Assistant</h4>
                                <small className="chatbot-status">
                                    <span className="status-dot"></span> Online • Local Guide
                                </small>
                            </div>
                        </div>
                        <button
                            className="chatbot-close-btn"
                            id="chatbotCloseBtn"
                            aria-label="Close Assistant"
                            onClick={() => setIsOpen(false)}
                            type="button"
                        >
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    </div>

                    {/* Messages Stream */}
                    <div className="chatbot-messages" id="chatbotMessages">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`chat-message ${msg.sender}-message`}>
                                <div className="message-bubble">
                                    <div
                                        className="message-text"
                                        dangerouslySetInnerHTML={{ __html: msg.html }}
                                    ></div>
                                    {msg.links && msg.links.length > 0 && (
                                        <div className="chatbot-action-links mt-2 d-flex flex-wrap gap-1">
                                            {msg.links.map((link, lIdx) => (
                                                <Link
                                                    key={lIdx}
                                                    to={link.to}
                                                    className="chat-deep-link"
                                                    onClick={() => setIsOpen(false)}
                                                >
                                                    <i className="fa-solid fa-arrow-up-right-from-square me-1"></i>{' '}
                                                    {link.text}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <span className="message-time">{msg.time}</span>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="chat-message bot-message typing-indicator-msg">
                                <div className="message-bubble typing-bubble">
                                    <span className="dot"></span>
                                    <span className="dot"></span>
                                    <span className="dot"></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Suggested Questions */}
                    <div className="chatbot-suggestions" id="chatbotSuggestions">
                        <span className="suggestions-label">Suggested Questions:</span>
                        <div className="suggestions-pills">
                            {suggestions.map((s, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    className="suggestion-chip"
                                    onClick={() => handleSuggestionClick(s.label)}
                                >
                                    <i className={`fa-solid ${s.icon} me-1`}></i> {s.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Input Field */}
                    <div className="chatbot-input-wrapper">
                        <form
                            id="chatbotForm"
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSendMessage();
                            }}
                        >
                            <div className="input-group">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    id="chatbotInput"
                                    className="form-control"
                                    placeholder="Ask about markets, produce, days..."
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    autoComplete="off"
                                />
                                <button
                                    type="submit"
                                    className="btn btn-fresh chatbot-send-btn"
                                    id="chatbotSendBtn"
                                    aria-label="Send message"
                                >
                                    <i className="fa-solid fa-paper-plane"></i>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
