// Funktion zum Suchen von Posts
async function searchPosts() {
    try {
        const resultsDiv = document.getElementById("results");
        resultsDiv.innerHTML = ""; // Lösche vorherige Ergebnisse
        const searchTerm = document.getElementById("search-input").value;
        const response = await fetch(`https://dummyjson.com/posts/search?q=${searchTerm}`);
        const data = await response.json();

        if(!data.posts || data.posts.length=== 0){
            resultsDiv.innerHTML = "<p>Keine Posts mit diesem Inhalt gefunden.</p>";
        }
        for(let post of data.posts || []){
            const ul = document.createElement("ul");
            const li = document.createElement("li");
            const link = document.createElement("a");
            link.textContent = post.title;
            link.href = `Detailview.html?id=${post.id}`; // Verlinke zur Detailseite mit Produkt-ID
            li.appendChild(link);
            ul.appendChild(li);
            resultsDiv.appendChild(ul);
        }
    } catch(error){
            console.error("Da ist etwas falsch gelaufen..sorry!", error);
        }
}

// Event Listener hinzufügen, um die Postdetails aufzurufen, wenn auf einen Posttitel geklickt wird.
document.addEventListener("DOMContentLoaded", function () {
    const searchButton = document.querySelector("button");
    searchButton.addEventListener("click", searchPosts);
});
