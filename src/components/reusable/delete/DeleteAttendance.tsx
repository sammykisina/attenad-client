import type { FC } from "react";
import { Button, SpinnerLoader } from "@/components";
import { useAttendance } from "@/hooks";

type DeleteAttendanceProps = {
  attendanceUuid: string;
};

const DeleteAttendance: FC<DeleteAttendanceProps> = ({ attendanceUuid }) => {
  /**
   * component states
   */
  const { deleteAttendanceMutateAsync, isDeletingAttendance } = useAttendance();

  return (
    <Button
      title={
        isDeletingAttendance ? (
          <SpinnerLoader color="fill-white" size="w-4 h-4" />
        ) : (
          "Delete"
        )
      }
      intent="danger"
      type="small"
      purpose={() => deleteAttendanceMutateAsync(attendanceUuid)}
      disabled={isDeletingAttendance}
    />
  );
};

export default DeleteAttendance;
