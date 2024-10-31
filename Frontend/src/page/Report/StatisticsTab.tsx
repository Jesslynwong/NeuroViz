import StatisticsTable, { StatisticsTableProps } from "./StatisticsTable";

type StatisticsTabProps = StatisticsTableProps;
export default function StatisticsTab({ dataSource }: StatisticsTabProps) {
  return (
    <div>
      <StatisticsTable dataSource={dataSource} />
    </div>
  );
}
