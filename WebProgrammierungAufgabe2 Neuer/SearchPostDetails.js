document.addEventListener("DOMContentLoaded", function () {
    // die Produkt-ID aus der URL holen
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("id");

    if (postId) {
        getPostDetails(postId);
        getPostComments(postId);
    } else {
        // Fehlerfall, wenn keine PostID in der URL gefunden wurde
        displayError("There is no post-id for this post. Please try again.");
    }
});

//Post Details abrufen
async function getPostDetails(postId) {
    try {
        const response = await fetch(`https://dummyjson.com/posts/${postId}`);
        const post = await response.json();
        // Modal erstellen
        const modal1 = document.createElement("div");
        modal1.classList.add("modal1");

        const modal1Content = document.createElement("div");
        modal1Content.classList.add("modal1-content");

        // Modal befüllen mit Details des Posts
        const postTitle = document.createElement("h2");
        postTitle.textContent = `Post-title: ${ post.title}`;

        const postBody = document.createElement("p");
        postBody.textContent = `Post: ${ post.body}`;

        const postTags = document.createElement("p");
        postTags.textContent = `Tags: ${ post.tags}`;

        const postReactions = document.createElement("p");
        postReactions.textContent = `Reaktionen: ${ post.reactions}`;

        const postAuthor = document.createElement("p");
        postAuthor.textContent = `Autor-ID: ${ post.userId} `;

        // alle Modal-Inhalte zum modalContent-div hinzufügen
        modal1Content.appendChild(postTitle);
        modal1Content.appendChild(postBody);
        modal1Content.appendChild(postTags);
        modal1Content.appendChild(postReactions);
        modal1Content.appendChild(postAuthor);

        // modalContent-div zum Modal hinzufügen
        modal1.appendChild(modal1Content);

        //das Modal zum Dokument hinzufügen
        document.body.appendChild(modal1);

    }catch(error){
            console.error("Fehler beim Abrufen der Postdetails:", error);
            displayError("Fehler beim Abrufen der Postdetails.");
        }
}

//Post Kommentare abrufen
async function getPostComments(postId){
    try {
        const response = await fetch(`https://dummyjson.com/posts/${postId}/comments`);
        const comments = await response.json();
        const modal2 = document.createElement("div");
        //Modal2 erstellen
        modal2.classList.add("modal2");

        const modal2Content = document.createElement("div");
        modal2Content.classList.add("modal2-content");

        const kommentarUeberschrift = document.createElement("h2");
        kommentarUeberschrift.textContent = `Kommentare:`;

        modal2Content.appendChild(kommentarUeberschrift);
        console.log(comments.comments[0]);

        if(comments.comments[0] != null) {
            //Kommentare aus Array holen
            const commentUser = document.createElement("p");
            commentUser.textContent = `Username: ${comments.comments[0].user.username}`;

            const commentBody = document.createElement("p");
            commentBody.textContent = `Comment: ${comments.comments[0].body}`;


            // alle Modal-Inhalte zum modalContent-div hinzufügen
            modal2Content.appendChild(commentUser);
            modal2Content.appendChild(commentBody);
        }
        else{
            const keineKommentare = document.createElement("p");
            keineKommentare.textContent = `Für diesen Post sind leider keine Kommentare vorhanden`

            modal2Content.appendChild(keineKommentare);
        }
        // modalContent-div zum Modal hinzufügen
        modal2.appendChild(modal2Content);

        //das Modal zum Dokument hinzufügen
        document.body.appendChild(modal2);

    }catch(error){
            console.error("Fehler beim Abrufen von Kommentardetails:", error);
            displayError("Fehler beim Abrufen von Kommentardetails.");
        }
}
function displayError(message) {
    const postDetailsDiv = document.getElementById("post-details");
    postDetailsDiv.innerHTML = `<p>${message}</p>`;
}

