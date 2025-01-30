document.getElementById("search-bar").addEventListener("input", async function () {
    let query = this.value.trim();
    if (query.length < 3) return;

    let response = await fetch("https://graphql.anilist.co", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            query: `
                query ($search: String) {
                    Page(perPage: 10) {
                        media(search: $search, type: ANIME) {
                            id
                            title { romaji }
                            coverImage { large }
                            siteUrl
                        }
                    }
                }
            `,
            variables: { search: query }
        })
    });

    let data = await response.json();
    let animeContainer = document.getElementById("anime-container");
    animeContainer.innerHTML = "";

    data.data.Page.media.forEach(anime => {
        let animeCard = document.createElement("div");
        animeCard.classList.add("anime-card");
        animeCard.innerHTML = `
            <img src="${anime.coverImage.large}" alt="${anime.title.romaji}">
            <h3>${anime.title.romaji}</h3>
            <button onclick="watchAnime('${anime.title.romaji}')">Watch Now</button>
        `;
        animeContainer.appendChild(animeCard);
    });
});

function watchAnime(title) {
    window.location.href = `watch.html?title=${encodeURIComponent(title)}`;
}
