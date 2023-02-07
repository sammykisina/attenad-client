import React from "react";

const StatusCell = ({ value }: { value: string }) => {
  /**
   * component states
   */

  const status = value ? value.toLowerCase() : "unknown";

  return (
    <span
      className={`rounded-md px-3 py-1 text-xs capitalize leading-loose ${
        status.startsWith("active") ? "bg-green-50 text-green-400" : ""
      } ${status.startsWith("inactive") ? "bg-red-50 text-red-400" : ""}`}
    >
      {status}
    </span>
  );
};

export default StatusCell;
