import { useState, useId } from "react";
import { useSimpletimesheetStore } from "../lib/store";

interface StripeSecretSectionProps {
	active: boolean; // whether the parent modal is open
	idPrefix?: string; // optional ID prefix to keep IDs unique in parent
}

export const StripeSecretSection = ({ idPrefix }: StripeSecretSectionProps) => {
	const localId = useId();
	const baseId = idPrefix || localId;
	const inputId = `${baseId}-stripe-key`;

	const { setStripeKey, stripeKey } = useSimpletimesheetStore();
	const [loading, setLoading] = useState(false);
	const [stripeKeyInput, setStripeKeyInput] = useState(stripeKey || "");
	const [saved, setSaved] = useState<null | "ok" | "err">(null);

	async function handleSave() {
		try {
			setStripeKey(stripeKeyInput.trim());
			setSaved("ok");
		} catch {
			setSaved("err");
		} finally {
			setLoading(false);
		}
	}

	return (
		<section className="space-y-1" aria-labelledby={`${baseId}-stripe-label`}>
			<label
				id={`${baseId}-stripe-label`}
				htmlFor={inputId}
				className="block text-xs font-medium text-neutral-500 dark:text-neutral-400"
			>
				Stripe Secret Key
			</label>
			<div className="flex gap-2">
				<input
					id={inputId}
					type="password"
					spellCheck={false}
					placeholder="sk_live_..."
					value={stripeKeyInput}
					onChange={(e) => {
						setStripeKeyInput(e.target.value);
						setSaved(null);
					}}
					className="w-full rounded border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
				/>
				<button
					type="button"
					onClick={handleSave}
					disabled={loading || !stripeKeyInput}
					className="px-3 py-1.5 rounded bg-blue-600 text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
				>
					{loading ? "Saving" : saved === "ok" ? "Saved" : "Save"}
				</button>
			</div>
			{saved === "err" && (
				<span className="text-xs text-red-600 dark:text-red-400">
					Error saving key
				</span>
			)}
		</section>
	);
};
