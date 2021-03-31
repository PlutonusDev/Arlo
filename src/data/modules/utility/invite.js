module.exports = {
    name: "invite",
    aliases: [ "support" ],
    usage: "invite",
    description: "Get an invite to the support server.",
    disabled: false,

    guildOnly: false,
    botPerms: [ "SEND_MESSAGES" ],
    userPerms: [  ],

    execute: (azure, msg, args) => {
        msg.author.send(`Here you are, ${msg.author.username}.\nhttps://discord.gg/FE5AvpBARk`).then(() => {
            if(msg.channel.type !== "dm") azure.replyTo(msg, `I sent an invite to your dms, ${msg.member.displayName}.`);
        }).catch(() => {
            azure.replyTo(msg, `Here you are, ${msg.member.displayName}.\nhttps://discord.gg/FE5AvpBARk\n\n(I couldn't DM you, so I posted it here.)`)
        });
    }
}