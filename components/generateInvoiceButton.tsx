// components/GenerateInvoiceButton.tsx
"use client";
import { useFormStatus } from "react-dom";

export function GenerateInvoiceButton({ isClosed }: { isClosed?: boolean }) {
	const { pending } = useFormStatus();

	return (
		<button
			type="submit"
			disabled={pending || isClosed}
			className={`shrink-0 px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-md`}
		>
			{pending ? "Generating..." : "Generate Invoice"}
		</button>
	);
}
