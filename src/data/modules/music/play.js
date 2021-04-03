const path = require("path");
const { VoiceControl } = require(path.join(__dirname, "..", "..", "..", "util"));
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
            const results = await youtube.searchVideos(args.join(" "), 1, { part: "snippet" }).catch(e=> {
                return azure.replyTo(msg, {embed:{
                    author: {
                        name: "Unavailable",
                        icon_url: ""
                    },
                    description: `I can't search YouTube at the moment:\n\`\`\`json\n${JSON.stringify(e)}\n\`\`\``
                }});
            });
            const songInfo = await ytdl.getInfo(results[0].url);
            song = {
                title: songInfo.videoDetails.title.replace("\\", "\\\\").replace("*", "\\*").replace("_", "\\_").replace("~", "\\~"),
                url: songInfo.videoDetails.video_url
            };
        }

        if (queue) return queue.addSong(song);
        await azure.musicQueue.set(msg.guild.id, new VoiceControl({
            textChannel: msg.channel,
            voiceChannel: channel,
            azure: azure
        }).addSong(song));
    }
}