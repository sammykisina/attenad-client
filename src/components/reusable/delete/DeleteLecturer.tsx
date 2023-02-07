import type { FC } from "react";
import { Button, SpinnerLoader } from "@/components";
import { useLecturer } from "@/hooks";

type DeleteLecturerProps = {
  lecturerUuid: any;
};

const DeleteLecturer: FC<DeleteLecturerProps> = ({ lecturerUuid }) => {
  /**
   * component states
   */
  const { deleteLecturerMutateAsync, isDeletingLecturer } = useLecturer();

  return (
    <Button
      title={
        isDeletingLecturer ? (
          <SpinnerLoader color="fill-white" size="w-4 h-4" />
        ) : (
          "Delete"
        )
      }
      intent="danger"
      type="small"
      purpose={() => deleteLecturerMutateAsync(lecturerUuid)}
      disabled={isDeletingLecturer}
    />
  );
};

export default DeleteLecturer;
