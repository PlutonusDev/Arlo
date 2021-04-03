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
        
        queue.skip(msg);
    }
}