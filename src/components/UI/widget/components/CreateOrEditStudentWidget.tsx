import { studentAtoms } from "@/atoms";
import {
  Button,
  Error,
  Notifications,
  Select,
  SpinnerLoader,
  WidgetHeader,
} from "@/components";
import { usersManagement } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import type { z } from "zod";
import { type SubmitHandler, useForm } from "react-hook-form";
import { appUtils } from "@/utils";
import { userManagementConstants } from "@/constants";
import { useStudent, useIntake, useCourse } from "@/hooks";

const CreateOrEditStudentWidget = () => {
  /**
   * component states
   */
  const {
    isEditingStudentState,
    globalStudentState,
    showCreateOrEditStudentWidgetState,
  } = studentAtoms;
  const [isEditingStudent, setIsEditingStudent] = useRecoilState(
    isEditingStudentState
  );
  const [globalStudent, setGlobalStudent] = useRecoilState(globalStudentState);
  const setShowCreateOrEditStudentWidget = useSetRecoilState(
    showCreateOrEditStudentWidgetState
  );

  const [cardID, setCardID] = useState("");
  const [selectedRole, setSelectedRole] = useState({
    name: "Student",
    value: "student",
  });
  const [selectedCourse, setSelectedCourse] = useState({ name: "", value: "" });
  const [selectedIntake, setSelectedIntake] = useState({ name: "", value: "" });

  const { studentSchema } = usersManagement;
  type StudentSchema = z.infer<typeof studentSchema>;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StudentSchema>({
    resolver: zodResolver(studentSchema),
  });

  const { generateCardId } = appUtils;
  const { roles } = userManagementConstants;
  const {
    createStudentMutateAsync,
    isCreatingStudent,
    isUpdatingStudent,
    updateStudentMutateAsync,
  } = useStudent();

  const { intakes, generateIntakeOptions } = useIntake();
  const { courses, generateCourseOptions } = useCourse();

  /**
   * component functions
   */
  const onSubmit: SubmitHandler<StudentSchema> = ({ email, password }) => {
    /**
     * validation
     */
    if (cardID.trim() === "") {
      Notifications.errorNotification("Please scan the card.");
      return;
    }

    if (selectedRole.value === "") {
      Notifications.errorNotification("Please select student role.");
      return;
    }

    if (selectedCourse.value === "") {
      Notifications.errorNotification("Please select student course.");
      return;
    }

    if (selectedIntake.value === "") {
      Notifications.errorNotification("Please select student intake.");
      return;
    }

    if (selectedRole.value !== "student") {
      Notifications.errorNotification("Please select the correct role.");
      return;
    }

    isEditingStudent
      ? updateStudentMutateAsync({
          studentUuid: globalStudent?.attributes?.uuid,
          studentData: {
            email,
            password: password ? password : "email",
            role: selectedRole.value,
            physicalCardId: cardID,
            course_id: selectedCourse?.value,
            intake_id: selectedIntake?.value,
          },
        })
      : createStudentMutateAsync({
          email,
          password: password ? password : "email",
          role: selectedRole.value,
          physicalCardId: cardID,
          course_id: selectedCourse?.value,
          intake_id: selectedIntake?.value,
        });

    clearForm();
  };

  const clearForm = () => {
    reset({
      email: "",
      password: "",
    });

    setSelectedRole({ name: "", value: "" });
    setCardID("");
  };

  useEffect(() => {
    if (isEditingStudent && globalStudent) {
      reset({
        email: globalStudent?.attributes?.email,
      });

      setCardID(globalStudent?.attributes?.physicalCardId);

      setSelectedRole({
        name: globalStudent?.relationships?.role?.attributes?.name,
        value: globalStudent?.relationships?.role?.attributes?.slug,
      });

      setSelectedCourse({
        name: globalStudent?.relationships?.course?.attributes?.name,
        value: globalStudent?.relationships?.course?.id,
      });

      setSelectedIntake({
        name: globalStudent?.relationships?.intake?.attributes?.name,
        value: globalStudent?.relationships?.intake?.id,
      });
    }
  }, [isEditingStudent, globalStudent, reset]);

  return (
    <section>
      {/* header */}
      <WidgetHeader
        close={() => {
          setGlobalStudent(null);
          setIsEditingStudent(false);
          setShowCreateOrEditStudentWidget(false);
          clearForm();
        }}
        title={!isEditingStudent ? "Creating Student." : "Editing Student."}
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
              <div className="flex items-center">
                <input
                  type="text"
                  className="input peer"
                  placeholder="Card ID"
                  value={cardID}
                  onChange={(event) => setCardID(event.target.value)}
                />

                {/* <button
                  className="flex h-[38px] items-center justify-center gap-[6px] whitespace-nowrap  rounded-full bg-secondary px-4 py-2 text-[14px] text-white focus:outline-none"
                  type="button"
                  onClick={() => setCardID(generateCardId())}
                >
                  Scan
                </button> */}

                <label className="input_label">Card ID</label>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-primary">Role</span>
              <Select
                multiple={false}
                options={roles}
                select_wrapper_styles="border border-c_gray/30 rounded-[0.9rem] py-1 w-[10rem]"
                select_panel_styles="max-h-[10rem] bg-white border border-dark shadow-md"
                selected={selectedRole}
                setSelected={setSelectedRole}
                disable={true}
              />
            </div>
          </div>

          {/* course and intake */}
          <div className="flex  gap-x-2 rounded-md border border-primary/10 py-4 px-2">
            <div className="flex items-center gap-2">
              <span className="text-primary">Course</span>
              <Select
                multiple={false}
                options={generateCourseOptions(courses)}
                select_wrapper_styles="border border-c_gray/30 rounded-[0.9rem] py-1 w-[10rem]"
                select_panel_styles="max-h-[10rem] bg-white border border-dark shadow-md"
                selected={selectedCourse}
                setSelected={setSelectedCourse}
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-primary">Intake</span>
              <Select
                multiple={false}
                options={generateIntakeOptions(intakes)}
                select_wrapper_styles="border border-c_gray/30 rounded-[0.9rem] py-1 w-[10rem]"
                select_panel_styles="max-h-[10rem] bg-white border border-dark shadow-md"
                selected={selectedIntake}
                setSelected={setSelectedIntake}
              />
            </div>
          </div>

          {/* personal info */}
          <div className="border-c_dark/10 flex flex-col gap-y-5 rounded-md border py-4 px-2">
            <div className="relative">
              <input
                type="text"
                className="input peer"
                placeholder="Email"
                {...register("email", { required: true })}
              />
              <label className="input_label">Email</label>

              {errors["email"] && (
                <Error error_message={errors["email"].message} />
              )}
            </div>

            <div className="relative">
              <input
                type="password"
                className="input peer"
                placeholder="password"
                {...register("password")}
              />
              <label className="input_label">Password</label>

              {errors["password"] && (
                <Error error_message={errors["password"].message} />
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            title={
              isEditingStudent ? (
                isUpdatingStudent ? (
                  <SpinnerLoader color="fill-white" />
                ) : (
                  "Edit"
                )
              ) : isCreatingStudent ? (
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

export default CreateOrEditStudentWidget;
