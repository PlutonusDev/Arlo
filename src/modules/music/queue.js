function formatTime(seconds, forceHours = false) {
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor(seconds % 3600 /60);
	return `${forceHours || hours >= 1 ? `${hours}:` : ""}${hours >= 1 ? `0${minutes}`.slice(-2) : minutes}:${`0${Math.floor(seconds % 60)}`.slice(-2)}`
}

module.exports = {
	name: "queue",
	description: "View the current music queue.",
	guildOnly: true,
	permissions: ["EMBED_LINKS"],

	execute: (arlo, msg, args) => {
		const queue = arlo.musicQueue.get(msg.guild.id);
		if(!queue) return msg.reply("It doesn't look like anything is playing.");
		const totalLength = queue.queue.reduce((prev, song) => prev + (song.duration / 1000), 0);
		const currentSong = queue.queue[0];
		const currentTime = queue.resource.playbackDuration / 1000;
		msg.reply({embeds:[{
			description: `__**Now Playing**__\n${formatTime(currentTime)} / ${formatTime(currentSong.duration / 1000)} [${currentSong.title}](${currentSong.url})\n\n${queue.queue.map(song => `**[${formatTime(song.duration / 1000)}]** [${song.title}](${song.url})`).join("\n")}\n\n*Total queue time: ${formatTime(totalLength)}*`
		}]});
	}
}

