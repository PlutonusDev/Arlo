module.exports = {
    name: "song",
    aliases: [ "np", "playing" ],
    usage: "song",
    description: "View the current and next song.",
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
            description: `There's currently nothing playing, ${msg.member.displayName}`
        }});
        
        azure.replyTo(msg, {embed:{
            author: {
                name: "Music Queue",
                icon_url: ""
            },
            description: `Now Playing: \`${queue.songs[0].title}\`${queue.songs.length>1 ? `\n\nNext Up: \`${queue.songs[1].title}\`` : ""}`
        }})
    }
}