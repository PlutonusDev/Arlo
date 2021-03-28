module.exports = (azure, msg) => {
    if (!msg.content.startsWith(azure.config.prefix) || msg.author.bot) return;

    const cmd = msg.content.slice(azure.config.prefix.length).split(/ +/).shift().toLowerCase();

    if (azure.commands.has(cmd) || azure.commands.find((c) => c.file.aliases.includes(cmd))) {
        const args = msg.content.slice(azure.config.prefix.length).split(/ +/);
        args.shift();
        const command = azure.commands.get(cmd) || (c.file.aliases && azure.commands.find((c) => c.file.aliases.includes(cmd)));

        if(command.file.disabled) return msg.channel.send({embed:{
            author: {
                name: "Command Unavailable",
                icon_url: "https://image.flaticon.com/icons/png/128/3306/3306642.png"
            },
            description: `The \`${command.file.name}\` command is currently disabled.`
        }});

        if(msg.channel.type === "dm" && command.file.guildOnly) return msg.channel.send({embed:{
            author: {
                name: "Command Unavailable",
                icon_url: "https://image.flaticon.com/icons/png/128/3306/3306642.png"
            },
            description: `The \`${command.file.name}\` command must be used in a server.`
        }});

        if(msg.channel.type !== "dm") {
            if(command.file.botPerms && !command.file.botPerms.every(perm => msg.channel.permissionsFor(azure.client.user).has(perm))) {
                return msg.author.send({embed:{
                    author: {
                        name: "Missing Bot Permissions",
                        icon_url: "https://image.flaticon.com/icons/png/128/3306/3306642.png"
                    },
                    description: `I can't run the \`${command.file.name}\` command in ${msg.channel} because I'm missing the following permissions:\n\n- ${command.file.botPerms.filter(perm => !msg.channel.permissionsFor(azure.client.user).has(perm)).join("\n- ")}`
                }});
            }

            if(command.file.userPerms && !command.file.userPerms.every(perm => msg.member.permissions.has(perm))) {
                return msg.channel.send(msg.member, {embed:{
                    author: {
                        name: "Missing Permissions",
                        icon_url: "https://image.flaticon.com/icons/png/128/3306/3306642.png"
                    },
                    description: `You aren't allowed to run this command because you're missing the following permissions:\n\n- ${command.file.userPerms.filter(perm => !msg.member.permissions.has(perm)).join("\n- ")}`
                }});
            }
        }

        try {
            command.file.execute(azure, msg, args);
        } catch (e) {
            msg.reply({embed:{
                author: {
                    name: "Unexpected Error Occured",
                    icon_url: "https://image.flaticon.com/icons/png/128/3306/3306642.png"
                },
                description: `Something went wrong while executing the ${command.file.name} command.\nPlease try again later.`
            }}).catch(()=>{});
            return azure.emit("warning", `Error in command '${command.file.name}': ${e.message.split("\n")[0]}`);
        }
    } else return;
}