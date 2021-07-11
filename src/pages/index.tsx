import React, { useEffect } from "react";
import { useRouter } from "next/router";

export default function ArloApp() {
	const router = useRouter();

	useEffect(() => {
		if(router.asPath === "/") router.push("/home");
	}), [];
	return <div />;
}
