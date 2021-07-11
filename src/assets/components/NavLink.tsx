import { useRouter } from "next/router";

function NavLink({ children, href }) {
	const router = useRouter();

	const handleNavigation = e => {
		e.preventDefault();
		router.push(href);
	}

	return(
		<li className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 hover:bg-gray-800 transition duration-150 ${router.asPath === href && "bg-gray-800"}`}>
			<a href={href} onClick={handleNavigation} className={`block text-gray-200 hover:text-white transition duration-150 ${router.asPath === href && "hover:text-gray-400"}`}>
				{children}
			</a>
		</li>
	)
}

export default NavLink;
