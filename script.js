const searchBar = document.getElementById("search-bar");
const animeList = document.getElementById("anime-list");
const themeToggle = document.getElementById("theme-toggle");

let themeIndex = 0;
const themes = ["", "dark-mode", "colorful-mode"];

themeToggle.addEventListener("click", () => {
    document.body.classList.remove(...themes);
    themeIndex = (themeIndex + 1) % themes.length;
    document.body.classList.add(themes[themeIndex]);
});

searchBar.addEventListener("input", async () => {
    const query = searchBar.value.trim();
    if (query.length > 2) {
        animeList.innerHTML = "Loading...";
        const response = await fetch("https://graphql.anilist.co", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                query: `
                    query ($search: String) {
                        Page(perPage: 10) {
                            media(search: $search, type: ANIME) {
                                id
                                title { romaji }
                                coverImage { medium }
                                siteUrl
                            }
                        }
                    }
                `,
                variables: { search: query }
            })
        });

        const data = await response.json();
        animeList.innerHTML = "";
        data.data.Page.media.forEach(anime => {
            const animeCard = document.createElement("div");
            animeCard.classList.add("anime-card");
            animeCard.innerHTML = `
                <img src="${anime.coverImage.medium}" alt="${anime.title.romaji}">
                <h3>${anime.title.romaji}</h3>
                <a href="${anime.siteUrl}" target="_blank">View Details</a>
            `;
            animeList.appendChild(animeCard);
        });
    }
});
