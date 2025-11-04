import { FileStorage } from "./FileStorage";
import { useSimpletimesheetStore } from "./lib/store";
import { ProjectPageTab } from "./lib/types";
import { Timesheet } from "./Timesheet";

export const App = () => {
	const { activeTab } = useSimpletimesheetStore();

	switch (activeTab) {
		case ProjectPageTab.Timesheet:
			return <Timesheet />;
		case ProjectPageTab.FileStorage:
			return <FileStorage />;
		default:
			return <Timesheet />;
	}
};
