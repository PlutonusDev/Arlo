const { RichEmbed } = require('discord.js');
const Tenor = require("tenorjs").client({
  "Key": "", // https://tenor.com/developer/keyregistration
  "Filter": "off", // "off", "low", "medium", "high", not case sensitive
  "Locale": "en_US", // Your locale here, case-sensitivity depends on input
  "MediaFilter": "minimal", // either minimal or basic, not case sensitive
  "DateFormat": "D/MM/YYYY - H:mm:ss A" // Change this accordingly
});


module.exports = {
	name: "image",
	aliases: [ "cmds", "commands" ],
	usage: "image image name",
	description: "Finds random images with searched parameters",
	disabled: false,

	guildOnly: false,
	botPerms: [ "SEND_MESSAGES", "EMBED_LINKS" ],
	userPerms: [  ],

	execute: (arlo, msg, args) => {
		Tenor.Search.Query(args.join(" ") , "10").then(Results => {
			//console.log(Results);
			const randomLink = Results[Math.floor(Math.random()*(Results.length-1))];
			
			msg.channel.send(`**Random Image**\nYou searched for: \`${args.join(" ")}\`\n${randomLink.url}`);
		
		}).catch(console.error);
	  }
			}
