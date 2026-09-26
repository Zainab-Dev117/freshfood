document.addEventListener("DOMContentLoaded", function () {

    // Get product ID from URL
    var urlParams = new URLSearchParams(window.location.search);
    var productId = urlParams.get("id");

    // Load products data
    fetch("../data/products.json")
        .then(response => response.json())
        .then(products => {

            // Find the selected product
            var product = products.find(item => item.id == productId);

            if (product) {

                // Display product information
                document.getElementById("productImage").src = product.image;
                document.getElementById("productName").textContent = product.name;
                document.getElementById("productCategory").textContent = product.category;
                document.getElementById("productDescription").textContent = product.description;
                document.getElementById("productSeason").textContent = product.season;

                // Load available markets
                loadMarkets(product.markets);

            }

        })
        .catch(error => {
            console.log("Error loading products:", error);
        });

});


function loadMarkets(marketIds) {

    // Load markets data
    fetch("../data/markets.json")
        .then(response => response.json())
        .then(markets => {

            var marketsContainer = document.getElementById("productMarkets");

            // Clear old content
            marketsContainer.innerHTML = "";

            // Find and display each market
            marketIds.forEach(function (marketId) {

                var market = markets.find(item => item.id == marketId);

                if (market) {

                    var marketCard = document.createElement("div");

                    marketCard.className = "product-market-card";

                    marketCard.innerHTML = `
                        
                        <div class="product-market-image">
                            <img src="../${market.image}" alt="${market.name}">
                        </div>

                        <div class="product-market-content">

                            <h3>${market.name}</h3>

                            <p class="market-location">
                                ${market.area}
                            </p>

                            <p>
                                ${market.address}
                            </p>

                            <p>
                                ${market.days.join(", ")}
                            </p>

                            <p>
                                ${market.hours}
                            </p>

                            <a href="../markets-details.html?id=${market.id}" 
                               class="view-market-btn">
                                View Market
                            </a>

                        </div>
                    `;

                    marketsContainer.appendChild(marketCard);

                }

            });

        })
        .catch(error => {
            console.log("Error loading markets:", error);
        });

}