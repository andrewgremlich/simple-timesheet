import * as React from "react";
import { cn } from "@/lib/utils";

export interface LabelProps
	extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
	({ className, ...props }, ref) => (
		// biome-ignore lint/a11y/noLabelWithoutControl: used in other components
		<label
			ref={ref}
			className={cn(
				"text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
				className,
			)}
			{...props}
		/>
	),
);
Label.displayName = "Label";

export { Label };
