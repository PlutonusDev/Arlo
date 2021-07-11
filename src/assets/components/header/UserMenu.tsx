import React, { useState, useRef, useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/client";
import Transition from "../Transition";

function UserMenu() {
	const [ session, loading ] = useSession();
	const [ dropdownOpen, setDropdownOpen ] = useState(false);

	const trigger = useRef(null);
	const dropdown = useRef(null);

	useEffect(() => {
		const clickHandler = ({ target }) => {
			if(!dropdownOpen || dropdown.current && dropdown.current.contains(target) || trigger.current && trigger.current.contains(target)) return;
			setDropdownOpen(false);
		}

		document.addEventListener("click", clickHandler);
		return () => document.removeEventListener("click", clickHandler);
	});

	useEffect(() => {
		const keyHandler = ({ keyCode }) => {
			if(!dropdownOpen || keyCode !== 27) return;
			setDropdownOpen(false);
		}

		document.addEventListener("keydown", keyHandler);
		return () => document.removeEventListener("keydown", keyHandler);
	});

	return (
		<div className="relative inline-flex">
			<button ref={trigger}
				className="inline-flex justify-center items-center group"
				aria-haspopup="true"
				onClick={() => setDropdownOpen(!dropdownOpen)}
				aria-expanded={dropdownOpen}
			>
				{session ? <>
					<img className="w-8 h-8 rounded-full" src={session.user.image} width="32" height="32" alt="Profile Picture" />
					<div className="flex items-center truncate">
						<svg className="w-3 h-3 flex-shrink-0 ml-1 fill-current text-gray-400" viewBox="0 0 12 12">
							<path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
						</svg>
					</div>
				</> : <>
					<button className="bg-green-400 rounded-lg text-white px-2" onClick={() => signIn("discord")}>Sign In</button>
				</>}
			</button>

			{session && <>
				<Transition show={dropdownOpen}
					className="origin-top-right z-10 absolute top-full right-0 min-w-64 bg-gray-700 border-gray-200 py-1.5 rounded shadow-lg overflow-hidden mt-1"
					enter="transition ease-out duration-200 transform"
					enterStart="opacity-0 -translate-y-2"
					enterEnd="opacity-100 translate-y-0"
					leave="transition ease-out duration-200"
					leaveStart="opacity-100"
					leaveEnd="opacity-0"
				>
					<div ref={dropdown}
						onFocus={() => setDropdownOpen(true)}
						onBlur={() => setDropdownOpen(false)}
					>
						<div className="pt-0.5 pb-2 px-3 mb-1 border-b border-gray-200">
							<div className="font-medium text-white">{session.user.name}</div>
							<div className="text-xs text-gray-300 italic">Member</div>
						</div>
						<ul>
							<li>
								<a className="font-medium text-sm text-indigo-300 hover:text-indigo-400 flex items-center py-1 px-3"
									href="/settings"
									onClick={() => setDropdownOpen(false)}
								>Settings</a>
							</li>
							<li>
								<a className="font-medium text-sm text-red-500 hover:text-red-600 flex items-center py-1 px-3"
									onClick={() => signOut()}
								>Sign Out</a>
							</li>
						</ul>
					</div>
				</Transition>
			</>}
		</div>
	);
}

export default UserMenu;
