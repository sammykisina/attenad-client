import { attendanceAtoms } from "@/atoms";
import { Button, Notifications, Select, WidgetHeader } from "@/components";
import { attendanceConstants } from "@/constants";
import { useAttendance, useAuth } from "@/hooks";
import React, { useState } from "react";
import { useSetRecoilState } from "recoil";

const CreateAttendanceWidget = () => {
  /**
   * component states
   */
  const { globalAttendanceState, showCreateAttendanceWidgetState } =
    attendanceAtoms;
  const setShowCreateAttendanceWidget = useSetRecoilState(
    showCreateAttendanceWidgetState
  );
  const [selectedModule, setSelectedModule] = useState({
    name: "",
    value: "",
  });
  const [selectedWeek, setSelectedWeek] = useState({
    name: "",
    value: "",
  });
  const [selectedContentDeliveryType, setSelectedContentDeliveryType] =
    useState({
      name: "",
      value: "",
    });
  const [selectedTutorialGroup, setSelectedTutorialGroup] = useState({
    name: "",
    value: "",
  });

  const {
    generateModulesForAttendanceOptions,
    intakes,
    createAttendanceMutateAsync,
    isCreatingAttendance,
  } = useAttendance();
  const { weeks, educationDeliveryType, tutorialGroups } = attendanceConstants;

  const { user } = useAuth();

  /**
   * component functions
   */
  const onSubmit = () => {
    console.log(
      selectedModule,
      selectedWeek,
      selectedContentDeliveryType,
      selectedTutorialGroup
    );

    // validation
    if (selectedModule.value === "") {
      Notifications.errorNotification("Please select module.");
      return;
    }

    if (selectedWeek.value === "") {
      Notifications.errorNotification("Please select attendance week.");
      return;
    }

    if (selectedContentDeliveryType.value === "") {
      Notifications.errorNotification(
        "Please select the content delivery method."
      );
      return;
    }

    if (
      selectedContentDeliveryType.value === "tutorial" &&
      selectedTutorialGroup.value === ""
    ) {
      Notifications.errorNotification("Please select the tutorial group.");
      return;
    }

    selectedContentDeliveryType.value === "tutorial"
      ? createAttendanceMutateAsync({
          attendanceData: {
            name: selectedModule?.name,
            contentDeliveryType: selectedContentDeliveryType?.name,
            week: selectedWeek?.value,
            intakeId: selectedModule?.intakeId,
            courseId: selectedModule?.courseId,
            moduleId: selectedModule?.moduleId,
            tutorialGroup: selectedTutorialGroup.value,
          },
          lecturerUuid: user?.uuid || "",
        })
      : createAttendanceMutateAsync({
          attendanceData: {
            name: selectedModule?.name,
            contentDeliveryType: selectedContentDeliveryType?.name,
            week: selectedWeek?.value,
            intakeId: selectedModule?.intakeId,
            courseId: selectedModule?.courseId,
            moduleId: selectedModule?.moduleId,
          },
          lecturerUuid: user?.uuid || "",
        });
  };

  return (
    <section>
      {/* header */}
      <WidgetHeader
        close={() => {
          setShowCreateAttendanceWidget(false);
          // clearForm();
        }}
        title="Create Attendance"
      />

      {/* body */}
      <section className="flex flex-col gap-6 px-2">
        <div className="flex w-full flex-col gap-4 py-3">
          <div className="rounded-md border border-primary/10 py-4 px-2">
            <div className="flex items-center gap-2">
              <span className="text-primary">Modules</span>
              <Select
                multiple={false}
                options={generateModulesForAttendanceOptions(intakes)}
                select_wrapper_styles="border border-c_gray/30 rounded-[0.9rem] py-1 w-[22rem]"
                select_panel_styles="max-h-[15rem] bg-white border border-dark shadow-md"
                selected={selectedModule}
                setSelected={setSelectedModule}
              />
            </div>
          </div>

          <div className="flex gap-2 rounded-md border border-primary/10 py-4 px-2">
            <div className="flex items-center gap-2">
              <span className="text-primary">Week</span>
              <Select
                multiple={false}
                options={weeks}
                select_wrapper_styles="border border-c_gray/30 rounded-[0.9rem] py-1 w-[10rem] "
                select_panel_styles={`bg-white border border-dark shadow-md ${
                  selectedContentDeliveryType.value === "tutorial"
                    ? "max-h-[15rem]"
                    : "max-h-[6.5rem]"
                }`}
                selected={selectedWeek}
                setSelected={setSelectedWeek}
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-primary">Type</span>
              <Select
                multiple={false}
                options={educationDeliveryType}
                select_wrapper_styles="border border-c_gray/30 rounded-[0.9rem] py-1 w-[10rem]"
                select_panel_styles="max-h-[15rem] bg-white border border-dark shadow-md"
                selected={selectedContentDeliveryType}
                setSelected={setSelectedContentDeliveryType}
              />
            </div>
          </div>

          <div
            className={`rounded-md border border-primary/10 py-4 px-2 ${
              selectedContentDeliveryType.value !== "tutorial" && "hidden"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="whitespace-nowrap text-primary">
                Tutorial Group
              </span>
              <Select
                multiple={false}
                options={tutorialGroups}
                select_wrapper_styles="border border-c_gray/30 rounded-[0.9rem] py-1 w-[22rem]"
                select_panel_styles="max-h-[6.5rem] bg-white border border-dark shadow-md"
                selected={selectedTutorialGroup}
                setSelected={setSelectedTutorialGroup}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button title="Create" intent="primary" purpose={onSubmit} />
        </div>
      </section>
    </section>
  );
};

export default CreateAttendanceWidget;
