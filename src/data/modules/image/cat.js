const { get } = require("axios");

module.exports = {
    name: "cat",
    aliases: [ "meow", "kitty" ],
    usage: "cat",
    description: "Find a random kitty.",
    disabled: false,

    guildOnly: false,
    botPerms: [ "SEND_MESSAGES", "EMBED_LINKS" ],
    userPerms: [  ],

    execute: (azure, msg, args) => {
        get("https://nekos.life/api/v2/img/meow").then(resp => {
            return azure.replyTo(msg, {embed:{
                author: {
                    name: `Cat for ${msg.member ? msg.member.displayName : msg.author.username}`,
                    icon_url: msg.author.avatarURL()
                },
                image: {
                    url: resp.data.url
                }
            }});
        });
    }
}