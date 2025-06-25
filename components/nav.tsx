import { Home } from "lucide-react";
import Link from "next/link";

export const Nav = () => {
	return (
		<nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between p-4">
			<Link href="/">
				<Home size={40} />
			</Link>
		</nav>
	);
};
