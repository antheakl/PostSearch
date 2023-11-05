// Funktion zum Suchen von Posts mit Inhalt der Suche
async function searchPosts() {
    try {
        // Div für Ergebnisse registrieren und vorherige Ergebnisse löschen
        const resultsDiv = document.getElementById("results");
        resultsDiv.innerHTML = "";
        const failDiv = document.getElementById("failResults");
        failDiv.textContent = ``;
        //Suche aus search-input holen
        const searchTerm = document.getElementById("search-input").value;
        if (searchTerm.trim() === "") {
            // Wenn die Suchanfrage leer ist, zeige eine Nachricht an
            failDiv.textContent = `Geben Sie bitte einen Suchbegriff ein.`;
        } else {
            // API nach Suchbegriff durchsuchen
            const response = await fetch(`https://dummyjson.com/posts/search?q=${searchTerm}`);
            const data = await response.json();
            // Wenn Suchbegriff eingegeben wurde, der in keinem Post vorkommt
            if (!data.posts || data.posts.length === 0) {
                failDiv.textContent = `Keine Posts mit diesem Inhalt gefunden.`
            } else {
                for (let post of data.posts || []) {
                    // Erstellen einer Bootstrap-Card für jeden Post
                    const cardDiv = document.createElement("div");
                    cardDiv.className = "card m-2";
                    cardDiv.id="card-search"
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

                    //Alle Elemente der Card dem CardBody hinzufügen und schließlich dem Ergebnis Div
                    cardBodyDiv.appendChild(cardTitle);
                    cardBodyDiv.appendChild(cardSubtitle);
                    cardBodyDiv.appendChild(cardText);
                    cardBodyDiv.appendChild(cardLink);
                    cardDiv.appendChild(cardBodyDiv);
                    resultsDiv.appendChild(cardDiv);

                    cardLink.addEventListener("click", function() {
                        const postId = post.id;
                        window.location.hash = `/posts/${postId}`;
                    });
                }

            }
        }
    } catch (error) {
        // Fehleranzeige in Konsole und auf "normalem" Bildschirm
        console.error("Da ist etwas bei der Suche falsch gelaufen..sorry!", error);
        displayError("Da ist etwas bei der Suche falsch gelaufen..sorry!");
    }
}

//allstart div initialisieren um es wieder einzublenden wenn auf den homebutton gedrückt wird
const allstart = document.getElementById("allstart")
const homeButtonElements = document.querySelectorAll("homebutton");
const resultsDiv = document.getElementById("results");
homeButtonElements.forEach(button =>button.addEventListener("click",function(){
    allstart.style.display = 'block';  //Elemente einblenden
    resultsDiv.innerHTML="";
}));

//Header und Hintergrund aus Header HTML laden
fetch("Header.html")
    .then(response => response.text())
    .then(data => {
        document.getElementById("header").innerHTML = data;
    });
//Footer wird aus Footer HTML laden
fetch("Footer.html")
    .then(response => response.text())
    .then(data => {
        document.getElementById("footer").innerHTML = data;
    });
//Detailseite wird aus HTML Datei geladen aber noch ausgeblendet
fetch('Detailview.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('detail-page').innerHTML = data;
    });


// Event Listener hinzufügen, um Posts zu suchen, wenn auf Suchen-Button gedrückt wird oder Enter Taste betätigt wird.
document.getElementById('search').addEventListener('submit', function (e) {
    e.preventDefault();
    searchPosts();
    window.location.hash = `/search`; //Verlinkung zur URL der Suchergbenisse bei Ausführen der Suche
});
document.getElementById('search-button').addEventListener('click', function () {
    searchPosts();
    window.location.hash = `/search`;
});

//SwapContent Methode anpassen
window.addEventListener("load", () => {
    /**
     * Hilfsfunktion zum Umschalten des sichtbaren Inhalts
     *
     * @param {String} id HTML-ID des anzuzeigenden <main>-Elements//Hier wird die ID des (bei mir) main-Element gespeichert
     * @param {String} title Neuer Titel für den Browser-Tab//Hier wird der Titel der im Tab angezeigt werden soll gespeichert
     */

    //blendet Inhalte aus und ein
    let swapContent = (id, title) => {

        document.querySelectorAll("main").forEach(mainElement => {
            mainElement.classList.add("hidden");
        })
        let element = document.querySelector(`#${id}`); //Elements was die swapContentFunktion aufruft
        if (element)element.classList.remove("hidden"); //Hidden-Klasse entfernen

        document.title = ` ${title} | Postfinder`; //Titel ändern
    }

    /**
     * Konfiguration des URL-Routers
     * URLs definieren welche es geben soll
     */
    let routes = [
        {
            url: "^/$", //Startseite
            show: () => swapContent("start-page", "Search-Page"),
        },{
            url: "^/posts/(.*)$",  // URL wenn auf ein Post geklickt wird;
            show: (matches) => {
                document.getElementById("postDetailsContainer").innerHTML=""
                document.getElementById("postCommentsContainer").innerHTML=""
                document.getElementById("postOfSameUserContainer").innerHTML=""

                getPostDetails(matches);
                swapContent("detail-page", "Post-Details");

            }
        },
        {
            url: "^/search$",  //URL wenn nach Posts gesucht wird
            show: () => swapContent("searchcards", "Searchresults"),
        }
    ];

    let router = new Router(routes); //Ab hier Router-Klasse an ihr muss nichts geändert werden
    router.start();
});



