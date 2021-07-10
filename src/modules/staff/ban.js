module.exports = {
	name: "ban",
	staffOnly: true,
	guildOnly: true,
	permissions: ["BAN_MEMBERS", "EMBED_LINKS"],

	execute: async (arlo, msg, args) => {
		const user = msg.mentions.members.filter(member => member.id !== arlo.user.id).first() || await msg.guild.members.fetch(args[0]);
		if(!user || !args[0]) return msg.reply("Invalid or no member supplied.");
		if(!user.bannable) return msg.reply(`I cannot ban \`${user.user.tag}\`.`);

		args.shift();
		const reason = args.join(" ") || "No reason specified";
		msg.reply({
			embeds: [{
				description: `You are about to ban ${user} (${user.user.tag}) for:\n\`\`\`\n${reason}\n\`\`\``,
				color: 16543586
			}],
			components: [
				{
					type: 1,
					components: [
						{
							type: 2,
							label: "Confirm Ban",
							style: 4,
							custom_id: "confirm_ban",
						}, {
							type: 2,
							label: "Cancel",
							style: 2,
							custom_id: "cancel_ban"
						}
					]
				}
			]
		}).then(m => {
			m.awaitMessageComponent({filter: interaction => interaction.user.id === msg.author.id, time: 15000}).then(interaction => {
				if(interaction.customId === "confirm_ban") {
					user.ban(reason).then(() => {
						m.edit({
							embeds: [{
								description: `${user.user.tag} (${user.user.id}) has been banned for:\n\`\`\`\n${reason}\n\`\`\``,
								color: 16543586
							}],
							components: [ // TODO: There must be a better way of doing this
								{
									type: 1,
									components: [
										{
											type: 2,
											label: "Confirm Ban",
											style: 4,
											custom_id: "confirm_ban",
											disabled: true
										}, {
											type: 2,
											label: "Cancel",
											style: 2,
											custom_id: "cancel_ban",
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
							description: `${user} was not banned.`,
							color: 569957
						}],
						components: [
							{
								type: 1,
								components: [
									{
										type: 2,
										label: "Confirm Ban",
										style: 4,
										custom_id: "confirm_ban",
										disabled: true
									}, {
										type: 2,
										label: "Cancel",
										style: 2,
										custom_id: "cancel_ban",
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
