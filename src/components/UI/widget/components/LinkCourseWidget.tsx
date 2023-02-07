import { courseAtoms } from "@/atoms";
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
import { useCourse, useModule } from "@/hooks";

const LinkCourseWidget = () => {
  /**
   * component states
   */
  const { globalCourseState, showCourseLinkingWidgetState } = courseAtoms;
  const [globalCourse, setGlobalCourse] = useRecoilState(globalCourseState);
  const setShowCourseLinkingWidget = useSetRecoilState(
    showCourseLinkingWidgetState
  );

  const [selectedModule, setSelectedModule] = useState({
    name: "",
    value: "",
    uuid: "",
  });

  const { modules, generateModulesOptions } = useModule();
  const { linkCourseToModuleMutateAsync, isLinkingCourse } = useCourse();

  /**
   * component functions
   */
  const onSubmit = () => {
    /**
     * validation
     */
    if (selectedModule.value === "") {
      Notifications.errorNotification("Please select binding module.");
      return;
    }

    linkCourseToModuleMutateAsync({
      courseUuid: globalCourse?.attributes?.uuid,
      moduleUuid: selectedModule?.uuid,
    });
  };

  useEffect(() => {
    if (globalCourse?.relationships?.modules[0]) {
      setSelectedModule({
        name: globalCourse?.relationships?.modules[0]?.attributes?.name,
        value: globalCourse?.relationships?.modules[0]?.id,
        uuid: globalCourse?.relationships?.modules[0]?.attributes?.uuid,
      });
    }
  }, [globalCourse]);

  return (
    <section>
      {/* header */}
      <WidgetHeader
        close={() => {
          setGlobalCourse(null);
          setShowCourseLinkingWidget(false);
        }}
        title={`Linking ` + globalCourse?.attributes?.name + ` to modules.`}
      />

      {/* body */}
      <section className="flex flex-col gap-6 px-2">
        <div className="flex w-full flex-col gap-4 py-3">
          {/* courses*/}
          <div className="rounded-md border border-primary/10 py-4 px-2">
            <div className="flex items-center gap-2">
              <span className="text-primary">Modules</span>
              <Select
                multiple={false}
                options={generateModulesOptions(modules)}
                select_wrapper_styles="border border-c_gray/30 rounded-[0.9rem] py-1 w-[22rem]"
                select_panel_styles="max-h-[15rem] bg-white border border-dark shadow-md"
                selected={selectedModule}
                setSelected={setSelectedModule}
              />
            </div>
          </div>

          {/* linked course */}
          <div>
            <Title title="This Course is currently linked to below modules." />

            <div className="mt-3 flex h-[5rem] items-center  justify-center  rounded-[2rem] border p-4">
              {globalCourse?.relationships?.modules[0] ? (
                <div className="w-full">
                  <InfoSummary
                    infoName={
                      globalCourse?.relationships?.modules[0]?.attributes?.name
                    }
                    infoCode={
                      globalCourse?.relationships?.modules[0]?.attributes?.code
                    }
                    infoStatus={
                      globalCourse?.relationships?.modules[0]?.attributes
                        ?.status
                    }
                  />
                </div>
              ) : (
                <div className="flex h-full items-center justify-center">
                  Not linked to any modules yet.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            title={
              isLinkingCourse ? (
                <SpinnerLoader color="fill-white" />
              ) : (
                "Link to Selected Modules"
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

export default LinkCourseWidget;
