module.exports = {
	apps: [
		{
			name: "arlo-bot",
			script: "node",
			args: "src/app.js"
		}, {
			name: "arlo-site",
			script: "npx",
			args: "next start -p 8080"
		}
	]
}
