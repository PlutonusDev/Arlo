module.exports = {
    name: "ping",
    aliases: [ "hello" ],
    usage: "ping",
    description: "The first command anyone ever writes.",
    disabled: true,

    guildOnly: false,
    botPerms: [ "SEND_MESSAGES" ],
    userPerms: [  ],

    execute: (azure, msg, args) => {
        msg.channel.send(`Hello, ${msg.author.username}!`);
    }
}