// Funktion zum Suchen von Posts mit Inhalt der Suche
async function searchPosts() {
    try {
        // Div für Ergebnisse registrieren und vorherige Ergebnisse löschen
        const resultsDiv = document.getElementById("results");
        resultsDiv.innerHTML = "";
        const failDiv = document.getElementById("failResults");
        failDiv.innerHTML="";
        //Suche aus search-input holen
        const searchTerm = document.getElementById("search-input").value;
        if (searchTerm.trim() === "") {
            // Wenn die Suchanfrage leer ist, zeige eine Nachricht an
            failDiv.innerHTML = "<p>Geben Sie bitte einen Suchbegriff ein.</p>";
        } else {
            // API nach Suchbegriff durchsuchen
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

                    //Post-Titel als Card-Titel hinzufügen
                    const cardTitle = document.createElement("h5");
                    cardTitle.className = "card-title";
                    cardTitle.textContent = post.title;

                    //Reaktionen als Card-Subtitle hinzufügen
                    const cardSubtitle = document.createElement("h6");
                    cardSubtitle.className = "card-subtitle mb-2 text-body-secondary";
                    cardSubtitle.textContent = `${post.reactions} Reaktionen`;

                    //Tags des Posts als Card-Text hinzufügen
                    const cardText = document.createElement("p");
                    cardText.className = "card-text";
                    cardText.textContent = `Tags: ${post.tags}`;

                    // Link zur Detailansicht als Card-Links hinzufügen
                    const cardLink = document.createElement("a");
                    cardLink.className = "card-link";
                    cardLink.textContent = "Details";
                    cardLink.href = `Detailview.html?id=${post.id}`;

                    //Alle Elemente der Card dem CardBody hinzufügen und schließlich dem Ergebnis Div
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


// Event Listener hinzufügen, um Posts zu suchen, wenn auf Suchen-Button gedrückt wird.
document.addEventListener("DOMContentLoaded", function () {
    const searchButton = document.querySelector("button");
    searchButton.addEventListener("click", searchPosts);
});
