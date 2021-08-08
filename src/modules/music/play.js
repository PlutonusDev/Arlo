const path = require("path");
const VoiceControl = require(path.join(__dirname, "../../util/voiceControl"));
const ytdl = require("ytdl-core-discord");
const YouTubeAPI = require("simple-youtube-api");

module.exports = {
	name: "play",
	description: "Play some music from YouTube.",
	guildOnly: true,

	permissions: ["EMBED_LINKS", "CONNECT", "SPEAK"],
	execute: async (arlo, msg, args) => {
		const { channel } = msg.member.voice;
		if(!channel) return msg.reply("You aren't in a voice channel.");

		const urlPattern = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi;

		const queue = arlo.musicQueue.get(msg.guild.id);
		let song;
		if(urlPattern.test(args[0])) {
			const songMeta = await youtube.getVideo(args[0].replace(/<(.+)>/g, "$1"));
			if(songMeta.durationSeconds > 5*60) return msg.reply({embeds:[{
				description: "Sorry, that song is over 5 minutes long. Try something else."
			}]});
			const songInfo = await ytdl.getInfo(args[0].replace(/<(.+)>/g, "$1"));
			song = {
				title: songInfo.videoDetails.title.replace("\\", "\\\\").replace("*", "\\*").replace("_", "\\_").replace("~", "\\~"),
				url: songInfo.videoDetails.video_url,
				duration: songMeta.durationSeconds * 1000
			}
		} else {
			const youtube = new YouTubeAPI(arlo.config.tokens.youtube);
			const results = await youtube.searchVideos(args.join(" "), 1, { part: "snippet" }).catch(e => {
				console.error(e);
				return msg.reply("I can't search YouTube right now, sorry.\n\nTry using a URL instead of search terms.");
			});
			const songMeta = await youtube.getVideo(results[0].url);
			if(songMeta.durationSeconds > 5*60) return msg.reply({embeds:[{
				description: "Sorry, that song is over 5 minutes long. Try something else."
			}]});
			const songInfo = await ytdl.getInfo(results[0].url).catch(()=>{});
			if(!songInfo || !songInfo.videoDetails) return msg.reply({embeds:[{
				description: "I can't find any music with those search terms. Change them and try again."
			}]});
			song = {
				title: songInfo.videoDetails.title.replace("\\", "\\\\").replace("*", "\\*").replace("_", "\\_").replace("~", "\\~"),
				url: songInfo.videoDetails.video_url,
				duration: songMeta.durationSeconds * 1000
			}
		}

		if(queue) return queue.addSong(song);
		await arlo.musicQueue.set(msg.guild.id, new VoiceControl({
			textChannel: msg.channel,
			voiceChannel: channel,
			arlo: arlo
		}).addSong(song));
	}
}
