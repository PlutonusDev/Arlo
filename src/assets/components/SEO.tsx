import React from "react";
import Head from "next/head";

const SEO: React.FC<SEOProps> = ({ description, keywords, title }) => (
	<Head>
		<title>{title} | Arlo</title>
		<meta name="description" content={description} />
		<meta name="keywords" content={keywords?.join(", ")} />

		<meta property="og:type" content="website" />
		<meta property="og:title" content={title} />
		<meta property="og:description" content={description} />
		<meta property="og:site_name" content="Arlo.gg" />
		<meta property="og:url" content="https://arlo.gg/" />
		<meta property="og:image" content="" />

		<meta name="twitter:card" content="summary" />
		<meta name="twitter:title" content={title} />
		<meta name="twitter:description" content={description} />
		<meta name="twitter:site" content="https://arlo.gg/" />
		<meta name="twitter:creator" content="@Arlo_GG" />
		<meta name="twitter:image" content="" />

		<link rel="icon" type="image/png" href="/icons/icon-72x72.png" />
		<link rel="apple-touch-icon" type="image/png" href="/icons/icon-72x72.png" />
	</Head>
);

export interface SEOProps {
	description?: string,
	lang?: string,
	meta?: any[];
	keywords?: string[];
	title?: string;
}

SEO.defaultProps = {
	description: "Your new favourite Discord bot. Powerful, fully-featured, and equipped with an online dashboard.",
	keywords: [
		"discord",
		"bot",
		"arlo",
		"arlo-gg",
		"discord-bot",
		"dashboard"
	]
}

export default SEO;
