module.exports = {
	name: "skip",
	description: "Skip the current song.",
	usage: "skip",
	guildOnly: true,
	permissions: ["EMBED_LINKS"],

	execute: (arlo, msg, args) => {
		const queue = arlo.musicQueue.get(msg.guild.id);
		if(!queue) return msg.reply("There's nothing currently playing.");
		queue.skip(msg);
	}
}
