module.exports = {
    name: "ping",
    aliases: [ "hello" ],
    description: "The first command anyone ever writes.",
    disabled: false,

    guildOnly: false,
    botPerms: [ "SEND_MESSAGES" ],
    userPerms: [  ],

    execute: (msg, args) => {
        msg.channel.send(`Hello, ${msg.author.username}!`);
    }
}