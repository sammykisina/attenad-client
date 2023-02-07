import { courseAtoms } from "@/atoms";
import {
  Button,
  Error,
  Notifications,
  SpinnerLoader,
  WidgetHeader,
} from "@/components";
import { schoolManagement } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import type { z } from "zod";
import { type SubmitHandler, useForm } from "react-hook-form";
import { appUtils } from "@/utils";
import { useCourse, useIntake } from "@/hooks";

const CreateOrEditCourseWidget = () => {
  /**
   * component states
   */
  const {
    globalCourseState,
    isEditingCourseState,
    showCreateOrEditCourseWidgetState,
  } = courseAtoms;
  const [isEditingCourse, setIsEditingCourse] =
    useRecoilState(isEditingCourseState);
  const [globalCourse, setGlobalCourse] = useRecoilState(globalCourseState);
  const setShowCreateOrEditCourseWidget = useSetRecoilState(
    showCreateOrEditCourseWidgetState
  );

  const [courseCode, setCourseCode] = useState("");

  const { courseSchema } = schoolManagement;
  type CourseSchema = z.infer<typeof courseSchema>;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CourseSchema>({
    resolver: zodResolver(courseSchema),
  });

  const { generateCode } = appUtils;
  const {
    createCourseMutateAsync,
    isCreatingCourse,
    updateCourseMutateAsync,
    isUpdatingCourse,
  } = useCourse();

  /**
   * component functions
   */
  const onSubmit: SubmitHandler<CourseSchema> = ({ name }) => {
    /**
     * validation
     */
    if (courseCode.trim() === "") {
      Notifications.errorNotification("Please generate the course code.");
      return;
    }

    isEditingCourse
      ? updateCourseMutateAsync({
          courseUuid: globalCourse?.attributes?.uuid,
          courseData: {
            name,
            code: courseCode,
          },
        })
      : createCourseMutateAsync({
          name,
          code: courseCode,
        });

    clearForm();
  };

  const clearForm = () => {
    reset({
      name: "",
    });

    setCourseCode("");
  };

  useEffect(() => {
    if (isEditingCourse && globalCourse) {
      reset({
        name: globalCourse?.attributes?.name,
      });

      setCourseCode(globalCourse?.attributes?.code);
    }
  }, [isEditingCourse, globalCourse, reset]);

  return (
    <section>
      {/* header */}
      <WidgetHeader
        close={() => {
          setGlobalCourse(null);
          setIsEditingCourse(false);
          setShowCreateOrEditCourseWidget(false);
          clearForm();
        }}
        title={!isEditingCourse ? "Creating Course." : "Editing Course."}
      />

      {/* body */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 px-2"
      >
        <div className="flex  w-full flex-col gap-4 overflow-y-scroll py-3 scrollbar-hide">
          {/* roles and card info */}
          <div className="flex flex-col gap-y-5 rounded-md border border-primary/10 py-4 px-2">
            <div className="relative">
              <input
                type="text"
                className="input peer"
                placeholder="Name"
                {...register("name", { required: true })}
              />
              <label className="input_label">Name</label>

              {errors["name"] && (
                <Error error_message={errors["name"].message} />
              )}
            </div>

            <div className="relative">
              <div className="flex items-center">
                <input
                  type="text"
                  className="input peer"
                  placeholder="Course Code"
                  value={courseCode}
                  onChange={(event) => setCourseCode(event.target.value)}
                />

                <button
                  className="flex h-[38px] items-center justify-center gap-[6px] whitespace-nowrap  rounded-full bg-secondary px-4 py-2 text-[14px] text-white focus:outline-none"
                  type="button"
                  onClick={() => setCourseCode(generateCode("course"))}
                >
                  Generate
                </button>

                <label className="input_label">Course Code</label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            title={
              isEditingCourse ? (
                isUpdatingCourse ? (
                  <SpinnerLoader color="fill-white" />
                ) : (
                  "Edit"
                )
              ) : isCreatingCourse ? (
                <SpinnerLoader color="fill-white" />
              ) : (
                "Create"
              )
            }
            intent="primary"
          />
        </div>
      </form>
    </section>
  );
};

export default CreateOrEditCourseWidget;
