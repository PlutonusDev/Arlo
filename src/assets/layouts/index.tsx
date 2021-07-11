import React, { useState, useEffect, Fragment } from "react";
import { useRouter } from "next/router";
import { signIn, signOut, useSession, getSession } from "next-auth/client";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import SEO from "../components/SEO";

function LayoutPage({ children, ...rest }) {
	const [ session, loading ] = useSession();
	const router = useRouter();
	const [sidebarOpen, setSidebarOpen] = useState(false);

	return (
		<Fragment>
			<SEO {...rest} />
			<div className="bg-gray-800 flex h-screen overflow-hidden">
				{/* Sidebar */}
				<Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

				<div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
					<Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

					<main className="mx-3 my-3">
						{children}
					</main>
				</div>
			</div>
		</Fragment>
	);
}

export default LayoutPage;
