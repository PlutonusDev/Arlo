const { createDiscordJSAdapter } = require("./voiceAdapter");
const { joinVoiceChannel, createAudioResource, createAudioPlayer, AudioPlayerStatus } = require("@discordjs/voice");
const ytdl = require("ytdl-core-discord");

module.exports = class voiceController {
    constructor(data) {
        this.ref = data.azure;
        this.textChannel = data.textChannel;
        this.voiceChannel = data.voiceChannel;

        this.connection = joinVoiceChannel({
            channelId: this.voiceChannel.id,
            guildId: this.voiceChannel.guild.id,
            adapterCreator: createDiscordJSAdapter(this.voiceChannel)
        });

        this.audioPlayer = createAudioPlayer();
        this.audioPlayer.subscribe(this.connection);

        this.queue = [];
        this.resource = null;

        this.audioPlayer.on("stateChange", async (oldState, newState) => {
            if(oldState.status === AudioPlayerStatus.Playing && newState.status === AudioPlayerStatus.Idle) {
                this.queue.shift();
                this.update();
            }
        });

        return this;
    }

    addSong(data) {
        if(data.title && data.url) {
            this.queue.push(data);
            if(this.isPlaying()) this.textChannel.send({embed:{
                author: {
                    name: "Queue Updated",
                    icon_url: ""
                },
                description: `[\`${data.title}\`](${data.url}) has been added to the queue.`
            }});
            this.update();
        }
        return this;
    }

    async skip(msg) {
        await this.ref.replyTo(msg, {embed:{
            author: {
                name: "Song Queue",
                icon_url: ""
            },
            description: `${msg.member.displayName} skipped [the song](${this.queue[0].url}).`
        }});
        
        this.audioPlayer.stop();
    }

    async update() {
        if(this.audioPlayer.state.status === AudioPlayerStatus.Playing) return;
        if(this.queue[0]) {
            this.resource = createAudioResource(await ytdl(this.queue[0].url));
            this.play();
        } else {
            this.textChannel.send({embed:{
                author: {
                    name: "Queue Complete",
                    icon_url: ""
                },
                description: "There's no more songs in the queue."
            }})
            this.connection.destroy();
            this.ref.musicQueue.delete(this.textChannel.guild.id);
        }
    }

    async play() {
        await this.audioPlayer.play(this.resource);
        this.textChannel.send({embed:{
            author: {
                name: "Now Playing",
                icon_url: ""
            },
            description: `[\`${this.queue[0].title}\`](${this.queue[0].url}) is now playing.`
        }})
    }

    isPlaying() {
        return this.audioPlayer.state.status === AudioPlayerStatus.Playing;
    }
}