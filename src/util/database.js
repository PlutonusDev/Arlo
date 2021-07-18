const mongoose = require("mongoose");

const schemas = {
	User: new mongoose.Schema({
		username: String,
		discriminator: String,
		id: mongoose.Schema.Types.ObjectId,
		avatar: String,
		security_token: String,

		oauth: {
			access_token: String,
			refresh_token: String,
		},

		guilds: [{
			id: mongoose.Schema.Types.ObjectId,
			canEdit: Boolean
		}]
	}),

	Guild: new mongoose.Schema({
		name: String,
		id: mongoose.Schema.Types.ObjectId,
		icon: String,
		available: Boolean,

		settings: {
			prefix: String
		}
	})
}

const models = {
	//User: mongoose.model("User", schemas.User, "users"),
	Guild: mongoose.model("Guild", schemas.Guild, "guilds")
}

module.exports = {
	schemas,
	models
}
