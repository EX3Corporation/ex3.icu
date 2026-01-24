console.log("Initializing...");
const servercount = document.getElementById('servercount');
servercount.innerHTML = `<div class="spinner"></div>`;
// intentionally wait 2000ms, for slower devices to ensure the stylesheet has loaded
new Promise(resolve => setTimeout(resolve, 2000)).then(() => {
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
    });})