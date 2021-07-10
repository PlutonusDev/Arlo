module.exports = {
	name: "kick",
	staffOnly: true,
	guildOnly: true,
	permissions: ["KICK_MEMBERS", "EMBED_LINKS"],

	execute: async (arlo, msg, args) => {
		const user = msg.mentions.members.filter(member => member.id !== arlo.user.id).first() || await msg.guild.members.fetch(args[0]).catch(()=>{});
		if(!user || !args[0]) return msg.reply("Invalid or no member supplied.");
		if(!user.kickable) return msg.reply(`I cannot kick \`${user.user.tag}\`.`);

		args.shift();
		const reason = args.join(" ") || "No reason specified";
		msg.reply({
			embeds: [{
				description: `You are about to kick ${user} (${user.user.tag}) for:\n\`\`\`\n${reason}\n\`\`\``,
				color: 16543586
			}],
			components: [
				{
					type: 1,
					components: [
						{
							type: 2,
							label: "Confirm Kick",
							style: 4,
							custom_id: "confirm_kick",
						}, {
							type: 2,
							label: "Cancel",
							style: 2,
							custom_id: "cancel_kick"
						}
					]
				}
			]
		}).then(m => {
			m.awaitMessageComponent({filter: interaction => interaction.user.id === msg.author.id, time: 15000}).then(interaction => {
				if(interaction.customId === "confirm_kick") {
					user.kick(reason).then(() => {
						m.edit({
							embeds: [{
								description: `${user.user.tag} (${user.user.id}) has been kicked for:\n\`\`\`\n${reason}\n\`\`\``,
								color: 16543586
							}],
							components: [ // TODO: There must be a better way of doing this
								{
									type: 1,
									components: [
										{
											type: 2,
											label: "Confirm Kick",
											style: 4,
											custom_id: "confirm_kick",
											disabled: true
										}, {
											type: 2,
											label: "Cancel",
											style: 2,
											custom_id: "cancel_kick",
											disabled: true
										}
									]
								}
							]
						});
					});
				} else {
					m.edit({
						embeds: [{
							description: `${user} was not kicked.`,
							color: 569957
						}],
						components: [
							{
								type: 1,
								components: [
									{
										type: 2,
										label: "Confirm Kick",
										style: 4,
										custom_id: "confirm_kick",
										disabled: true
									}, {
										type: 2,
										label: "Cancel",
										style: 2,
										custom_id: "cancel_kick",
										disabled: true
									}
								]
							}
						]
					});
				}
			});
		});
	}
}
