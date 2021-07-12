const { RichEmbed } = require('discord.js');
const Tenor = require("tenorjs").client({
  "Key": "", // https://tenor.com/developer/keyregistration
  "Filter": "off", // "off", "low", "medium", "high", not case sensitive
  "Locale": "en_US", // Your locale here, case-sensitivity depends on input
  "MediaFilter": "minimal", // either minimal or basic, not case sensitive
  "DateFormat": "D/MM/YYYY - H:mm:ss A" // Change this accordingly
});

module.exports = {
	name: "doanaussie",
	aliases: [ "cmds", "commands" ],
	usage: "doanaussie",
	description: "Do An Aussie",
	disabled: false,

	guildOnly: false,
	botPerms: [ "SEND_MESSAGES", "EMBED_LINKS" ],
	userPerms: [  ],

	execute: (arlo, msg, args) => {
		var items = Array("australia","spider", "australian", "kangaroo", "Vegemite", "austrailia doesnt exist", "Aussie");
		var item = items[Math.floor(Math.random() * items.length)];
		console.log(item);
	  
		//var items2 = Array("cute", "australian", "australia", "awful");
		//var item2 = items2[Math.floor(Math.random() * items2.length)];
		//console.log(item2);
		//var jamesfinal = (item+" "+item2);
		var jamesfinal = (item);
		//console.log(jamesfinal);
	  
	  
		Tenor.Search.Query(jamesfinal, "50").then(Results => {
		  //console.log(Results);
		  const randomLink = Results[Math.floor(Math.random()*(Results.length-1))];
		  msg.channel.send(`**You Did An Aussie**\n\ ${randomLink.url}`)
	  }).catch(console.error);
		
		//return message.channel.send(embed);
		
	  }
			}
