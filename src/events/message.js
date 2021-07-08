module.exports = (arlo, msg) => {
	if(msg.partial) msg.fetch();
	if(!msg.content.toLowerCase().startsWith(arlo.config.prefix) && !msg.content.match(new RegExp(`^<@!?${arlo.user.id}> `))) return;
	if(msg.author.bot) return;

	const command = msg.content.startsWith(arlo.config.prefix)
		? msg.content.slice(arlo.config.prefix.length).split(/ +/).shift().toLowerCase()
		: msg.content.split(/ +/)[1];

	if(!command) return;

	if(arlo.commands.has(command) || arlo.commands.find(c => c.file.aliases && c.file.aliases.includes(command))) {
		const args = msg.content.slice(arlo.config.prefix.length).split(/ +/);
		args.shift();
		if(msg.content.match(new RegExp(`^<@!?${arlo.user.id}> `))) args.shift();
		const cmd = arlo.commands.get(command) || arlo.commands.find(c => c.file.aliases && c.file.aliases.includes(command));

		try {
			cmd.module.execute(arlo, msg, args);
		} catch(e) {
			msg.reply("something went wrong!");
			console.error(e);
		}
	} else return;
}
