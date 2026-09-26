var allProducts = [];

document.addEventListener("DOMContentLoaded", function () {

    fetch("../data/products.json")
        .then(response => response.json())
        .then(products => {

            allProducts = products;

            displayProducts(allProducts);
        })
        .catch(error => {
            console.error("Error loading products:", error);
        });

});


function displayProducts(products) {

    const container = document.getElementById("productsContainer");

    container.innerHTML = "";

    products.forEach(product => {

        const card = `
            <div class="product-card">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                >

                <div class="product-content">

                    <span class="product-category">
                        ${product.category}
                    </span>

                    <h3>${product.name}</h3>

                    <p>
                        ${product.description}
                    </p>

                    <div class="product-info">

                        <span>
                            <i class="fa-solid fa-calendar"></i>
                            ${product.season}
                        </span>

                        <span>
                            <i class="fa-solid fa-location-dot"></i>
                            ${product.market}
                        </span>

                    </div>
                    <a href="product-detail.html?id=${product.id}" class="view-btn"> View Details </a>

                </div>

            </div>
        `;

        container.innerHTML += card;
    });
}


function filterProducts() {

    var searchValue =
        document.getElementById("searchProduct").value.toLowerCase();

    var categoryValue =
        document.getElementById("categoryFilter").value;

    var filteredProducts = allProducts.filter(function(product) {

        var searchMatch =
            product.name.toLowerCase().includes(searchValue);

        var categoryMatch =
            categoryValue === "all" ||
            product.category === categoryValue;

        return searchMatch && categoryMatch;
    });

    displayProducts(filteredProducts);
}