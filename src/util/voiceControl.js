const { createDiscordJSAdapter } = require("./voiceAdapter");
const { joinVoiceChannel, createAudioResource, createAudioPlayer, AudioPlayerStatus, demuxProbe } = require("@discordjs/voice");
const ytdl = require("ytdl-core-discord"); //"ytdl-core-discord""youtube-dl-exec"

module.exports = class voiceController {
	constructor(data) {
		this.ref = data.arlo;
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
			if(this.isPlaying()) this.textChannel.send({embeds:[{
				description: `[\`${data.title}\`](${data.url}) has been added to the queue.`,
				color: 3977061
			}]});
			this.update();
		}

		return this;
	}

	async skip(msg) {
		await msg.reply({embeds:[{
			description: `${msg.member.displayName} skipped [${this.queue[0].title}](${this.queue[0].url}).`,
			color: 3977061
		}]});

		this.audioPlayer.stop();
	}

	async update() {
		if(this.audioPlayer.state.status === AudioPlayerStatus.Playing) return;
		if(this.queue[0]) {
			this.resource = createAudioResource(await ytdl(this.queue[0].url, {
				filter: "audioonly",
				quality: "highestaudio",
				highWaterMark: 1048576 * 32
			}));
			this.play();

			//this.resource = createAudioResource();
			/*const process = require("child_process").spawn("youtube-dl", [
				this.queue[0].url,
				"-o -",
				"-q",
				"-f bestaudio[ext=webm+acodec=opus+asr=48000]/bestaudio",
				"-r 100K"
			], {
				stdio: ["ignore", "pipe", "ignore"]
			});
			if(!process.stdout) return this.textChannel.send({embeds:[{
				description: "Something went wrong playing that song, try again.\n\nNo process.stdout"
			}]});
			const stream = process.stdout;
			process.once("spawn", async () => {
				await require("util").promisify(setTimeout)(3000);
				console.log(stream);
				demuxProbe(stream).then(async probe => {
					this.resource = await createAudioResource(probe.stream, { inputType: probe.type });
					this.play();
				})
				.catch(err => {
					if(!process.killed) process.kill();
					stream.resume();
					this.textChannel.send({embeds:[{
						description: `Something went wrong playing that song, try again.\n\n\`\`\`${err.message}\n\`\`\``
					}]});
				});
			});*/
		} else {
			this.textChannel.send({embeds:[{
				description: "There's no more songs in the queue.",
				color: 16085868
			}]});

			this.connection.destroy();
			this.ref.musicQueue.delete(this.textChannel.guild.id);
		}
	}

	async play() {
		await this.audioPlayer.play(this.resource);
		this.textChannel.send({embeds:[{
			description: `[\`${this.queue[0].title}\`](${this.queue[0].url}) is now playing.`
		}]});
	}

	isPlaying() {
		return this.audioPlayer.state.status === AudioPlayerStatus.Playing;
	}
}
