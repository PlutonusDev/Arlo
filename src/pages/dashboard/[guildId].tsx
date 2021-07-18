import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getSession, useSession } from "next-auth/client";
import axios from "axios";

import Layout from "../../assets/layouts";

export async function getServerSideProps(context) {
	const session = await getSession(context);
	const { guildId } = context.query;

	if(!session) return { props: {} };

	try {
		const guild = await axios({
			url: `http://localhost:3001/users/${session.user.id}/guilds/${guildId}`,
			method: "GET"
		});

		return { props: { guild: guild.data } };
	} catch {
		context.res.statusCode = 302;
		context.res.setHeader("Location", "/dashboard");
		return { props : {} }
	}
}

/*async function makeReq() {
	return new Promise(res => {
		axios({
			url: "http://204.44.81.167:3001/test",
			method: "GET"
		}).then(test => {
			return res(test.data);
		}).catch(e => {
			return res(JSON.stringify(e));
		});
	});
}*/

export default function GuildSettingsPage({ guild }) {
	const [ session, loading ] = useSession();
	const [ settings, setSettings ] = useState({});
	const router = useRouter();
	const { guildId } = router.query;

	/*useEffect(async () => {
		const test = await makeReq();
		setSettings({hello:test})
	}, []);*/

	const updateSetting = async (property, setting) => {
		//const data = await fetch("http://204.44.81.167:3001/test");
		//setSettings({hello:"well shit hi there!"});
	}

	if(loading) return (
		<Layout title="Loading...">
			<div className="py-8 px-8 max-w-sm mx-auto bg-gray-900 rounded-xl shadow-md space-y-2 sm:py-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-6">
				<p className="text-lg text-white font-semibold">
					Loading Guild...
				</p>
			</div>
		</Layout>
	)

	if(!loading && !session) return (
		<Layout title="Oops!">
			<div className="py-8 px-8 max-w-sm mx-auto bg-red-900 rounded-xl shadow-md space-y-2 sm:py-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-6">
				<p className="text-lg text-red-400 font-semibold">
					Oops!
				</p>
				<p className="text-sm text-red-300">
					You must be signed in to edit guild settings.
				</p>
			</div>
		</Layout>
	)

	return (
		<Layout title={guild.name}>
			<p className="text-white text-lg">{guild.name} {guild.id}</p><br/>
			<button className="hidden" onClick={() => updateSetting("test", "onetwothree")}>Click me</button>
		</Layout>
	);
}
