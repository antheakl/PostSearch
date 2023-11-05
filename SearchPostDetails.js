
//Post Details abrufen
async function getPostDetails(matches) {
    const display = document.getElementById("detail-page");
    const postId = matches[1];
    console.log(postId);

    try {
        // Post ID in API unter Posts suchen
        const response = await fetch(`https://dummyjson.com/posts/${postId}`);
        const post = await response.json();

        const responseUser = await fetch(`https://dummyjson.com/user/${post.userId}`);
        const user = await responseUser.json();

        // Erstellen einer Bootstrap Card für die Postdetails und befüllen mit Detail-Daten
        const postDetailsCard = document.createElement("div");
        postDetailsCard.classList.add("card");
        postDetailsCard.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${post.title}</h5>
                <p class="card-text">${post.body}</p>
                <p class="card-text"><strong>Tags:</strong> ${post.tags.map((tag)=>("#"+tag+" "))}</p>
                <p class="card-text"><strong>Reaktionen:</strong> ${post.reactions}</p>
                <p class="autor"><strong>Autor: </strong> 
                <div class="user-profile">
                <img class="user-image" src=${user.image} alt="Benutzerbild">
                    <div class="user-info">
                    <p class="name">${user.firstName} ${user.lastName} ${user.age}</p>
                    </div>
                </div>
                 </p>
            </div>
        `;

        // Füge die Bootstrap Card dem DOM hinzu
        const postDetailsContainer = document.getElementById("postDetailsContainer");
        postDetailsContainer.appendChild(postDetailsCard);
        display.append(postDetailsContainer);
        //Funktion für andere Posts des Users aufrufen
        await getAllPostsOfSameUser(post.userId, display);

    } catch (error) {
        // Fehleranzeige in Konsole und auf "normalem" Bildschirm
        console.error("Fehler beim Abrufen der Postdetails:", error);
        displayError("Fehler beim Abrufen der Postdetails.");
    }
    await getPostComments(postId, display)
}

// Post Kommentare abrufen
async function getPostComments(postId, display) {
    try {
        // Kommentare des Posts in API suchen
        const response = await fetch(`https://dummyjson.com/posts/${postId}/comments`);
        const comments = await response.json();

        // Erstellen einer Bootstrap Card für die Kommentare
        const commentsCard = document.createElement("div");
        commentsCard.classList.add("card");
        commentsCard.innerHTML = `<div class="card-body"><h5 class="card-title">Kommentare:</h5></div>`;

        const cardBody = commentsCard.querySelector(".card-body");

        // Kommentare aus Array holen und in die Card integrieren
        if (comments.comments.length > 0) {
            for (let comment of comments.comments) {
                //User-Profilbild und Namen aus API holen
                const responseUser = await fetch(`https://dummyjson.com/user/${comment.user.id}`);
                const user = await responseUser.json();
                //Profilbild und Namen in div einfügen
                const commentUser = document.createElement("div");
                commentUser.innerHTML = `<div class= "user-profile-comments">
                    <img class="user-image" src=${user.image} alt="Benutzerbild"></img>
                        <div class="user-info">
                            <p class="name">${user.firstName} ${user.lastName} ${user.age}</p>
                        </div>
                </div>`;

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
        display.append(postCommentsContainer);


    } catch (error) {
        // Fehleranzeige in Konsole und auf "normalem" Bildschirm
        console.error("Fehler beim Abrufen von Kommentardetails:", error);
        displayError("Fehler beim Abrufen von Kommentardetails.");
    }
}

async function getAllPostsOfSameUser(userId, display) {
    try {
        // Alle Posts des Users in API suchen
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
        //Card-Body erstellen
        const cardBody = userPostsCard.querySelector(".card-body");
        //Card-Body mit Links zu anderen Posts befüllen
        if (userPosts.posts.length > 0) {
            for (let similarPosts of userPosts.posts) {
                // Titel als Links aus Post-Array erzeugen
                const link = document.createElement("a");
                link.textContent = similarPosts.title;
                link.addEventListener("click", function() {
                    const postId = similarPosts.id;
                    window.location.hash = `/posts/${postId}`;
                });
                link.classList.add("card-link");
                // Füge den Link zur Card hinzu
                cardBody.appendChild(link);
            }
            //Wenn keine anderen Posts vorhanden sein sollten
        } else {
            const keinePosts = document.createElement("p");
            keinePosts.textContent = `Dieser User hat sonst leider keine anderen Posts.`;

            cardBody.appendChild(keinePosts);
        }

        // Füge die Bootstrap Card dem DOM hinzu
        const postOfSameUserContainer = document.getElementById("postOfSameUserContainer");
        postOfSameUserContainer.appendChild(userPostsCard);
        display.append(postOfSameUserContainer);
    } catch (error) {
        // Fehleranzeige in Konsole und auf "normalem" Bildschirm
        console.error("Fehler beim Abrufen von Kommentaren von gleichem User.", error);
        displayError("Fehler beim Abrufen von Kommentaren von gleichem User.");
    }
}
//Errormessage
function displayError(message) {
    const postDetailsDiv = document.getElementById("post-details");
    postDetailsDiv.innerHTML = `<p>${message}</p>`;
}



