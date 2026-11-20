import ReaderSpaceOverview from "../../components/readers-space/ReaderSpaceOverview";
import { getWorks, toWorkSummary } from "../../../lib/works";

export default function ReaderSpaceOverviewPage() {
  const works = getWorks().map(toWorkSummary);
  return <ReaderSpaceOverview works={works} />;
}
