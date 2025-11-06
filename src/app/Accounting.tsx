import { useReactTable } from "@tanstack/react-table"; // https://tanstack.com/table/latest/docs/guide/data
import { H1 } from "./components/HtmlElements";

// A table where I can attach a file for the record, description, amount, date, and category.
// Allow for multiple tables.
export const Accounting = () => {
	const options = {
		columns: [
			{
				header: "File",
				accessorKey: "file",
			},
			{
				header: "Description",
				accessorKey: "description",
			},
			{
				header: "Amount",
				accessorKey: "amount",
			},
			{
				header: "Date",
				accessorKey: "date",
			},
			{
				header: "Category",
				accessorKey: "category",
			},
		],
	};
	const table = useReactTable(options);

	return (
		<>
			<H1>Accounting</H1>
		</>
	);
};
