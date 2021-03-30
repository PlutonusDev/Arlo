module.exports = {
    name: "help",
    aliases: [ "cmds", "commands" ],
    usage: "help [command]",
    description: "View commands or help for a specific command.",
    disabled: false,

    guildOnly: false,
    botPerms: [ "SEND_MESSAGES", "EMBED_LINKS" ],
    userPerms: [  ],

    execute: (azure, msg, args) => {
        if (!args[0]) {
			const longest = azure.commands.map(c=>c.file.name).reduce((long, str) => Math.max(long, str.length), 0);
			let out = `Use \`${azure.config.prefix}help <Command>\` for more information on a specific command.\n\n`;
			const { commands, categories } = azure;
			for (x of categories) {
				out += `**${x.charAt(0).toUpperCase() + x.substr(1)} Commands**\n\`\`\`asciidoc\n${commands.filter(command => command.category === x).map(command => `${command.file.name}${" ".repeat(longest - command.file.name.length)} :: ${command.file.description}`).join('\n')}\`\`\`\n\n`
			}
            out += `For a more detailed list of commands, [click / tap here](https://azure.plutonus.co/commands).`;
			return msg.channel.send(msg.author, {embed:{
				author: {
                    name: "Commands List",
                    icon_url: ""
                },
				description: out
            }});
		} else {
            let command = args[0];
			if (azure.commands.has(command) || azure.commands.find((c) => c.file.aliases.includes(command))) {
				command = azure.commands.get(command);
				const longest = 8;
				return msg.channel.send(msg.author, {embed:{
					author: {
                        name: "Command Help",
                        icon_url: ""
                    },
					description: `\`\`\`asciidoc\nCommand${" ".repeat(longest-7)} :: ${command.file.name}\nCategory${" ".repeat(longest-8)} :: ${command.category}\nCooldown${" ".repeat(longest-8)} :: ${command.file.cooldown ? `${command.file.cooldown} Seconds` : "3 Seconds"}\n\n[ Usage ]\n${command.file.usage ? azure.config.prefix+command.file.usage.join("\n"+azure.config.prefix) : "Not Specified"}\n\n[ Description ]\n${command.file.description}\`\`\``
                }});
			} else {
				return msg.channel.send(msg.author, {embed:{
					author: {
                        name: "Invalid Command",
                        icon_url: ""
                    },
					description: `\`${command}\` is not a valid command.`
                }});
			}
        }
    }
}