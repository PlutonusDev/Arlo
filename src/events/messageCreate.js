module.exports = (arlo, msg) => {
	if(msg.partial) msg.fetch();
	if(!msg.content.toLowerCase().startsWith(arlo.config.prefix) && !msg.content.match(new RegExp(`^<@!?${arlo.user.id}> `))) return;
	if(msg.author.bot) return;

	const command = msg.content.startsWith(arlo.config.prefix)
		? msg.content.slice(arlo.config.prefix.length).split(/ +/).shift().toLowerCase()
		: msg.content.split(/ +/)[1];

	if(!command) return;

	if(arlo.commands.has(command) || arlo.commands.find(c => c.module.aliases && c.module.aliases.includes(command))) {
		const args = msg.content.split(/ +/);
		args.shift();
		if(msg.content.match(new RegExp(`^<@!?${arlo.user.id}> `))) args.shift();
		const cmd = arlo.commands.get(command) || arlo.commands.find(c => c.module.aliases && c.module.aliases.includes(command));

		if(cmd.module.disabled) return;

		if(msg.channel.type === "dm" && cmd.module.guildOnly) return msg.reply("this command can only be used in a server.");

		if(cmd.module.staffOnly && !msg.member.permissions.has(["KICK_MEMBERS", "BAN_MEMBERS", "MANAGE_GUILD"], true)) {
			return msg.reply("You don't have permission to use this command!").then(m => m.delete({timeout:10000}));
		}

		if(msg.channel.type !== "dm") {
			if(cmd.module.permissions && !cmd.module.permissions.every(perm => msg.channel.permissionsFor(arlo.user).has(perm))) {
				return msg.reply(`I'm missing the following permissions:\n\n- ${cmd.module.permissions.filter(perm => !msg.channel.permissionsFor(arlo.user).has(perm)).join("\n- ")}`).then(m => m.delete({timeout:10000}));
			}
		}

		try {
			cmd.module.execute(arlo, msg, args);
		} catch(e) {
			msg.reply("something went wrong!");
			console.error(e);
		}
	}
}
