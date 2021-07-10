const moment = require("moment");
const ms = require("ms");

module.exports = {
	name: "mute",
	staffOnly: true,
	guildOnly: true,
	permissions: ["KICK_MEMBERS", "EMBED_LINKS", "MANAGE_CHANNELS"],

	execute: async (arlo, msg, args) => {
		const user = msg.mentions.members.filter(member => member.id !== arlo.user.id).first() || await msg.guild.members.fetch(args[0]);
		if(!user) return msg.reply("Invalid or no member supplied.");
		if(!user.kickable) return msg.reply(`I cannot mute \`${user.user.tag}\`.`);

		args.shift();
		let time;
		if(args[0] && !isNaN(ms(args[0]))) {
			time = args[0];
			args.shift();
		}
		const reason = args.join(" ") || "No reason specified";

		msg.guild.channels.cache.forEach(channel => {
			channel.permissionOverwrites.edit(user.id, {
				SEND_MESSAGES: false,
				ADD_REACTIONS: false,
				CONNECT: false
			}).catch(()=>{});
		});

		if(time) setTimeout(() => {
			msg.guild.channels.cache.forEach(channel => {
				channel.permissionOverwrites.delete(user.id).catch(()=>{});
			});
			msg.channel.send({embeds:[{
				description: `${user} has been unmuted automatically.`
			}]});
		}, ms(time));

		msg.reply({
			embeds: [{
				description: `You have muted ${user} (${user.user.tag}) for:\n\`\`\`\n${reason}\n\`\`\`\n*${time ? "Mute expires in about "+moment(Date.now()+ms(time)).toNow(true) : "This is a permanent mute."}*`,
				color: 16543586
			}],
			components: [
				{
					type: 1,
					components: [
						{
							type: 2,
							label: "Unmute Early",
							style: 2,
							custom_id: "unmute_early",
						}
					]
				}
			]
		}).then(m => {
			m.awaitMessageComponent({filter: interaction => interaction.user.id === msg.author.id, time: time ? ms(time) : 600000}).then(interaction => {
				m.guild.channels.cache.forEach(channel => {
					channel.permissionOverwrites.delete(user.id).catch(()=>{});
				});
				m.channel.send({embeds:[{
					description: `${user} has been unmuted early by ${msg.member}.`
				}]});
			}).catch(()=>{});
		});
	}
}
