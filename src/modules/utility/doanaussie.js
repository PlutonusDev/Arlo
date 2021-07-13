//TenorAPI integration 
const Tenor = require("tenorjs").client({
  "Key": "", // https://tenor.com/developer/keyregistration
  "Filter": "off", // "off", "low", "medium", "high", not case sensitive
  "Locale": "en_US", // Your locale here, case-sensitivity depends on input
  "MediaFilter": "minimal", // either minimal or basic, not case sensitive
  "DateFormat": "D/MM/YYYY - H:mm:ss A" // Change this accordingly
});

//Arlo bot stuff
module.exports = {
	name: "doanaussie",
	usage: "doanaussie",
	description: "Do An Aussie",
	disabled: false,
	guildOnly: false,
	botPerms: [ "SEND_MESSAGES", "EMBED_LINKS" ],
	
	//Random Search results for Tenor
	execute: (arlo, msg, args) => {
		var items = Array("australia","spider", "australian", "kangaroo", "Vegemite", "austrailia doesnt exist", "Aussie");
		var item = items[Math.floor(Math.random() * items.length)];
		var selected = (item);

		Tenor.Search.Query(selected, "50").then(Results => {
		  const randomLink = Results[Math.floor(Math.random()*(Results.length-1))];

		  //Sends message with Tenor link
		  msg.channel.send(`**You Did An Aussie**\n\ ${randomLink.url}`)
	  }).catch(console.error);
		
	
		
	}
}
