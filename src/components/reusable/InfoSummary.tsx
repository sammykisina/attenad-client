import type { FC } from "react";
import { StatusCell } from "@/components";

type InfoSummaryProps = {
  infoName: string;
  infoCode: string;
  infoStatus: string;
};

const InfoSummary: FC<InfoSummaryProps> = ({
  infoCode,
  infoName,
  infoStatus,
}) => {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex gap-2">
        <span>{infoName}</span>

        <span className="text-primary/50">{infoCode}</span>
      </div>

      <span>
        <StatusCell value={infoStatus} />
      </span>
    </div>
  );
};

export default InfoSummary;
