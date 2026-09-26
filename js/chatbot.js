/**
 * FreshFind Global Chatbot Assistant
 * Implements rule-based keyword matching, suggested queries, and clickable deep-links (Requirements 35-39)
 */

(function () {
    let chatbotData = [];
    let marketsData = [];
    let productsData = [];

    // Path resolution
    const isSubdir = window.location.pathname.includes("/products/");
    const dataPrefix = isSubdir ? "../data/" : "data/";
    const pagePrefix = isSubdir ? "../" : "";

    document.addEventListener("DOMContentLoaded", function () {
        initChatbotUI();
        loadChatbotData();
    });

    /**
     * Injects Chatbot Widget into DOM
     */
    function initChatbotUI() {
        if (document.getElementById("freshfindChatbotWidget")) return;

        const widget = document.createElement("div");
        widget.id = "freshfindChatbotWidget";
        widget.className = "freshfind-chatbot-container";
        widget.innerHTML = `
            <!-- Chatbot Floating Button (Requirement 35) -->
            <button class="chatbot-launcher" id="chatbotToggleBtn" aria-label="Open FreshFind Assistant" title="Chat with FreshFind Assistant">
                <i class="fa-solid fa-comments"></i>
                <span class="chatbot-unread-dot"></span>
            </button>

            <!-- Chatbot Window -->
            <div class="chatbot-window" id="chatbotWindow" style="display: none;">
                <!-- Header -->
                <div class="chatbot-header">
                    <div class="d-flex align-items-center gap-2">
                        <div class="chatbot-avatar">
                            <i class="fa-solid fa-seedling"></i>
                        </div>
                        <div>
                            <h4 class="mb-0">FreshFind Assistant</h4>
                            <small class="chatbot-status"><span class="status-dot"></span> Online • Local Guide</small>
                        </div>
                    </div>
                    <button class="chatbot-close-btn" id="chatbotCloseBtn" aria-label="Close Assistant">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <!-- Messages Stream -->
                <div class="chatbot-messages" id="chatbotMessages">
                    <div class="chat-message bot-message">
                        <div class="message-bubble">
                            <p class="mb-1"><strong>Hi there! 👋 I'm your FreshFind Assistant.</strong></p>
                            <p class="mb-0">Ask me about nearby markets, opening hours, seasonal produce, or how FreshFind works.</p>
                        </div>
                        <span class="message-time">Just now</span>
                    </div>
                </div>

                <!-- Suggested Questions (Requirement 36) -->
                <div class="chatbot-suggestions" id="chatbotSuggestions">
                    <span class="suggestions-label">Suggested Questions:</span>
                    <div class="suggestions-pills">
                        <button type="button" class="suggestion-chip" data-query="Find a market">
                            <i class="fa-solid fa-magnifying-glass me-1"></i> Find a market
                        </button>
                        <button type="button" class="suggestion-chip" data-query="Markets open today">
                            <i class="fa-solid fa-clock me-1"></i> Markets open today
                        </button>
                        <button type="button" class="suggestion-chip" data-query="What produce is in season?">
                            <i class="fa-solid fa-apple-whole me-1"></i> What produce is in season?
                        </button>
                        <button type="button" class="suggestion-chip" data-query="Where can I find tomatoes?">
                            <i class="fa-solid fa-location-dot me-1"></i> Where can I find tomatoes?
                        </button>
                        <button type="button" class="suggestion-chip" data-query="Show Saturday markets">
                            <i class="fa-regular fa-calendar-days me-1"></i> Show Saturday markets
                        </button>
                        <button type="button" class="suggestion-chip" data-query="How does FreshFind work?">
                            <i class="fa-solid fa-circle-info me-1"></i> How does FreshFind work?
                        </button>
                    </div>
                </div>

                <!-- Input Field -->
                <div class="chatbot-input-wrapper">
                    <form id="chatbotForm" onsubmit="event.preventDefault(); window.FreshFindSendChat();">
                        <div class="input-group">
                            <input type="text" id="chatbotInput" class="form-control" placeholder="Ask about markets, produce, days..." autocomplete="off">
                            <button type="submit" class="btn btn-fresh chatbot-send-btn" id="chatbotSendBtn">
                                <i class="fa-solid fa-paper-plane"></i>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        document.body.appendChild(widget);

        // Bind events
        const toggleBtn = document.getElementById("chatbotToggleBtn");
        const closeBtn = document.getElementById("chatbotCloseBtn");
        const windowEl = document.getElementById("chatbotWindow");

        toggleBtn.addEventListener("click", function () {
            if (windowEl.style.display === "none" || !windowEl.style.display) {
                windowEl.style.display = "flex";
                toggleBtn.classList.add("active");
                document.getElementById("chatbotInput").focus();
            } else {
                windowEl.style.display = "none";
                toggleBtn.classList.remove("active");
            }
        });

        closeBtn.addEventListener("click", function () {
            windowEl.style.display = "none";
            toggleBtn.classList.remove("active");
        });

        // Click on suggestion chips
        document.getElementById("chatbotSuggestions").addEventListener("click", function (e) {
            const chip = e.target.closest(".suggestion-chip");
            if (chip) {
                const query = chip.getAttribute("data-query");
                sendUserMessage(query);
            }
        });
    }

    /**
     * Loads JSON datasets for rule-based responses
     */
    function loadChatbotData() {
        Promise.all([
            fetch(dataPrefix + "chatbot.json").then(r => r.json()).catch(() => []),
            fetch(dataPrefix + "markets.json").then(r => r.json()).catch(() => []),
            fetch(dataPrefix + "products.json").then(r => r.json()).catch(() => [])
        ]).then(([bot, markets, products]) => {
            chatbotData = bot || [];
            marketsData = markets || [];
            productsData = products || [];
        }).catch(err => {
            console.error("Chatbot data loading error:", err);
        });
    }

    /**
     * User sends a message
     */
    function sendUserMessage(text) {
        const input = document.getElementById("chatbotInput");
        const query = text || (input ? input.value.trim() : "");
        if (!query) return;

        if (input) input.value = "";

        // Append user message
        appendMessage(query, "user");

        // Show typing indicator
        const typingId = showTypingIndicator();

        // Process response
        setTimeout(() => {
            removeTypingIndicator(typingId);
            const response = processQuery(query);
            appendMessage(response.html, "bot", response.links);
        }, 400);
    }

    window.FreshFindSendChat = function () {
        sendUserMessage();
    };

    /**
     * Rule-based text normalization & keyword processor (Requirement 37)
     */
    function processQuery(userInput) {
        const query = userInput.toLowerCase().trim();

        // Check for Greetings
        if (/^(hi|hello|hey|salam|assalam|greetings)/i.test(query)) {
            return {
                html: "Hello! 👋 Welcome to FreshFind. I can help you locate farmers markets, check what's open right now, and discover fresh seasonal fruits and vegetables. What are you looking for today?",
                links: [
                    { text: "Find a Market", url: `${pagePrefix}market.html` },
                    { text: "Seasonal Guide", url: `${pagePrefix}produce.html` }
                ]
            };
        }

        // Check for "open today" or "open now"
        if (query.includes("open today") || query.includes("open now") || query.includes("today's markets")) {
            const now = new Date();
            const todayName = now.toLocaleDateString("en-US", { weekday: "long" });
            const openMarkets = marketsData.filter(m => (m.days || []).includes(todayName));

            if (openMarkets.length > 0) {
                let text = `Here are the markets operating today (<b>${todayName}</b>):<br><ul class="mb-2 ps-3">`;
                openMarkets.forEach(m => {
                    text += `<li><b>${m.name}</b> (${m.area}) — ${m.hours}</li>`;
                });
                text += `</ul>`;
                const links = openMarkets.slice(0, 3).map(m => ({
                    text: `View ${m.name}`,
                    url: `${pagePrefix}markets-details.html?id=${m.id}`
                }));
                return { html: text, links: links };
            } else {
                return {
                    html: `There are no scheduled farmers markets operating on ${todayName}. Most neighborhood markets open on Friday, Saturday, and Sunday!`,
                    links: [
                        { text: "Browse Market Directory", url: `${pagePrefix}market.html` },
                        { text: "Saturday Markets", url: `${pagePrefix}market.html?day=Saturday` }
                    ]
                };
            }
        }

        // Check for specific days (e.g. Saturday, Sunday, Wednesday, Friday)
        const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
        for (const day of days) {
            if (query.includes(day)) {
                const capDay = day.charAt(0).toUpperCase() + day.slice(1);
                const matching = marketsData.filter(m => (m.days || []).includes(capDay));
                if (matching.length > 0) {
                    let text = `Found <b>${matching.length} markets</b> operating on <b>${capDay}</b>:<br><ul class="mb-2 ps-3">`;
                    matching.forEach(m => {
                        text += `<li><b>${m.name}</b> (${m.area}) — <i>${m.hours}</i></li>`;
                    });
                    text += `</ul>`;
                    const links = matching.slice(0, 3).map(m => ({
                        text: `View ${m.name}`,
                        url: `${pagePrefix}markets-details.html?id=${m.id}`
                    }));
                    return { html: text, links: links };
                }
            }
        }

        // Check for specific produce queries (Requirement 39 - e.g. "Where can I find tomatoes?")
        for (const prod of productsData) {
            const pNameLower = prod.name.toLowerCase();
            if (query.includes(pNameLower) || (pNameLower === "tomatoes" && query.includes("tomato")) || (pNameLower === "apples" && query.includes("apple")) || (pNameLower === "potatoes" && query.includes("potato"))) {
                const carryingMarkets = marketsData.filter(m => (prod.markets || []).includes(m.id));
                let text = `<b>${prod.name}</b> (${prod.category} • ${prod.season} season) is typically available at:<br><ul class="mb-2 ps-3">`;
                carryingMarkets.forEach(m => {
                    text += `<li><b>${m.name}</b> — ${m.area} (${Array.isArray(m.days) ? m.days.join(", ") : m.days})</li>`;
                });
                text += `</ul>`;
                const links = [
                    { text: `View ${prod.name} Guide`, url: `${pagePrefix}produce-detail.html?id=${prod.id}` }
                ];
                carryingMarkets.slice(0, 2).forEach(m => {
                    links.push({ text: `View ${m.name}`, url: `${pagePrefix}markets-details.html?id=${m.id}` });
                });
                return { html: text, links: links };
            }
        }

        // Check for predefined questions in chatbot.json
        for (const item of chatbotData) {
            const matchedKeyword = (item.keywords || []).some(k => query.includes(k.toLowerCase()));
            if (matchedKeyword || query.includes(item.question.toLowerCase())) {
                const links = (item.links || []).map(l => ({
                    text: l.text,
                    url: `${pagePrefix}${l.url}`
                }));
                return { html: item.answer, links: links };
            }
        }

        // Check for Area searches (e.g. Saddar, DHA, Super Highway, Clifton, Musa Colony)
        for (const market of marketsData) {
            const areaLower = market.area.toLowerCase();
            if (query.includes(areaLower)) {
                const areaMarkets = marketsData.filter(m => m.area.toLowerCase() === areaLower);
                let text = `Found <b>${areaMarkets.length} market(s)</b> in <b>${market.area}</b>:<br><ul class="mb-2 ps-3">`;
                areaMarkets.forEach(m => {
                    text += `<li><b>${m.name}</b> — ${m.address}</li>`;
                });
                text += `</ul>`;
                const links = areaMarkets.map(m => ({
                    text: `View ${m.name}`,
                    url: `${pagePrefix}markets-details.html?id=${m.id}`
                }));
                return { html: text, links: links };
            }
        }

        // Fallback Response (Requirement 38)
        return {
            html: "I'm sorry, I couldn't find an exact answer. Try asking about <b>markets</b>, <b>opening hours</b>, <b>produce</b>, <b>seasons</b>, or <b>locations</b>. 😊",
            links: [
                { text: "Explore All Markets", url: `${pagePrefix}market.html` },
                { text: "View Seasonal Produce", url: `${pagePrefix}produce.html` },
                { text: "How FreshFind Works", url: `${pagePrefix}about.html` }
            ]
        };
    }

    /**
     * Appends a message bubble to the chat stream
     */
    function appendMessage(htmlContent, sender, links = []) {
        const stream = document.getElementById("chatbotMessages");
        if (!stream) return;

        const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        const msgDiv = document.createElement("div");
        msgDiv.className = `chat-message ${sender}-message`;

        let linksHtml = "";
        if (links && links.length > 0) {
            linksHtml = `<div class="chatbot-action-links mt-2 d-flex flex-wrap gap-1">`;
            links.forEach(l => {
                linksHtml += `<a href="${l.url}" class="chat-deep-link"><i class="fa-solid fa-arrow-up-right-from-square me-1"></i> ${l.text}</a>`;
            });
            linksHtml += `</div>`;
        }

        msgDiv.innerHTML = `
            <div class="message-bubble">
                <div class="message-text">${htmlContent}</div>
                ${linksHtml}
            </div>
            <span class="message-time">${timeStr}</span>
        `;

        stream.appendChild(msgDiv);
        stream.scrollTop = stream.scrollHeight;
    }

    function showTypingIndicator() {
        const stream = document.getElementById("chatbotMessages");
        if (!stream) return null;

        const id = "typing_" + Date.now();
        const typingDiv = document.createElement("div");
        typingDiv.id = id;
        typingDiv.className = "chat-message bot-message typing-indicator-msg";
        typingDiv.innerHTML = `
            <div class="message-bubble typing-bubble">
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
            </div>
        `;
        stream.appendChild(typingDiv);
        stream.scrollTop = stream.scrollHeight;
        return id;
    }

    function removeTypingIndicator(id) {
        if (!id) return;
        const el = document.getElementById(id);
        if (el) el.remove();
    }

})();