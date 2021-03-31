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
        azure.replyTo(msg, `Hello, ${msg.author.username}!`);
    }
}