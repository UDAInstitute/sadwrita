import WorksCatalogue from "../components/WorksCatalogue";
import { getWorks, toWorkSummary } from "../../lib/works";

export default function WorksPage() {
  const works = getWorks().map(toWorkSummary);
  return <WorksCatalogue works={works} />;
}
