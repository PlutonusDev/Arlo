const { AudioPlayerStatus } = require("@discordjs/voice");

module.exports = {
    name: "skip",
    aliases: [ "nextsong" ],
    usage: "skip",
    description: "Skip the currently playing song.",
    disabled: false,

    guildOnly: true,
    botPerms: ["SEND_MESSAGES", "EMBED_LINKS" ],
    userPerms: [],

    execute: async (azure, msg, args) => {
        const queue = azure.musicQueue.get(msg.guild.id);
        if(!queue) return azure.replyTo(msg, {embed:{
            author: {
                name: "Music Queue",
                icon_url: ""
            },
            description: `There's currently nothing playing, ${msg.member.displayName}.`
        }});

        const lastSong = queue.songs[0].title;
        if(queue.player.state.status !== AudioPlayerStatus.Playing) return azure.replyTo(msg, {embed:{
            author: {
                name: "Music Queue",
                icon_url: ""
            },
            description: `Please wait for the next song to start playing, ${msg.member.displayName}.`
        }});

        await azure.replyTo(msg, {embed:{
            author: {
                name: "Music Queue",
                icon_url: ""
            },
            description: `${msg.member.displayName} skipped \`${lastSong}\``
        }});
        queue.player.stop();
    }
}