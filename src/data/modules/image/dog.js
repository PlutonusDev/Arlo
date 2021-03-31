const { get } = require("axios");

module.exports = {
    name: "dog",
    aliases: [ "woof", "doggo" ],
    usage: "dog",
    description: "Find a random doggo.",
    disabled: false,

    guildOnly: false,
    botPerms: [ "SEND_MESSAGES", "EMBED_LINKS" ],
    userPerms: [  ],

    execute: (azure, msg, args) => {
        get("https://nekos.life/api/v2/img/woof").then(resp => {
            return azure.replyTo(msg, {embed:{
                author: {
                    name: `Dog for ${msg.member ? msg.member.displayName : msg.author.username}`,
                    icon_url: msg.author.avatarURL()
                },
                image: {
                    url: resp.data.url
                }
            }});
        });
    }
}