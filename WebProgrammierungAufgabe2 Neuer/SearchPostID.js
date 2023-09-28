// Funktion zum Suchen von Produkten
function searchPosts() {
    const searchTerm = document.getElementById("search-input").value;
    fetch(`https://dummyjson.com/posts/search?q=${searchTerm}`)
        .then(res => res.json())
        .then(data => {
            displayResults(data.posts);
        })
        .catch(error => {
            console.error("Da ist etwas falsch gelaufen..sorry!", error);
        });
}
function displayResults(posts) {
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = ""; // Lösche vorherige Ergebnisse

    if (posts.length === 0) {
        resultsDiv.innerHTML = "<p>Keine Posts mit diesem Inhalt gefunden.</p>";
    } else {
        const ul = document.createElement("ul");

        posts.forEach(post => {
            const li = document.createElement("li");
            const link = document.createElement("a");
            link.textContent = post.title;
            link.href = `Detailview.html?id=${post.id}`; // Verlinke zur Detailseite mit Produkt-ID
            li.appendChild(link);
            ul.appendChild(li);
        });

        resultsDiv.appendChild(ul);
    }
}

// Event Listener hinzufügen, um die Produktdetails aufzurufen, wenn auf einen Produktnamen geklickt wird.
document.addEventListener("DOMContentLoaded", function () {
    const searchButton = document.querySelector("button");
    searchButton.addEventListener("click", searchPosts);
});
