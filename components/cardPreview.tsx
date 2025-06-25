import { Card } from "./card";
import { H3, P } from "./htmlElements";

export const CardPreview = ({
	title,
	description,
	url,
}: {
	title: string;
	description: string;
	url: string;
}) => {
	return (
		<a href={url} className="block mb-4">
			<Card className="p-4 hover:shadow-lg transition-shadow">
				<H3>{title}</H3>
				<P>{description}</P>
			</Card>
		</a>
	);
};
