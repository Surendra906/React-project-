const API_URL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false";

let cryptoData = [];
let filteredData = [];

// 1. Fetch data using async/await
async function fetchDataAsync() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`Request failed: ${response.status}`);
        const data = await response.json();
        cryptoData = data;
        filteredData = data;
        renderTable(filteredData);
    } catch (error) {
        console.error("Error fetching data with async/await:", error);
    }
}

// 2. Fetch data using .then
function fetchDataThen() {
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            cryptoData = data;
            filteredData = data;
            renderTable(filteredData);
        })
        .catch(error => console.error("Error fetching data with .then:", error));
}

// Render Table Function matching Figma layout
function renderTable(data) {
    const tableBody = document.getElementById("tableBody");
    tableBody.innerHTML = "";

    data.forEach(coin => {
        const row = document.createElement("tr");
        const priceChange = coin.market_cap_change_percentage_24h || 0;
        const priceChangeClass = priceChange >= 0 ? "positive" : "negative";

        row.innerHTML = `
            <td>
                <div class="coin-info">
                    <img src="${coin.image}" alt="${coin.name}">
                    <span class="name">${coin.name}</span>
                </div>
            </td>
            <td><span class="symbol">${coin.symbol}</span></td>
            <td><span class="price">$${coin.current_price.toLocaleString()}</span></td>
            <td><span class="volume">$${coin.total_volume.toLocaleString()}</span></td>
            <td><span class="${priceChangeClass}">${priceChange.toFixed(2)}%</span></td>
            <td><span class="mkt-cap">Mkt Cap: $${coin.market_cap.toLocaleString()}</span></td>
        `;
        tableBody.appendChild(row);
    });
}

// Search Functionality
function handleSearch() {
    const query = document.getElementById("searchInput").value.toLowerCase();
    filteredData = cryptoData.filter(coin => 
        coin.name.toLowerCase().includes(query) || 
        coin.symbol.toLowerCase().includes(query)
    );
    renderTable(filteredData);
}

// Sort by Market Cap
function sortMktCap() {
    filteredData.sort((a, b) => b.market_cap - a.market_cap);
    renderTable(filteredData);
}

// Sort by Percentage Change
function sortPercentage() {
    filteredData.sort((a, b) => {
        const changeA = a.market_cap_change_percentage_24h || 0;
        const changeB = b.market_cap_change_percentage_24h || 0;
        return changeB - changeA;
    });
    renderTable(filteredData);
}

// Initial fetch on page load using async/await
window.onload = () => {
    fetchDataAsync();
};