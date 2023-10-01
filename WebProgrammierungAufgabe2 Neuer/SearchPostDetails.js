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
        //Post ID in API unter Posts suchen
        const response = await fetch(`https://dummyjson.com/posts/${postId}`);
        const post = await response.json();
        // Modal erstellen
        const modal1 = document.createElement("div");
        modal1.classList.add("modal1");

        const modal1Content = document.createElement("div");
        modal1Content.classList.add("modal1-content");

        // Modal befüllen mit Details des Posts
        const postTitle = document.createElement("h2");
        postTitle.textContent = `Titel: ${post.title}`;

        const postBody = document.createElement("p");
        postBody.textContent = `Post: ${post.body}`;

        const postTags = document.createElement("p");
        postTags.textContent = `Tags: ${post.tags}`;

        const postReactions = document.createElement("p");
        postReactions.textContent = `Reaktionen: ${post.reactions}`;

        const postAuthor = document.createElement("p");
        postAuthor.textContent = `Autor-ID: ${post.userId} `;

        // alle Modal-Inhalte zum modalContent-div hinzufügen
        modal1Content.appendChild(postTitle);
        modal1Content.appendChild(postBody);
        modal1Content.appendChild(postTags);
        modal1Content.appendChild(postReactions);
        modal1Content.appendChild(postAuthor);

        // modalContent-div zum Modal hinzufügen
        modal1.appendChild(modal1Content);
//test
        //das Modal zum Dokument hinzufügen
        document.body.appendChild(modal1);
        await getAllPostsOfSameUser(post.userId);

    } catch (error) {
        //Fehleranzeige in Konsole und auf "normalem" Bildschirm
        console.error("Fehler beim Abrufen der Postdetails:", error);
        displayError("Fehler beim Abrufen der Postdetails.");
    }
}

//Post Kommentare abrufen
async function getPostComments(postId) {
    try {
        //Kommentare des Posts in API suchen
        const response = await fetch(`https://dummyjson.com/posts/${postId}/comments`);
        const comments = await response.json();
        //Modal2 erstellen
        const modal2 = document.createElement("div");
        modal2.classList.add("modal2");

        const modal2Content = document.createElement("div");
        modal2Content.classList.add("modal2-content");

        const kommentarUeberschrift = document.createElement("h2");
        kommentarUeberschrift.textContent = `Kommentare:`;

        modal2Content.appendChild(kommentarUeberschrift);

        //Kommentare aus Array holen und in Modul integrieren
        if (comments.comments.length > 0) {
            for (let comment of comments.comments) {

                const commentUser = document.createElement("p");
                commentUser.textContent = `User: ${comment?.user?.username || "Kein Username gefunden"}`;

                const commentBody = document.createElement("p");
                commentBody.textContent = `Kommentar: ${comment.body}`;

                // alle Modal-Inhalte zum modalContent-div hinzufügen
                modal2Content.appendChild(commentUser);
                modal2Content.appendChild(commentBody);
            }
        } else {
            //bei keinen Kommentaren wird Hinweistext unter Überschrift angezeigt
            const keineKommentare = document.createElement("p");
            keineKommentare.textContent = `Für diesen Post sind leider keine Kommentare vorhanden`;

            modal2Content.appendChild(keineKommentare);
        }
        // modal2Content zum Modal hinzufügen
        modal2.appendChild(modal2Content);

        //das Modal zum Dokument hinzufügen
        document.body.appendChild(modal2);
    } catch (error) {
        //Fehleranzeige in Konsole und auf "normalem" Bildschirm
        console.error("Fehler beim Abrufen von Kommentardetails:", error);
        displayError("Fehler beim Abrufen von Kommentardetails.");
    }
}

async function getAllPostsOfSameUser(userId) {
    try {
        //Alle Kommentare des Users in API suchen
        const response = await fetch(`https://dummyjson.com/posts/user/${userId}`);
        const userPosts = await response.json();
        //Modal 3 erstellen
        const modal3 = document.createElement("div");
        modal3.classList.add("modal3");

        const modal3Content = document.createElement("div");
        modal3Content.classList.add("modal3-content");

        const aehnlichePostsUeberschrift = document.createElement("h2");
        aehnlichePostsUeberschrift.textContent = `Andere Posts des Users:`;

        modal3Content.appendChild(aehnlichePostsUeberschrift);

        if ( userPosts.posts.length > 0) {
            for (let similarPosts of userPosts.posts) {
                //Titel als Links aus Post-Array erzeugen
                const ul = document.createElement("ul");
                const li = document.createElement("li");
                const link = document.createElement("a");

                link.textContent = similarPosts.title;
                link.href = `Detailview.html?id=${similarPosts.id}`;

                li.appendChild(link);
                ul.appendChild(li);

                modal3Content.appendChild(ul);
            }
        } else {
            const keinePosts = document.createElement("p");
            keinePosts.textContent = `Dieser User hat sonst leider keine anderen Posts.`;

            modal3Content.appendChild(keinePosts);
        }
        modal3.appendChild(modal3Content);

        document.body.appendChild(modal3);
    } catch (error) {
        //Fehleranzeige in Konsole und auf "normalem" Bildschirm
        console.error("Fehler beim Abrufen von Kommentaren von gleichem User.", error);
        displayError("Fehler beim Abrufen von Kommentaren von gleichem User.");
    }
}
function displayError(message) {
    const postDetailsDiv = document.getElementById("post-details");
    postDetailsDiv.innerHTML = `<p>${message}</p>`;
}

