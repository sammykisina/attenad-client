import type { FC } from "react";
import { Button, SpinnerLoader } from "@/components";
import { useCourse, useModule } from "@/hooks";

type DeleteModuleProps = {
  moduleUuid: any;
};

const DeleteCourse: FC<DeleteModuleProps> = ({ moduleUuid }) => {
  /**
   * component states
   */
  const { deleteModuleMutateAsync, isDeletingModule } = useModule();

  return (
    <Button
      title={
        isDeletingModule ? (
          <SpinnerLoader color="fill-white" size="w-4 h-4" />
        ) : (
          "Delete"
        )
      }
      intent="danger"
      type="small"
      purpose={() => deleteModuleMutateAsync(moduleUuid)}
      disabled={isDeletingModule}
    />
  );
};

export default DeleteCourse;
