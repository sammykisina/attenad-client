import type { FC } from "react";
import { Button, SpinnerLoader } from "@/components";
import { useCourse } from "@/hooks";

type DeleteCourseProps = {
  courseUuid: any;
};

const DeleteCourse: FC<DeleteCourseProps> = ({ courseUuid }) => {
  /**
   * component states
   */
  const { deleteCourseMutateAsync, isDeletingCourse } = useCourse();

  return (
    <Button
      title={
        isDeletingCourse ? (
          <SpinnerLoader color="fill-white" size="w-4 h-4" />
        ) : (
          "Delete"
        )
      }
      intent="danger"
      type="small"
      purpose={() => deleteCourseMutateAsync(courseUuid)}
      disabled={isDeletingCourse}
    />
  );
};

export default DeleteCourse;
