module.exports = {
	name: "purge",
	description: "Purge messages, messages from a user, or the entire channel.",
	staffOnly: true,
	guildOnly: true,
	permissions: ["EMBED_LINKS", "MANAGE_MESSAGES", "MANAGE_CHANNELS"],

	execute: async (arlo, msg, args) => {
		if(!args[0] || args[0] === "all") {
			msg.reply({embeds:[{
				title: "WARNING!",
				description: "This will clear the entire channel, including pins, and every message ever sent here.\n\nAre you sure?",
				color: 16543586
			}],
			components: [
				{
					type: 1,
					components: [
						{
							type: 2,
							label: "Purge the Channel",
							style: 4,
							custom_id: "confirm_purge"
						}, {
							type: 2,
							label: "Cancel",
							style: 2,
							custom_id: "cancel_purge"
						}
					]
				}
			]}).then(m => {
				m.awaitMessageComponent({filter: interaction => interaction.user.id === msg.author.id, time: 150000}).then(async interaction => {
					if(interaction.customId === "confirm_purge") {
						const newChannel = await msg.channel.clone();
						await newChannel.setPosition(msg.channel.position);
						await msg.channel.delete();
						return newChannel.send({embeds:[{
							description: "Channel purged! :tada:",
							color: 569957
						}]});
					} else {
						m.edit({embeds:[{
							description: "Channel purge was cancelled.",
							color: 569957
						}],
						components: [{
							type: 1,
							components: [{
								type: 2,
								label: "Purge the Channel",
								style: 4,
								custom_id: "confirm_purge",
								disabled: true
							}, {
								type: 2,
								label: "Cancel",
								style: 2,
								custom_id: "cancel_purge",
								disabled: true
							}]
						}]});
					}
				});
			});
		} else {
			const user = msg.mentions.members.filter(member => member.id !== arlo.user.id).first() || await msg.guild.members.fetch(args[0]).catch(()=>{});
			if(user) {
				let toBePurged = await msg.channel.messages.fetch({limit:100}, true, true);
				msg.channel.bulkDelete(toBePurged.filter(m => m.author && m.author.id === user.id)).then(deleted => {
					msg.reply({embeds:[{
						description: `Deleted ${deleted.size} messages sent by ${user.displayName}.`,
						color: 569957
					}]});
				});
			} else {
				if(isNaN(args[0]) || (!parseInt(args[0]) < 1 && !parseInt(args[0]) > 100)) return msg.reply("I don't know what you want to delete. Either mention a user or enter an amount.");
				let toBePurged = await msg.channel.messages.fetch({limit:parseInt(args[0]), before:msg.id}, true, true);
				msg.channel.bulkDelete(toBePurged).then(deleted => {
					msg.reply({embeds:[{
						description: `Deleted ${deleted.size} messages in ${msg.channel}.`,
						color: 569957
					}]});
				});
			}
		}
	}
}
