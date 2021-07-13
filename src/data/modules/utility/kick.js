const path = require("path");

module.exports = {
    name: "kick",
    aliases: [  ],
    usage: "kick <@username OR id>",
    description: "Kick a member from the server.",
    disabled: false,

    guildOnly: true,
    botPerms: [ "SEND_MESSAGES", "EMBED_LINKS" ],
    userPerms: [  ],

    execute: (azure, msg, args) => {
	let user = msg.mentions.members.first() || msg.guild.members.fetch(args[0]);
	if(!user) return azure.replyTo(msg, {embed:{
		title: "Something went wrong.",
		description: "You must supply a user to kick."
	}});

	args.shift();

	azure.replyTo(msg, {embed:{
		title: "Are you sure?",
		description: `You are about to kick \`${user.displayName}\` for:\n> ${args.join(" ") ||  "No reason specified."}`
	}, components: [{
		type: 1,
		components: [{
			type: 2,
			style: 4,
			label: "Confirm Kick",
			disabled: false,
			custom_id: "kick"
		}, {
			type: 2,
			style: 2,
			label: "Cancel",
			disabled: false,
			custom_id: "cancel"
		}]
	}]});
    }
}
