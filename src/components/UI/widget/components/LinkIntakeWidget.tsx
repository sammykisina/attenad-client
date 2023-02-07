import { intakeAtoms } from "@/atoms";
import {
  Button,
  InfoSummary,
  Notifications,
  Select,
  SpinnerLoader,
  Title,
  WidgetHeader,
} from "@/components";
import React, { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { appUtils } from "@/utils";
import { useIntake, useCourse } from "@/hooks";

const LinkIntakeWidget = () => {
  /**
   * component states
   */
  const { globalIntakeState, showIntakeLinkingWidgetState } = intakeAtoms;
  const [globalIntake, setGlobalIntake] = useRecoilState(globalIntakeState);
  const setShowIntakeLinkingWidget = useSetRecoilState(
    showIntakeLinkingWidgetState
  );

  const [selectedCourse, setSelectedCourse] = useState({
    name: "",
    value: "",
    uuid: "",
  });

  const { courses, generateCourseOptions } = useCourse();
  const { linkIntakeToCourseMutateAsync, isLinkingIntake } = useIntake();

  console.log("selectedCourse", selectedCourse);

  /**
   * component functions
   */
  const onSubmit = () => {
    /**
     * validation
     */
    if (selectedCourse.value === "") {
      Notifications.errorNotification("Please select binding course.");
      return;
    }
    linkIntakeToCourseMutateAsync({
      intakeUuid: globalIntake?.attributes?.uuid,
      courseUuid: selectedCourse?.uuid,
    });
  };

  useEffect(() => {
    if (globalIntake?.relationships?.courses[0]) {
      setSelectedCourse({
        name: globalIntake?.relationships?.courses[0]?.attributes?.name,
        value: globalIntake?.relationships?.courses[0]?.id,
        uuid: globalIntake?.relationships?.courses[0]?.attributes?.uuid,
      });
    }
  }, [globalIntake]);

  return (
    <section>
      {/* header */}
      <WidgetHeader
        close={() => {
          setGlobalIntake(null);
          setShowIntakeLinkingWidget(false);
        }}
        title={`Linking ` + globalIntake?.attributes?.name + ` to course.`}
      />

      {/* body */}
      <section className="flex flex-col gap-6 px-2">
        <div className="flex w-full flex-col gap-4 py-3">
          {/* courses*/}
          <div className="rounded-md border border-primary/10 py-4 px-2">
            <div className="flex items-center gap-2">
              <span className="text-primary">Courses</span>
              <Select
                multiple={false}
                options={generateCourseOptions(courses)}
                select_wrapper_styles="border border-c_gray/30 rounded-[0.9rem] py-1 w-full"
                select_panel_styles="max-h-[15rem] bg-white border border-dark shadow-md"
                selected={selectedCourse}
                setSelected={setSelectedCourse}
              />
            </div>
          </div>

          {/* linked course */}
          <div>
            <Title title="This Intake is currently linked to below course." />

            <div className="mt-3 flex h-[5rem] items-center  justify-center  rounded-[2rem] border p-4">
              {globalIntake?.relationships?.courses[0] ? (
                <div className="w-full">
                  <InfoSummary
                    infoName={
                      globalIntake?.relationships?.courses[0]?.attributes?.name
                    }
                    infoCode={
                      globalIntake?.relationships?.courses[0]?.attributes?.code
                    }
                    infoStatus={
                      globalIntake?.relationships?.courses[0]?.attributes
                        ?.status
                    }
                  />
                </div>
              ) : (
                <div className="flex h-full items-center justify-center">
                  Not linked to any course yet.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            title={
              isLinkingIntake ? (
                <SpinnerLoader color="fill-white" />
              ) : (
                "Link to Selected Course"
              )
            }
            intent="primary"
            purpose={onSubmit}
          />
        </div>
      </section>
    </section>
  );
};

export default LinkIntakeWidget;
