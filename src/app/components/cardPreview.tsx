import { Card } from "./card";
import { H3, P } from "./htmlElements";

export const CardPreview = ({
	name,
	description,
	action,
}: {
	name: string;
	description: string;
	action: () => void;
}) => {
	return (
		<Card
			className="p-4 mb-4 transition-shadow cursor-pointer"
			onClick={action}
		>
			<H3>{name}</H3>
			<P>{description}</P>
		</Card>
	);
};
