import { lecturerAtoms } from "@/atoms";
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
import { useIntake, useCourse, useLecturer, useModule } from "@/hooks";

const CreateOrEditLecturerWidget = () => {
  /**
   * component states
   */
  const {
    globalLecturerState,
    isEditingLecturerState,
    showCreateOrEditLecturerWidgetState,
  } = lecturerAtoms;
  const [isEditingLecturer, setIsEditingLecturer] = useRecoilState(
    isEditingLecturerState
  );
  const [globalLecturer, setGlobalLecturer] =
    useRecoilState(globalLecturerState);
  const setShowCreateOrEditLecturerWidget = useSetRecoilState(
    showCreateOrEditLecturerWidgetState
  );

  const [selectedRole, setSelectedRole] = useState({ name: "", value: "" });
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [selectedIntakes, setSelectedIntakes] = useState([]);
  const [selectedModules, setSelectedModules] = useState([]);

  const { lecturerSchema } = usersManagement;
  type LecturerSchema = z.infer<typeof lecturerSchema>;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LecturerSchema>({
    resolver: zodResolver(lecturerSchema),
  });

  const { roles } = userManagementConstants;
  const {
    createLecturerMutateAsync,
    isCreatingLecturer,
    updateLecturerMutateAsync,
    isUpdatingLecturer,
  } = useLecturer();

  const { intakes, generateIntakeOptions } = useIntake();
  const { courses, generateCourseOptions } = useCourse();
  const { modules, generateModulesOptions } = useModule();

  const { generateACleanSet } = appUtils;

  /**
   * component functions
   */
  const onSubmit: SubmitHandler<LecturerSchema> = ({ email, password }) => {
    /**
     * validation
     */
    if (selectedRole.value === "") {
      Notifications.errorNotification("Please select lecturer role.");
      return;
    }

    if (selectedRole.value !== "lecturer") {
      Notifications.errorNotification("Please select the correct role.");
      return;
    }

    if (selectedCourses.length === 0) {
      Notifications.errorNotification("Please select lecturer courses.");
      return;
    }

    if (selectedIntakes.length === 0) {
      Notifications.errorNotification("Please select lecturer intakes.");
      return;
    }

    if (selectedModules.length === 0) {
      Notifications.errorNotification("Please select lecturer modules.");
      return;
    }

    isEditingLecturer
      ? updateLecturerMutateAsync({
          lecturerUuid: globalLecturer?.attributes?.uuid,
          lecturerData: {
            email,
            role: selectedRole.value,
            password: password ? password : email,
            courses: generateACleanSet(selectedCourses),
            intakes: generateACleanSet(selectedIntakes),
            modules: generateACleanSet(selectedModules),
          },
        })
      : createLecturerMutateAsync({
          email,
          role: selectedRole.value,
          password: password ? password : email,
          courses: generateACleanSet(selectedCourses),
          intakes: generateACleanSet(selectedIntakes),
          modules: generateACleanSet(selectedModules),
        });

    clearForm();
  };

  const clearForm = () => {
    reset({
      email: "",
      password: "",
    });

    setSelectedRole({ name: "", value: "" });
    setSelectedCourses([]);
    setSelectedIntakes([]);
    setSelectedModules([]);
  };

  useEffect(() => {
    if (isEditingLecturer && globalLecturer) {
      reset({
        email: globalLecturer?.attributes?.email,
      });

      setSelectedRole({
        name: globalLecturer?.relationships?.role?.attributes?.name,
        value: globalLecturer?.relationships?.role?.attributes?.slug,
      });

      setSelectedCourses(
        generateCourseOptions(globalLecturer?.relationships?.courses)
      );

      setSelectedIntakes(
        generateIntakeOptions(globalLecturer?.relationships?.intakes)
      );

      setSelectedModules(
        generateIntakeOptions(globalLecturer?.relationships?.modules)
      );
    }
  }, [isEditingLecturer, globalLecturer, reset]);

  return (
    <section>
      {/* header */}
      <WidgetHeader
        close={() => {
          setGlobalLecturer(null);
          setIsEditingLecturer(false);
          setShowCreateOrEditLecturerWidget(false);
          clearForm();
        }}
        title={!isEditingLecturer ? "Creating Lecturer." : "Editing Lecturer."}
      />

      {/* body */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 px-2"
      >
        <div className="flex  w-full flex-col gap-4 overflow-y-scroll py-3 scrollbar-hide">
          {/* roles and card info */}
          <div className="flex flex-col gap-y-5 rounded-md border border-primary/10 py-4 px-2">
            <div className="flex items-center gap-2">
              <span className="text-primary">Role</span>
              <Select
                multiple={false}
                options={roles}
                select_wrapper_styles="border  rounded-[0.9rem] py-1 w-[10rem]"
                select_panel_styles="max-h-[10rem] bg-white border  shadow-md"
                selected={selectedRole}
                setSelected={setSelectedRole}
              />
            </div>
          </div>

          {/* course and intake */}
          <div className="grid grid-cols-2 gap-y-4  gap-x-2 rounded-md border border-primary/10 py-4 px-2">
            <div className="flex items-center gap-2">
              <span className="text-primary">Courses</span>
              <Select
                multiple={true}
                options={generateCourseOptions(courses)}
                select_wrapper_styles="border  rounded-[0.9rem] py-1 w-[10rem]"
                select_panel_styles="max-h-[10rem] bg-white border  shadow-md"
                selected={selectedCourses}
                setSelected={setSelectedCourses}
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-primary">Intakes</span>
              <Select
                multiple={true}
                options={generateIntakeOptions(intakes)}
                select_wrapper_styles="border  rounded-[0.9rem] py-1 w-[10rem]"
                select_panel_styles="max-h-[10rem] bg-white border shadow-md"
                selected={selectedIntakes}
                setSelected={setSelectedIntakes}
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-primary">Modules</span>
              <Select
                multiple={true}
                options={generateModulesOptions(modules)}
                select_wrapper_styles="border rounded-[0.9rem] py-1 w-[10rem]"
                select_panel_styles="max-h-[10rem] bg-white border  shadow-md"
                selected={selectedModules}
                setSelected={setSelectedModules}
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
              isEditingLecturer ? (
                isUpdatingLecturer ? (
                  <SpinnerLoader color="fill-white" />
                ) : (
                  "Edit"
                )
              ) : isCreatingLecturer ? (
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

export default CreateOrEditLecturerWidget;
