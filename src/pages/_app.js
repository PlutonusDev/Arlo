import { Provider } from "next-auth/client";
import "../assets/styles/index.css";

export default function App({ Component, pageProps }) {
	return (
		<Provider session={pageProps.session}>
			<Component {...pageProps} />
		</Provider>
	)
}
