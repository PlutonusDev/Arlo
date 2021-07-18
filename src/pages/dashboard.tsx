import React from "react";
import { getSession, useSession } from "next-auth/client";
import axios from "axios";

import Layout from "../assets/layouts";

export async function getServerSideProps(context) {
	const session = await getSession(context);

	if(!session) return { props: {} }

	try {
		const guilds = await axios({
			url: `http://localhost:3001/users/${session.user.id}/guilds`,
			method: "GET",
		});

		return { props: { guilds: guilds.data.available, botMissing: guilds.data.unavailable } };
	} catch {
		context.res.statusCode = 307;
		context.res.setHeader("Location", "/dashboard");
		return {props:{}};
	}
}

export default function DashboardPage({ guilds, botMissing }) {
	const [ session, loading ] = useSession();

	if(loading) return (
		<Layout title="Dashboard">
			<div className="py-8 px-8 max-w-sm mx-auto bg-gray-900 rounded-lg shadow-md space-y-2 sm:py-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-6">
				<p className="text-lg text-white font-semibold">
					Loading Dashboard...
				</p>
			</div>
		</Layout>
	);

	if(!loading && !session) return (
		<Layout title="Oops!">
			<div className="py-8 px-8 max-w-sm mx-auto bg-red-900 rounded-lg shadow-md space-y-2 sm:py-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-6">
				<p className="text-lg text-red-400 font-semibold">
					Oops!
				</p>
				<p className="text-sm text-red-300">
					You must be signed in to access your dashboard.
				</p>
			</div>
		</Layout>
	);

	return (
		<Layout title="Dashboard">
			<p className="mt-4 text-white">Guilds:</p>
			<div className="flex flex-wrap">
				{guilds.map(guild => (
					<>
						<div className="w-full md:w-1/2 mb-4">
							<div className="cursor-default mx-2 p-4 bg-indigo-200 border-2 border-indigo-800 border-opacity-60 rounded-sm overflow-hidden">
								<a href={`/dashboard/${guild.id}`} className="relative flex flex-row">
									<div>
										{guild.icon ?
											<img className="w-16 h-16 mr-4 rounded-lg bg-indigo-700" src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.${guild.icon.startsWith("a_") ? "gif" : "png"}?size=512`} />
											: <p className="w-16 h-16 mr-4 rounded-lg bg-indigo-700" />
										}
									</div>
									<div className="my-auto">
										<h1 className="text-lg text-indigo-800 font-bold mb-1">{guild.name}</h1>
										<p>{guild.id}</p>
									</div>
									<div className="ml-auto my-auto hidden md:block">
										<a href={`/dashboard/${guild.id}`} className="rounded-lg px-4 py-2 bg-indigo-800 text-white border-2 border-indigo-600">Edit</a>
									</div>
									<div className="ml-auto my-auto block md:hidden">
										<a href={`/dashboard/${guild.id}`} className="rounded-lg p-2 bg-indigo-800 text-white border-2 border-indigo-600">&gt;</a>
									</div>
								</a>
							</div>
						</div>
					</>
				))}
			</div>
			<p className="mt-4 text-white">Bot Missing:</p>
			<div className="flex flex-wrap">
				{botMissing.sort((g1, g2) => g1.isAdmin && !g2.isAdmin ? -1 : 1).map(guild => (
					<>
						<div className="w-full md:w-1/2 mb-4" key={guild.id}>
							<div className={`cursor-default mx-2 p-4 bg-red-200 border-2 border-red-800 border-opacity-60 rounded-sm overflow-hidden ${!guild.isAdmin && "opacity-40"}`}>
								<a href={guild.isAdmin ? `https://discord.com/oauth2/authorize?client_id=862563249735729163&permissions=3533910&redirect_uri=https%3A%2F%2Farlo.gg%2Fdashboard&scope=bot&guild_id=${guild.id}` : `/dashboard`} className="relative flex flex-row">
									<div>
										{guild.icon ?
											<img className="w-16 h-16 mr-4 rounded-lg bg-indigo-700" src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.${guild.icon.startsWith("a_") ? "gif" : "png"}?size=512`} />
											: <p className="w-16 h-16 mr-4 rounded-lg bg-indigo-700" />
										}
									</div>
									<div className="my-auto">
										<h1 className="text-lg text-red-800 font-bold mb-1">{guild.name}</h1>
										<p>{guild.id}</p>
									</div>
									{guild.isAdmin && <>
										<div className="ml-auto my-auto hidden md:block">
											<a href={`https://discord.com/oauth2/authorize?client_id=862563249735729163&permissions=3533910&scope=bot&guild_id=${guild.id}`} className="rounded-lg px-4 py-2 bg-green-800 text-white border-2 border-green-600">Add Arlo</a>
										</div>
										<div className="ml-auto my-auto block md:hidden">
											<a href={`https://discord.com/oauth2/authorize?client_id=862563249735729163&permissions=3533910&scope=bot&guild_id=${guild.id}`} className="rounded-lg p-2 bg-green-800 text-white border-2 border-green-600">+</a>
										</div>
									</>}
								</a>
							</div>
						</div>
					</>
				))}
			</div>
		</Layout>
	);
}
