import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// import "summit-kit/styles";

import "./globals.css";
import { Nav } from "@/components/nav";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Simple Timesheet",
	description:
		"A simple timesheet that integrates with Stripe in order to send invoices",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<Nav />
				<main className="container mx-auto py-25 max-w-4xl">{children}</main>
			</body>
		</html>
	);
}
