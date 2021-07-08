module.exports = arlo => {
	arlo.user.setPresence({
		status: "dnd",
		activity: {
			name: "the space race!",
			type: "COMPETING"
		}
	});
}
