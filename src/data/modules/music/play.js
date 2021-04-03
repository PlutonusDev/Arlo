const path = require("path");
const { createDiscordJSAdapter } = require(path.join(__dirname, "..", "..", "util", "adapter"));
const { joinVoiceChannel, createAudioResource, createAudioPlayer, AudioPlayerStatus } = require("@discordjs/voice");
const ytdl = require("ytdl-core-discord");
const YouTubeAPI = require("simple-youtube-api");

module.exports = {
    name: "play",
    aliases: ["tune"],
    usage: "play <[Query] OR [YT URL]>",
    description: "Play a song from YouTube.",
    disabled: false,

    guildOnly: true,
    botPerms: ["SEND_MESSAGES", "EMBED_LINKS", "CONNECT", "SPEAK"],
    userPerms: [],

    execute: async (azure, msg, args) => {
        const { channel } = msg.member.voice;
        if (!channel) return azure.replyTo(msg, {
            embed: {
                author: {
                    name: "Not Possible",
                    icon_url: ""
                },
                description: `You're not in a voice channel, ${msg.member.displayName}!`
            }
        });

        const response = await azure.replyTo(msg, {embed:{
            author: {
                name: "Please Wait",
                icon_url: ""
            },
            description: `I'm locating some information, ${msg.member.displayName}.`
        }});

        const videoPattern = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
        const playlistPattern = /^.*(list=)([^#\&\?]*).*/gi;

        const url = args[0];
        const urlValid = videoPattern.test(url);

        const queue = azure.musicQueue.get(msg.guild.id);
        let song;
        if(urlValid) {
            const songInfo = await ytdl.getInfo(args[0].replace(/<(.+)>/g, '$1'));
            song = {
                title: songInfo.videoDetails.title.replace("\\", "\\\\").replace("*", "\\*").replace("_", "\\_").replace("~", "\\~"),
                url: songInfo.videoDetails.video_url
            };
        } else {
            const youtube = new YouTubeAPI(azure.config.api.youtube);
            const results = await youtube.searchVideos(args.join(" "), 1, { part: "snippet" });
            const songInfo = await ytdl.getInfo(results[0].url);
            song = {
                title: songInfo.videoDetails.title.replace("\\", "\\\\").replace("*", "\\*").replace("_", "\\_").replace("~", "\\~"),
                url: songInfo.videoDetails.video_url
            };
        }

        if (queue) {
            queue.songs.push(song);
            return response.edit({
                embed: {
                    author: {
                        name: "Song Added to Queue",
                        icon_url: ""
                    },
                    description: `I've added \`${song.title}\` to the queue.`
                }
            });
        }

        azure.musicQueue.set(msg.guild.id, {
            textChannel: msg.channel,
            voiceChannel: channel,
            connection: null,
            songs: [song],
            volume: 2,
            playing: true
        });

        const play = async () => {
            const queue = azure.musicQueue.get(msg.guild.id);
            if(!queue) return; // ??????
            if (!queue.songs[0]) {
                if(queue.connection) queue.connection.destroy();
                azure.musicQueue.delete(msg.guild.id);
                return msg.channel.send({embed:{
                    author: {
                        name: "Queue Empty",
                        icon_url: ""
                    },
                    description: `There's no more songs left in the queue.\nAdd more with \`${azure.config.prefix}play\``
                }});
            }

            const resource = createAudioResource(await ytdl(queue.songs[0].url));
            await queue.player.play(resource);
            queue.player.on(AudioPlayerStatus.Playing, () => {
                queue.listener = queue.player.once("stateChange", (oldState, newState) => {
                    if(oldState.status === AudioPlayerStatus.Playing && newState.status === AudioPlayerStatus.Idle) {
                        queue.songs.shift();
                        queue.listener = null;
                        play();
                    }
                });
            });
            return queue.textChannel.send({
                embed: {
                    author: {
                        name: "Now Playing",
                        icon_url: ""
                    },
                    description: `\`${queue.songs[0].title}\` is now playing.`
                }
            });
        }

        try {
			let q = azure.musicQueue.get(msg.guild.id);
            q.connection = await joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: createDiscordJSAdapter(channel)
            });
            q.player = createAudioPlayer();
            q.player.subscribe(q.connection);
			play();
            response.delete();
		} catch (error) {
            let q = azure.musicQueue.get(msg.guild.id);
			await q.connection.destroy();
            azure.musicQueue.delete(msg.guild.id);
			return response.edit({embed:{
                author: {
                    name: "Unexpected Error",
                    icon_url: ""
                },
                description: `Something went wrong while trying to play that song!\n\n\`\`\`${error}\n\`\`\``
            }});
		}
    }
}