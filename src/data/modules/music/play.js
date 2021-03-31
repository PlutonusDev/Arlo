const path = require("path");
const { createDiscordJSAdapter } = require(path.join(__dirname, "..", "..", "util", "adapter"));
const { joinVoiceChannel, createAudioResource, createAudioPlayer, AudioPlayerStatus } = require("@discordjs/voice");
const ytdl = require("ytdl-core-discord");

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

        const queue = azure.musicQueue.get(msg.guild.id);
        const songInfo = await ytdl.getInfo(args[0].replace(/<(.+)>/g, '$1'));
        const song = {
            id: songInfo.videoDetails.video_id,
            title: songInfo.videoDetails.title.replace("\\", "\\\\").replace("*", "\\*").replace("_", "\\_").replace("~", "\\~"),
            url: songInfo.videoDetails.video_url
        };

        if (queue) {
            queue.songs.push(song);
            return azure.replyTo(msg, {
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

        const play = async song => {
            const queue = azure.musicQueue.get(msg.guild.id);
            if (!song) {
                queue.voiceChannel.leave();
                azure.musicQueue.delete(msg.guild.id);
                return msg.channel.send({embed:{
                    author: {
                        name: "Queue Empty",
                        icon_url: ""
                    },
                    description: `There's no more songs left in the queue.\nAdd more with \`${azure.config.prefix}play\``
                }});
            }

            const resource = createAudioResource(await ytdl(song.url));
            await queue.player.play(resource);
            queue.textChannel.send({
                embed: {
                    author: {
                        name: "Now Playing",
                        icon_url: ""
                    },
                    description: `\`${song.title}\` is now playing.`
                }
            });
        }

        try {
			const connection = await joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: createDiscordJSAdapter(channel)
            });
			let q = azure.musicQueue.get(msg.guild.id);
            q.connection = connection;
            q.player = createAudioPlayer();
            q.player.subscribe(q.connection);
            q.player.once("stateChange", async (oldState, newState) => {
                if(newState.status === AudioPlayerStatus.Idle) {
                    q.songs.shift();
                    await play(q.songs[0]);
                }
            });
			play(q.songs[0]);
		} catch (error) {
			azure.musicQueue.delete(msg.guild.id);
			await channel.leave();
			return msg.channel.send({embed:{
                author: {
                    name: "Unexpected Error",
                    icon_url: ""
                },
                description: `Something went wrong while trying to play that song!\n\n\`\`\`${error}\n\`\`\``
            }});
		}
    }
}