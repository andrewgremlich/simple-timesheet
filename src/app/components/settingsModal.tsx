import { useId, useRef } from "react";
import { X } from "lucide-react";
import { useSimpletimesheetStore } from "../lib/store";
import { StripeSecretSection } from "./StripeSecretSection";
import { Dialog } from "./Dialog";

export const SettingsModal = () => {
	const { settingsModalActive, toggleSettingsModal } =
		useSimpletimesheetStore();
	const headingId = useId();
	const closeButtonRef = useRef<HTMLButtonElement | null>(null);

	return (
		<Dialog
			isOpen={settingsModalActive}
			onClose={toggleSettingsModal}
			titleId={headingId}
			returnFocusRef={closeButtonRef as unknown as React.RefObject<HTMLElement>} // Fallback focus
		>
			<form
				method="dialog"
				className="space-y-4"
				onSubmit={(e) => e.preventDefault()}
			>
				<header className="flex items-center justify-between">
					<h2
						id={headingId}
						className="text-lg font-bold dark:text-white text-black"
					>
						Settings
					</h2>
					<button
						ref={closeButtonRef}
						type="button"
						onClick={toggleSettingsModal}
						aria-label="Close settings"
						className="cursor-pointer text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
					>
						<X />
					</button>
				</header>
				<p className="text-sm text-neutral-600 dark:text-neutral-300">
					Application settings. Store your Stripe Secret Key securely (never
					exposed outside the local vault).
				</p>
				<StripeSecretSection
					active={settingsModalActive}
					idPrefix={headingId}
				/>
				<div className="flex justify-end gap-2 pt-2">
					<button
						type="button"
						onClick={toggleSettingsModal}
						className="dark:text-white text-black px-3 py-1.5 rounded border text-sm border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800"
					>
						Close
					</button>
				</div>
			</form>
		</Dialog>
	);
};
