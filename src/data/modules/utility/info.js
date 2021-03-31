const path = require("path");

module.exports = {
    name: "info",
    aliases: [ "about" ],
    usage: "info",
    description: "View bot information.",
    disabled: false,

    guildOnly: false,
    botPerms: [ "SEND_MESSAGES", "EMBED_LINKS" ],
    userPerms: [  ],

    execute: (azure, msg, args) => {
        azure.replyTo(msg, {embed:{
            author: {
                name: `${azure.client.user.username} Stats`,
                icon_url: "https://azure.plutonus.co/assets/img/azurelogo.png"
            },
            fields: [{
                name: "Version",
                value: `V${require(path.join(__dirname, "..", "..", "..", "..", "package.json")).version}`,
                inline: true
            }, {
                name: "Discord.JS",
                value: `V${require("discord.js").version}`,
                inline: true
            }, {
                name: "Node.JS",
                value: `V${process.version.slice(1).split('.')[0]}`,
                inline: true
            }, {
                name: "Memory Usage",
                value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
                inline: true
            }, {
                name: "Members",
                value: `${azure.client.users.cache.filter(u => !u.bot).size} humans`,
                inline: true
            }, {
                name: "Guilds",
                value: `${azure.client.guilds.cache.size} servers`,
                inline: true
            }]
        }});
    }
}