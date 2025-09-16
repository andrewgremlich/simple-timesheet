import { useEffect, useRef, useId } from "react";
import { X } from "lucide-react";
import { useSimpletimesheetStore } from "../lib/store";
import { StripeSecretSection } from "./StripeSecretSection";

export const SettingsModal = () => {
	const { settingsModalActive, toggleSettingsModal } =
		useSimpletimesheetStore();
	const dialogRef = useRef<HTMLDialogElement | null>(null);

	// Sync Zustand state with the native dialog API for proper modal semantics
	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;
		if (settingsModalActive) {
			if (!dialog.open) {
				try {
					dialog.showModal();
				} catch {
					/* already open or unsupported */
				}
			}
		} else {
			if (dialog.open) dialog.close();
		}
	}, [settingsModalActive]);

	const handleClose = () => {
		if (settingsModalActive) toggleSettingsModal();
	};

  const headingId = useId();

	return (
		<dialog
			ref={dialogRef}
			className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 m-0 w-full max-w-md rounded-md p-4 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 backdrop:backdrop-blur-sm"
			onClose={handleClose}
			// Prevent default Esc closing without syncing state
			onCancel={(e) => {
				e.preventDefault();
				handleClose();
			}}
		>
			<form method="dialog" className="space-y-4" onSubmit={(e)=>e.preventDefault()}>
				<header className="flex items-center justify-between">
					<h2
						id={headingId}
						className="text-lg font-bold dark:text-white text-black"
					>
						Settings
					</h2>
					<button
						type="button"
						onClick={handleClose}
						aria-label="Close settings"
						className="cursor-pointer text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
					>
						<X />
					</button>
				</header>
				<p className="text-sm text-neutral-600 dark:text-neutral-300">
					Application settings. Store your Stripe Secret Key securely (never exposed outside the local vault).
				</p>
				<StripeSecretSection active={settingsModalActive} idPrefix={headingId} />
				{/* Placeholder for future settings controls */}
				<div className="flex justify-end gap-2 pt-2">
					<button
						type="button"
						onClick={handleClose}
						className="dark:text-white text-black px-3 py-1.5 rounded border text-sm border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800"
					>
						Close
					</button>
				</div>
			</form>
		</dialog>
	);
};
