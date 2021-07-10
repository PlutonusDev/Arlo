module.exports = {
	name: "unmute",
	staffOnly: true,
	guildOnly: true,
	permissions: ["MANAGE_CHANNELS", "EMBED_LINKS"],

	execute: async (arlo, msg, args) => {
		const user = msg.mentions.members.filter(member => member.id !== arlo.user.id).first() || await msg.guild.members.fetch(args[0]);
		if(!user) return msg.reply("Invalid or no member supplied.");

		msg.guild.channels.cache.forEach(channel => {
			channel.permissionOverwrites.delete(user.id);
		});
		msg.channel.send({embeds:[{
			description: `${user} has been unmuted by ${msg.member}.`
		}]});
	}
}
