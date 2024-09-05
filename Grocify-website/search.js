document.addEventListener('DOMContentLoaded', () => {
    const searchBox = document.getElementById("search-box");

    searchBox.addEventListener("input", () => {
        const searchQuery = searchBox.value.toLowerCase();
        const productBoxes = document.querySelectorAll(".box");

        productBoxes.forEach(box => {
            const productName = box.querySelector("h3").textContent.toLowerCase();
            
            if (productName.includes(searchQuery)) {
                box.style.display = "block"; // Show product
            } else {
                box.style.display = "none"; // Hide product
            }
        });
    });
});
