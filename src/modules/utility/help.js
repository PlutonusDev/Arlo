module.exports = {
	name: "help",
	aliases: [ "cmds", "commands" ],
	usage: "help [command]",
	description: "View commands or help for a specific command.",
	disabled: false,

	guildOnly: false,
	botPerms: [ "SEND_MESSAGES", "EMBED_LINKS" ],
	userPerms: [  ],

	execute: (arlo, msg, args) => {
		if (!args[0]) {
			const longest = arlo.commands.map(c=>c.module.name).reduce((long, str) => Math.max(long, str.length), 0);
			let out = `Use \`${arlo.config.prefix}help <Command>\` for more information on a specific command.\n\n`;
			const { commands, categories } = arlo;
			for (x of categories) {
				out += `**${x.charAt(0).toUpperCase() + x.substr(1)} Commands**\n\`\`\`asciidoc\n${commands.filter(command => command.category === x).map(command => `${command.module.name}${" ".repeat(longest - command.module.name.length)} :: ${command.module.description || "No description."}`).join('\n')}\`\`\`\n\n`
			}
			return msg.reply({
				embeds:[{
					title: "Commands List",
					color: 41215,
					description: out
				}],
				components: [{
					type: 1,
					components: [{
						type: 2,
						style: 5,
						label: "View All Commands",
						url: "https://arlo.gg/commands"
					}]
				}]
			});
		} else {
			let cmd = args[0];
			if (arlo.commands.has(cmd) || arlo.commands.find((c) => c.module.aliases && c.module.aliases.includes(cmd))) {
				command = arlo.commands.get(cmd) || azure.commands.find(c => c.module.aliases && c.module.aliases.includes(cmd));
				const longest = 8;
				return msg.reply({embeds:[{
					title: "Command Help",
					color: 41215,
					description: `\`\`\`asciidoc\nCommand${" ".repeat(longest-7)} :: ${command.module.name}\nCategory${" ".repeat(longest-8)} :: ${command.category}\nCooldown${" ".repeat(longest-8)} :: ${command.module.cooldown ? `${command.module.cooldown} Seconds` : "3 Seconds"}\n\n[ Usage ]\n${command.module.usage ? arlo.config.prefix+command.module.usage : "Not Specified"}\n\n[ Description ]\n${command.module.description ? command.module.description : "Not Specified"}\`\`\``
				}]});
			} else {
				return msg.reply({embeds:[{
					title: "Invalid Command",
					color: 41215,
					description: `\`${command}\` is not a valid command.`
				}]});
			}
		}
	}
}
