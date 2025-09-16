import { Home, Settings } from "lucide-react";
import { useSimpletimesheetStore } from "../lib/store";

export const Nav = () => {
	const toggleSettings = useSimpletimesheetStore(
		(state) => state.toggleSettingsModal,
	);

	return (
		<nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between p-4">
			<Home size={40} />
			<button className="cursor-pointer" onClick={toggleSettings} type="button">
				<Settings size={40} />
			</button>
		</nav>
	);
};
