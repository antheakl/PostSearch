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
        // Post ID in API unter Posts suchen
        const response = await fetch(`https://dummyjson.com/posts/${postId}`);
        const post = await response.json();

        // Erstellen einer Bootstrap Card für die Postdetails
        const postDetailsCard = document.createElement("div");
        postDetailsCard.classList.add("card");
        postDetailsCard.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${post.title}</h5>
                <p class="card-text">${post.body}</p>
                <p class="card-text"><strong>Tags:</strong> ${post.tags}</p>
                <p class="card-text"><strong>Reactions:</strong> ${post.reactions}</p>
                <p class="card-text"><strong>Author:</strong> ${post.userId}</p>
            </div>
        `;

        // Füge die Bootstrap Card dem DOM hinzu
        const postDetailsContainer = document.getElementById("postDetailsContainer");
        postDetailsContainer.appendChild(postDetailsCard);

        await getAllPostsOfSameUser(post.userId);

    } catch (error) {
        // Fehleranzeige in Konsole und auf "normalem" Bildschirm
        console.error("Fehler beim Abrufen der Postdetails:", error);
        displayError("Fehler beim Abrufen der Postdetails.");
    }
}

// Post Kommentare abrufen
async function getPostComments(postId) {
    try {
        // Kommentare des Posts in API suchen
        const response = await fetch(`https://dummyjson.com/posts/${postId}/comments`);
        const comments = await response.json();

        // Erstellen einer Bootstrap Card für die Kommentare
        const commentsCard = document.createElement("div");
        commentsCard.classList.add("card");
        commentsCard.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">Kommentare:</h5>
            </div>
        `;

        const cardBody = commentsCard.querySelector(".card-body");

        // Kommentare aus Array holen und in die Card integrieren
        if (comments.comments.length > 0) {
            for (let comment of comments.comments) {
                const commentUser = document.createElement("p");
                commentUser.textContent = `User: ${comment?.user?.username || "Kein Username gefunden"}`;

                const commentBody = document.createElement("p");
                commentBody.textContent = `Kommentar: ${comment.body}`;

                const commentline = document.createElement("hr");

                // Füge Kommentar-Texte zur Card hinzu
                cardBody.appendChild(commentUser);
                cardBody.appendChild(commentBody);
                cardBody.appendChild(commentline);
            }
        } else {
            // Bei keinen Kommentaren wird Hinweistext in die Card eingefügt
            const keineKommentare = document.createElement("p");
            keineKommentare.textContent = `Für diesen Post sind leider keine Kommentare vorhanden`;

            cardBody.appendChild(keineKommentare);
        }

        // Füge die Bootstrap Card dem DOM hinzu
        const postCommentsContainer = document.getElementById("postCommentsContainer");
        postCommentsContainer.appendChild(commentsCard);

    } catch (error) {
        // Fehleranzeige in Konsole und auf "normalem" Bildschirm
        console.error("Fehler beim Abrufen von Kommentardetails:", error);
        displayError("Fehler beim Abrufen von Kommentardetails.");
    }
}

async function getAllPostsOfSameUser(userId) {
    try {
        // Alle Kommentare des Users in API suchen
        const response = await fetch(`https://dummyjson.com/posts/user/${userId}`);
        const userPosts = await response.json();

        // Erstellen einer Bootstrap Card für andere Posts des Users
        const userPostsCard = document.createElement("div");
        userPostsCard.classList.add("card");
        userPostsCard.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">Andere Posts des Users:</h5>
            </div>
        `;

        const cardBody = userPostsCard.querySelector(".card-body");

        if (userPosts.posts.length > 0) {
            for (let similarPosts of userPosts.posts) {
                // Titel als Links aus Post-Array erzeugen
                const link = document.createElement("a");
                link.textContent = similarPosts.title;
                link.href = `Detailview.html?id=${similarPosts.id}`;
                link.classList.add("card-link");

                // Füge den Link zur Card hinzu
                cardBody.appendChild(link);
            }
        } else {
            const keinePosts = document.createElement("p");
            keinePosts.textContent = `Dieser User hat sonst leider keine anderen Posts.`;

            cardBody.appendChild(keinePosts);
        }

        // Füge die Bootstrap Card dem DOM hinzu
        const postOfSameUserContainer = document.getElementById("postOfSameUserContainer");
        postOfSameUserContainer.appendChild(userPostsCard);
    } catch (error) {
        // Fehleranzeige in Konsole und auf "normalem" Bildschirm
        console.error("Fehler beim Abrufen von Kommentaren von gleichem User.", error);
        displayError("Fehler beim Abrufen von Kommentaren von gleichem User.");
    }
}

function displayError(message) {
    const postDetailsDiv = document.getElementById("post-details");
    postDetailsDiv.innerHTML = `<p>${message}</p>`;
}

