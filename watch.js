document.addEventListener("DOMContentLoaded", function () {
    let params = new URLSearchParams(window.location.search);
    let animeTitle = params.get("title");

    if (animeTitle) {
        document.getElementById("anime-title").textContent = `Watching: ${animeTitle}`;
        
        // Fetch from third-party API (Gogoanime, Zoro.to, AnimePahe)
        fetch(`https://api.consumet.org/anime/gogoanime/${encodeURIComponent(animeTitle)}`)
            .then(response => response.json())
            .then(data => {
                if (data && data.episodes.length > 0) {
                    let firstEpisode = data.episodes[0].url;
                    document.getElementById("video-frame").src = firstEpisode;
                    
                    let episodeList = document.getElementById("episode-list");
                    data.episodes.forEach(episode => {
                        let epButton = document.createElement("button");
                        epButton.textContent = `Episode ${episode.number}`;
                        epButton.onclick = () => document.getElementById("video-frame").src = episode.url;
                        episodeList.appendChild(epButton);
                    });
                } else {
                    document.getElementById("video-frame").src = "https://www.youtube.com/embed/dQw4w9WgXcQ"; // Placeholder
                }
            })
            .catch(error => console.log("Error loading episodes:", error));
    }
});
