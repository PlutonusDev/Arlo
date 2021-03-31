module.exports = async (azure) => {
    azure.client.user.setPresence({
        status: "dnd",
        activity: {
            name: "the space race!",
            type: "COMPETING"
        }
    });

    for(guild of azure.client.guilds.cache.values()) {
        await guild.members.fetch();
    }
}