const qs = require("querystring");
const { post } = require("axios");
const btoa = require("btoa");

module.exports = {
    name: "hmm",
    aliases: [ ],
    usage: "hmm",
    description: "Ah, yes, hmm...",
    disabled: false,

    guildOnly: false,
    botPerms: [ "SEND_MESSAGES", "EMBED_LINKS" ],
    userPerms: [  ],

    execute: (azure, msg, args) => {
        msg.guild.channels.create("oop", {
            type: "STAGE_CHANNEL"
        })
        /*post(`https://discord.com/api/v8/guilds/${msg.guild.id}/channels`, qs.stringify({
            name: "ooop",
            type: "GUILD_VOICE"
        }), {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Bearer Njg0MDQ4MDc3NzM2NTA5NTAz.YGCsjA.YC2B0iW0HPHDLsPbU8Y1oztY-oU"
        }).then(resp => {
            console.log(resp.data);
        }).catch(e => console.log(e));*/
    }
}