
let allMarkets = [];

fetch("../data/markets.json")
    .then(function (response) {
        return response.json();
    })

    .then(function (markets) {
        allMarkets = markets;

        const featuredMarkets = markets.slice(0, 4);

        showMarketCards(featuredMarkets);

        fillAreaOptions(markets);
        fillDayOptions(markets);
        fillProduceOptions(markets);
    })

    .catch(function (error) {
        console.log("JSON file is not loaded:", error);
    });


function fillAreaOptions(markets) {
    const areaSelect = document.querySelector("#area");

    const areas = [];

    markets.forEach(function (market) {
        if (!areas.includes(market.area)) {
            areas.push(market.area);
        }
    });

    areas.forEach(function (area) {
        const option = document.createElement("option");

        option.value = area;
        option.textContent = area;

        areaSelect.appendChild(option);
    });
}
function fillDayOptions(markets) {
    const daySelect = document.querySelector("#day");

    const days = [];

    markets.forEach(function (market) {
        market.days.forEach(function (day) {
            if (!days.includes(day)) {
                days.push(day);
            }
        });
    });

    days.forEach(function (day) {
        const option = document.createElement("option");

        option.value = day;
        option.textContent = day;

        daySelect.appendChild(option);
    });
}
function fillProduceOptions(markets) {
    const produceSelect = document.querySelector("#produce");

    const products = [];

    markets.forEach(function (market) {
        market.products.forEach(function (product) {
            if (!products.includes(product)) {
                products.push(product);
            }
        });
    });

    products.forEach(function (product) {
        const option = document.createElement("option");

        option.value = product;
        option.textContent = product;

        produceSelect.appendChild(option);
    });
}

function showMarketCards(marketsToShow) {
    const cardsContainer = document.querySelector("#featured-market-cards");
    const noMarketMessage = document.querySelector("#no-market-message");

    cardsContainer.innerHTML = "";

    if (marketsToShow.length === 0) {
        noMarketMessage.textContent =
            "No markets found for your selected filters.";

        noMarketMessage.classList.add("show");

        return;
    }
    noMarketMessage.textContent = "";
    noMarketMessage.classList.remove("show");

    marketsToShow.forEach(function (market) {
        const marketCard = document.createElement("div");

        marketCard.classList.add("market-card");

        marketCard.innerHTML = `
            <img src="${market.image}" alt="${market.name}">

            <span class="market-status">Featured</span>

            <div class="market-card-content">
                <h3>${market.name}</h3>
                <p>⌖ ${market.area}</p>
                <p>▣ ${market.days.join(", ")}</p>
                <p>◷ ${market.hours}</p>

                <p class="market-description">
                    ${market.description}
                </p>
            </div>
        `;

        cardsContainer.appendChild(marketCard);
    });
}

const searchButton = document.querySelector(".search-button");

searchButton.addEventListener("click", function () {

    const selectedArea = document.querySelector("#area").value;
    const selectedDay = document.querySelector("#day").value;
    const selectedProduce = document.querySelector("#produce").value;
    const selectedSort = document.querySelector("#sort").value;


    // Filter markets

    const matchingMarkets = allMarkets.filter(function (market) {

        const areaMatches =
            selectedArea === "" || market.area === selectedArea;

        const dayMatches =
            selectedDay === "" || market.days.includes(selectedDay);

        const produceMatches =
            selectedProduce === "" || market.products.includes(selectedProduce);

        return areaMatches && dayMatches && produceMatches;

    });


    // Sort markets

    if (selectedSort === "az") {

        matchingMarkets.sort(function (a, b) {
            return a.name.localeCompare(b.name);
        });

    }

    if (selectedSort === "za") {

        matchingMarkets.sort(function (a, b) {
            return b.name.localeCompare(a.name);
        });

    }


    // Show only 4 markets

    const finalMarkets = matchingMarkets.slice(0, 4);

    showMarketCards(finalMarkets);

    console.log(finalMarkets);

});


fetch("../data/products.json")
    .then(function (response) {
        return response.json();
    })

    .then(function (products) {
        const seasonalProducts = products
            .filter(function (product) {
                return product.season === "Summer";
            })
            .slice(0, 6);

        showSeasonalProducts(seasonalProducts);
        console.log(seasonalProducts);
    })

    .catch(function (error) {
        console.log("Products JSON file is not loaded properly:", error);
    });

    function showSeasonalProducts(productsToShow) {
    const seasonalContainer = document.querySelector("#seasonal-products");

    seasonalContainer.innerHTML = "";

    productsToShow.forEach(function (product) {
        const seasonalCard = document.createElement("div");

        seasonalCard.classList.add("seasonal-item");

        seasonalCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.season}</p>
        `;

        seasonalContainer.appendChild(seasonalCard);
    });
}