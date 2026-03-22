console.log("Initializing...");
const servercount = document.getElementById('servercount');
servercount.innerHTML = `<div class="spinner"></div>`;

fetch('https://japi.rest/discord/v1/application/757780137449226272')
    .then(res => {
        if (!res.ok) {
            throw new Error("Failed");
        }
        return res.json();
    })
    .then(data => {
        const count = data.data.bot.approximate_guild_count;
        console.log("Server count:", count);
        servercount.innerHTML = `Currently in <strong><a onclick='window.location.href="/i/invite"' style="cursor: pointer">${count}</a></strong> servers`;
        console.log("Done");

    })
    .catch(err => {
        console.error("Currently in 40+ servers", err);
        servercount.innerHTML = "Currently in 40+ servers"; // whatever, i tried, this works
    });

function aboutAv() {
    msg(`<h2>What is ex3's avatar??</h2>ex3's avatar was created in 2023 by DALL-E 2. Before you go, "FUCKING AI SLOP!!!!", this image was created when AI generated media was pretty much
        just shits and giggles; not polluting the internet. I have considered changing the avatar, but I am indefinitely keeping it to honor the days when AI generated photos were
        unpredictable, funny, and basically, harmless.<br><img src="https://cdn.exerinity.com/images/ex3/home.png" style="width: 100px; height: 100px; margin-top: 10px;"><br><br>For complaints, click here: <a href="https://syndication.exerinity.com">https://syndication.exerinity.com</a>`);
}