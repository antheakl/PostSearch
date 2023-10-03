// Funktion zum Suchen von Posts
async function searchPosts() {
    try {
        // Modal für Suchergebnisse erzeugen und vorherige Ergebnisse löschen
        const resultsDiv = document.getElementById("results");
        resultsDiv.innerHTML = "";
        const failDiv = document.getElementById("failResults");
        failDiv.innerHTML="";
        const searchTerm = document.getElementById("search-input").value;
        if (searchTerm.trim() === "") {
            // Wenn die Suchanfrage leer ist, zeige eine Nachricht an
            failDiv.innerHTML = "<p>Geben Sie bitte einen Suchbegriff ein.</p>";
        } else {
            // Suche in API eingeben
            const response = await fetch(`https://dummyjson.com/posts/search?q=${searchTerm}`);
            const data = await response.json();
            // Wenn Suchbegriff eingegeben wurde, der in keinem Post vorkommt
            if (!data.posts || data.posts.length === 0) {
                failDiv.innerHTML = "<p>Keine Posts mit diesem Inhalt gefunden.</p>";
            } else {
                for (let post of data.posts || []) {
                    // Erstellen einer Bootstrap-Card für jeden Post
                    const cardDiv = document.createElement("div");
                    cardDiv.className = "card m-2";
                    const cardBodyDiv = document.createElement("div");
                    cardBodyDiv.className = "card-body";

                    // Card-Titel
                    const cardTitle = document.createElement("h5");
                    cardTitle.className = "card-title";
                    cardTitle.textContent = post.title;

                    // Weitere Informationen (Card-Subtitle oder Card-Text)
                    const cardSubtitle = document.createElement("h6");
                    cardSubtitle.className = "card-subtitle mb-2 text-body-secondary";
                    cardSubtitle.textContent = `${post.reactions} Reaktionen`;

                    const cardText = document.createElement("p");
                    cardText.className = "card-text";
                    cardText.textContent = `Tags: ${post.tags}`;

                    // Link zur Detailansicht
                    const cardLink = document.createElement("a");
                    cardLink.className = "card-link";
                    cardLink.textContent = "Details";
                    cardLink.href = `Detailview.html?id=${post.id}`;

                    cardBodyDiv.appendChild(cardTitle);
                    cardBodyDiv.appendChild(cardSubtitle);
                    cardBodyDiv.appendChild(cardText);
                    cardBodyDiv.appendChild(cardLink);
                    cardDiv.appendChild(cardBodyDiv);
                    resultsDiv.appendChild(cardDiv);
                }
            }
        }
    } catch (error) {
        // Fehleranzeige in Konsole und auf "normalem" Bildschirm
        console.error("Da ist etwas bei der Suche falsch gelaufen..sorry!", error);
        displayError("Da ist etwas bei der Suche falsch gelaufen..sorry!");
    }
}


// Event Listener hinzufügen, um die Postdetails aufzurufen, wenn auf einen Posttitel geklickt wird.
document.addEventListener("DOMContentLoaded", function () {
    const searchButton = document.querySelector("button");
    searchButton.addEventListener("click", searchPosts);
    searchButton.addEventListener("keydown", function (event) {
        //Schauen ob Enter gedrückt wurde
        if (event.key === "Enter") {
            searchPosts();
        }
    });
});
