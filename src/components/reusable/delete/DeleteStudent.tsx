import type { FC } from "react";
import { Button, SpinnerLoader } from "@/components";
import { useStudent } from "@/hooks";

type DeleteStudentProps = {
  studentUuid: any;
};

const DeleteStudent: FC<DeleteStudentProps> = ({ studentUuid }) => {
  /**
   * component states
   */
  const { deleteStudentMutateAsync, isDeletingStudent } = useStudent();

  return (
    <Button
      title={
        isDeletingStudent ? (
          <SpinnerLoader color="fill-white" size="w-4 h-4" />
        ) : (
          "Delete"
        )
      }
      intent="danger"
      type="small"
      purpose={() => deleteStudentMutateAsync(studentUuid)}
      disabled={isDeletingStudent}
    />
  );
};

export default DeleteStudent;
