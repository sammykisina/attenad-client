import type { FC } from "react";
import { Button, SpinnerLoader } from "@/components";
import { useIntake } from "@/hooks";

type DeleteIntakeProps = {
  intakeUuid: any;
};

const DeleteIntake: FC<DeleteIntakeProps> = ({ intakeUuid }) => {
  /**
   * component states
   */
  const { deleteIntakeMutateAsync, isDeletingIntake } = useIntake();

  return (
    <Button
      title={
        isDeletingIntake ? (
          <SpinnerLoader color="fill-white" size="w-4 h-4" />
        ) : (
          "Delete"
        )
      }
      intent="danger"
      type="small"
      purpose={() => deleteIntakeMutateAsync(intakeUuid)}
      disabled={isDeletingIntake}
    />
  );
};

export default DeleteIntake;
