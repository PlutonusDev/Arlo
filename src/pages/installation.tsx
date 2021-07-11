import React, { useState } from "react";

import Layout from "../assets/layouts";

export default function InstallationPage() {
	return (
		<Layout title="Self-Hosting">
			<h3 className="text-lg font-semibold text-indigo-300 mb-4">Self-Hosting Instructions</h3>
			<p className="text-sm text-white mb-4">
				So, you'd like to run your very own version of Arlo? No worries! The process is
				fast, simple, and fully covered in this tutorial.
			</p>
			<p className="text-sm text-white mb-4">
				I currently don't have the time to write a comprehensive guide, so I'll list the steps.
			</p>
			<ul>
				<li className="text-sm text-indigo-400 mb-2"><span className="font-semibold">1.</span> Start by installing the <a className="text-indigo-300 hover:text-indigo-200" href="https://nodejs.org">Node.JS Runtime + NPM</a>, and <a className="text-indigo-300 hover:text-indigo-200" href="https://yarnpkg.com">Yarn CLI.</a></li>
				<li className="text-sm text-indigo-400 mb-2"><span className="font-semibold">2.</span> Clone the <a className="text-indigo-300 hover:text-indigo-200" href="https://github.com/PlutonusDev/Arlo">Github Repository</a></li>
				<li className="text-sm text-indigo-400 mb-2"><span className="font-semibold">3.</span> Navigate to the project root and run <span className="px-2 border border-gray-700 bg-gray-900 text-indigo-300 rounded-sm">yarn install</span>.</li>
				<li className="text-sm text-indigo-400 mb-2"><span className="font-semibold">4.</span> If that's all gone well, and there's no errors, edit the <span className="px-2 border border-gray-700 bg-gray-900 text-indigo-300 rounded-sm">.env.example</span> file and rename it to <span className="px-2 border border-gray-700 bg-gray-900 text-indigo-300 rounded-sm">.env</span>.</li>
				<li className="text-sm text-indigo-400 mb-2"><span className="font-semibold">5.</span> Edit all of the configuration files in <span className="px-2 border border-gray-700 bg-gray-900 text-indigo-300 rounded-sm">src/config/</span> <span className="text-red-400 font-semibold">except</span> for the <span className="px-2 border border-gray-700 bg-gray-900 text-indigo-300 rounded-sm">index.js</span> file, and removing the <span className="px-2 border border-gray-700 bg-gray-900 text-indigo-300 rounded-sm">.example</span> from the filenames.</li>
				<li className="text-sm text-indigo-400 mb-2"><span className="font-semibold">6.</span> Congratiulations! You can now run your very own instance of Arlo with <span className="px-2 border border-gray-700 bg-gray-900 text-indigo-300 rounded-sm">yarn dev</span>, or for persistence, with <span className="px-2 border border-gray-700 bg-gray-900 text-indigo-300 rounded-sm">yarn start</span>.</li>
			</ul>
		</Layout>
	);
}
