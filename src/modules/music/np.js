const { splitBar } = require("string-progressbar");

module.exports = {
	name: "np",
	aliases: ["playing"],
	description: "View the music queue.",
	guildOnly: true,
	permissions: ["EMBED_LINKS"],

	execute: (arlo, msg, args) => {
		const queue = arlo.musicQueue.get(msg.guild.id);
		if(!queue) return msg.reply("There's nothing currently playing.");

		msg.reply({embeds: [{
			description: `__**Now Playing**__\n[${queue.queue[0].title}](${queue.queue[0].url})\n\n${formatTime(queue.resource.playbackDuration/1000)} / ${formatTime(queue.queue[0].duration/1000)}\n${splitBar(queue.queue[0].duration/1000, queue.resource.playbackDuration/1000, 20)[0]}`
		}]});
	}
}

formatTime = time => {
	const secs = parseInt(time, 10);
	let minutes = Math.floor((secs - (Math.floor(secs / 3600) * 3600)) / 60);
	let seconds = secs - (Math.floor(secs / 3600) * 3600) - (minutes * 60);
	if(seconds < 10) seconds = `0${seconds}`;
	return `${minutes}:${seconds}`;
}
