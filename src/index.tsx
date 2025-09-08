import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { Nav } from "@/components/nav";

import { App } from "./app/index";

const rootElement = document.getElementById("root");

if (!rootElement) {
	throw new Error("Could not find root element with id 'root'");
}

createRoot(rootElement).render(
	<StrictMode>
		<Nav />
		<App />
	</StrictMode>,
);
