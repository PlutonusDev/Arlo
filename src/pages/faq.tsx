import React, { useState } from "react";

import Layout from "../assets/layouts";

export default function WelcomePage() {
	return (
		<Layout title="Home">
			<div className="py-8 px-8 max-w-sm mx-auto bg-gray-900 rounded-xl shadow-md space-y-2 sm:py-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-6">
				<p className="text-lg text-white font-semibold">
					COMING SOON
				</p>
			</div>
		</Layout>
	);
}
