module.exports = {
	name: "unban",
	description: "Unban a member from your guild.",
	staffOnly: true,
	guildOnly: true,
	permissions: ["BAN_MEMBERS", "EMBED_LINKS"],

	execute: async (arlo, msg, args) => {
		let user = msg.mentions.users.filter(user => user.id !== arlo.user.id).first() || await arlo.users.fetch(args[0]).catch(()=>{});
		if(user)
			user = user.id;
		else
			user = args[0];

		const banned = await msg.guild.fetchBans();
		if(!banned.some(bannedMember => bannedMember.user.id === user.id)) return msg.reply({embeds:[{
			description: "I can't find that user in the ban list.",
			color: 16543586
		}]});

		msg.guild.members.unban(user).then(unbanned => {
			msg.reply({embeds:[{
				description: `${unbanned} has been unbanned.`,
				color: 3977061
			}]});
		}).catch(() => {
			msg.reply({embeds:[{
				description: `There was a problem unbanning that user. Try again.`,
				color: 16085868
			}]});
		});
	}
}
