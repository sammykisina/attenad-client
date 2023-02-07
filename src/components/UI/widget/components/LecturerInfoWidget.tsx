import { lecturerAtoms } from "@/atoms";
import {
  WidgetHeader,
  StatusCell,
  Title,
  InfoSummary,
  ProfileImage,
} from "@/components";
import { appUtils } from "@/utils";
import React from "react";
import { useRecoilState, useSetRecoilState } from "recoil";

const LecturerInfoWidget = () => {
  /**
   * component states
   */
  const { globalLecturerState, showLecturerInfoWidgetState } = lecturerAtoms;
  const [globalLecturer, setGlobalLecturer] =
    useRecoilState(globalLecturerState);
  const setShowLecturerInfoWidget = useSetRecoilState(
    showLecturerInfoWidgetState
  );

  const { generateAvatar } = appUtils;

  return (
    <section>
      {/* header */}
      <WidgetHeader
        close={() => {
          setGlobalLecturer(null);
          setShowLecturerInfoWidget(false);
        }}
        title={globalLecturer?.attributes?.email + " Information"}
      />

      {/* body */}
      <section className="mt-5 flex flex-col gap-y-4 px-3">
        <div className="flex items-center gap-2">
          {/* profile */}
          <div className="relative flex h-[8rem] w-[8rem] items-center justify-center rounded-[2rem] border">
            {globalLecturer?.attributes?.profilePictureUrl ? (
              <ProfileImage
                imageUrl={globalLecturer?.attributes?.profilePictureUrl}
              />
            ) : (
              <img
                className="h-16 w-16 rounded-full"
                src={generateAvatar(
                  globalLecturer?.attributes?.email,
                  "#121927",
                  "#fff",
                  true
                )}
                alt=""
              />
            )}

            <span className="absolute bottom-[4px] left-[1rem]">
              <StatusCell value={globalLecturer?.attributes?.status} />
            </span>

            <span className="absolute top-[2px] right-[1rem]">
              created by {globalLecturer?.attributes?.createdBy}
            </span>
          </div>

          {/* personal info */}
          <div className="flex flex-1 flex-col rounded-md border p-2">
            <span className=" first-letter:capitalize">
              {globalLecturer?.attributes?.email}
            </span>

            <span className=" text-primary/50">
              {globalLecturer?.relationships?.role?.attributes?.name}
            </span>
          </div>
        </div>

        {/* courses */}
        <div className="rounded-md border px-3 py-2">
          <Title title="Courses" />

          {globalLecturer?.relationships?.courses?.map(
            (course: any, courseIndex: number) => (
              <InfoSummary
                key={courseIndex}
                infoName={course?.attributes?.name}
                infoCode={course?.attributes?.code}
                infoStatus={course?.attributes?.status}
              />
            )
          )}
        </div>

        {/* intakes */}
        <div className="rounded-md border px-3 py-2">
          <Title title="Intakes" />

          {globalLecturer?.relationships?.intakes?.map(
            (intake: any, intakeIndex: number) => (
              <InfoSummary
                key={intakeIndex}
                infoName={intake?.attributes?.name}
                infoCode={intake?.attributes?.code}
                infoStatus={intake?.attributes?.status}
              />
            )
          )}
        </div>

        {/* modules */}
        <div className="rounded-md border px-3 py-2">
          <Title title="Modules" />

          {globalLecturer?.relationships?.modules?.map(
            (module: any, moduleIndex: number) => (
              <InfoSummary
                key={moduleIndex}
                infoName={module?.attributes?.name}
                infoCode={module?.attributes?.code}
                infoStatus={module?.attributes?.status}
              />
            )
          )}
        </div>
      </section>
    </section>
  );
};

export default LecturerInfoWidget;
