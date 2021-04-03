module.exports = {
    name: "queue",
    aliases: ["lineup"],
    usage: "queue",
    description: "View the current music queue.",
    disabled: false,

    guildOnly: true,
    botPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    userPerms: [],

    execute: async (azure, msg, args) => {
        const queue = azure.musicQueue.get(msg.guild.id);
        if (!queue) return azure.replyTo(msg, {
            embed: {
                author: {
                    name: "Music Queue",
                    icon_url: ""
                },
                description: `There's currently nothing playing, ${msg.member.displayName}`
            }
        });

        // TODO: Expand functionality
        azure.replyTo(msg, generateQueueEmbed(msg, queue.queue)[0]);
    }
}

function generateQueueEmbed(message, queue) {
    let embeds = [];
    let k = 10;

    for (let i = 0; i < queue.length; i += 10) {
        const current = queue.slice(i, k);
        let j = i;
        k += 10;

        const info = current.map((track) => `**${++j}** - [${track.title}](${track.url})`).join("\n");

        const embed = {embed:{
            author: {
                name: `Music Queue`,
                icon_url: ""
            },
            description: info
        }}
        embeds.push(embed);
    }

    return embeds;
}