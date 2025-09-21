import * as React from "react";

// Base utility to merge our fixed classNames with user-provided ones
function cx(...classes: (string | undefined | false)[]) {
	return classes.filter(Boolean).join(" ");
}

export type SectionProps = React.ComponentPropsWithoutRef<"section">;
export const Section = React.forwardRef<HTMLElement, SectionProps>(
	({ className, children, ...rest }, ref) => (
		<section
			ref={ref as React.Ref<HTMLElement>}
			className={cx("mt-8 mb-6", className)}
			{...rest}
		>
			{children}
		</section>
	),
);
Section.displayName = "Section";

export type H1Props = React.ComponentPropsWithoutRef<"h1">;
export const H1 = React.forwardRef<HTMLHeadingElement, H1Props>(
	({ className, children, ...rest }, ref) => (
		<h1
			ref={ref}
			className={cx("text-3xl font-bold mb-6", className)}
			{...rest}
		>
			{children}
		</h1>
	),
);
H1.displayName = "H1";

export type H2Props = React.ComponentPropsWithoutRef<"h2">;
export const H2 = React.forwardRef<HTMLHeadingElement, H2Props>(
	({ className, children, ...rest }, ref) => (
		<h2
			ref={ref}
			className={cx("text-2xl font-bold mb-4", className)}
			{...rest}
		>
			{children}
		</h2>
	),
);
H2.displayName = "H2";

export type H3Props = React.ComponentPropsWithoutRef<"h3">;
export const H3 = React.forwardRef<HTMLHeadingElement, H3Props>(
	({ className, children, ...rest }, ref) => (
		<h3 ref={ref} className={cx("text-xl font-bold mb-2", className)} {...rest}>
			{children}
		</h3>
	),
);
H3.displayName = "H3";

export type PProps = React.ComponentPropsWithoutRef<"p">;
export const P = React.forwardRef<HTMLParagraphElement, PProps>(
	({ className, children, ...rest }, ref) => (
		<p ref={ref} className={cx("text-gray-700 mb-4", className)} {...rest}>
			{children}
		</p>
	),
);
P.displayName = "P";
