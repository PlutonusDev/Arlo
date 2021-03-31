module.exports = {
    name: "dashboard",
    aliases: [ "dash", "config" ],
    usage: "dashboard",
    description: "Access the online dashboard.",
    disabled: false,

    guildOnly: false,
    botPerms: [ "SEND_MESSAGES", "EMBED_LINKS" ],
    userPerms: [  ],

    execute: (azure, msg, args) => {
        if(msg.channel.type === "dm") {
            azure.replyTo(msg, {embed:{
                author: {
                    name: `Azure Dashboard`,
                    icon_url: `https://cdn.discordapp.com/avatars/${msg.author.id}/${msg.author.avatar}.${msg.author.avatar.startsWith("a_") ? "gif" : "webp"}`
                },
                description: `[To access Azure's online dashboard, just click here!](https://azure.plutonus.co/dashboard/)`
            }});
        } else {
            azure.replyTo(msg, {embed:{
                author: {
                    name: `Azure Dashboard | ${msg.guild.name}`,
                    icon_url: `https://cdn.discordapp.com/icons/${msg.guild.id}/${msg.guild.icon}.${msg.guild.icon.startsWith("a_") ? "gif" : "webp"}`
                },
                description: `[To access Azure's online dashboard for this server, just click here!](https://azure.plutonus.co/dashboard/${msg.guild.id})`
            }});
        }
    }
}