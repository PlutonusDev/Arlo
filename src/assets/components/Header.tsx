import React from "react";

import UserMenu from "./header/UserMenu";

function Header({ sidebarOpen, setSidebarOpen }) {
	return (
		<header className="sticky top-0 bg-gray-900 border-b border-gray-700 z-30 mb-4">
			<div className="px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16 -mb-px">
					<div className="flex">
						<button className="text-gray-500 hover:text-gray-600 lg:hidden mr-4"
							onClick={() => setSidebarOpen(!sidebarOpen)}
							aria-controls="sidebar" aria-expanded={sidebarOpen}
						>
							<span className="sr-only">Open sidebar</span>
							<svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
								<rect x="4" y="5" width="16" height="2" />
								<rect x="4" y="11" width="16" height="2" />
								<rect x="4" y="17" width="16" height="2" />
							</svg>
						</button>
						<h3 className="text-lg text-white font-semibold">Arlo</h3>
					</div>

					<div className="flex items-center">
						<UserMenu />
					</div>
				</div>
			</div>
		</header>
	);
}

export default Header;
