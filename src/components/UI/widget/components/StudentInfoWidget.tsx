import { studentAtoms } from "@/atoms";
import { WidgetHeader, StatusCell, Title, ProfileImage } from "@/components";
import { appUtils } from "@/utils";
import React from "react";
import { useRecoilState, useSetRecoilState } from "recoil";

const StudentInfoWidget = () => {
  /**
   * component states
   */
  const { globalStudentState, showStudentInfoWidgetState } = studentAtoms;
  const [globalStudent, setGlobalStudent] = useRecoilState(globalStudentState);
  const setShowStudentInfoWidget = useSetRecoilState(
    showStudentInfoWidgetState
  );

  const { generateAvatar } = appUtils;

  return (
    <section>
      {/* header */}
      <WidgetHeader
        close={() => {
          setGlobalStudent(null);
          setShowStudentInfoWidget(false);
        }}
        title={globalStudent?.attributes?.physicalCardId + " Information"}
      />

      {/* body */}

      <section className="mt-5 flex flex-col gap-y-4 px-3">
        <div className="flex items-center gap-2">
          {/* profile */}
          <div className="relative flex h-[8rem] w-[8rem] items-center justify-center rounded-[2rem] border">
            {globalStudent?.attributes?.profilePictureUrl ? (
              <ProfileImage
                imageUrl={globalStudent?.attributes?.profilePictureUrl}
              />
            ) : (
              <img
                className="h-16 w-16 rounded-full"
                src={generateAvatar(
                  globalStudent?.attributes?.email,
                  "#121927",
                  "#fff",
                  true
                )}
                alt=""
              />
            )}

            <span className="absolute bottom-[4px] left-[1rem]">
              <StatusCell value={globalStudent?.attributes?.status} />
            </span>

            <span className="absolute top-[2px] right-[1rem]">
              created by {globalStudent?.attributes?.createdBy}
            </span>
          </div>

          {/* personal info */}
          <div className="flex flex-1 flex-col rounded-md border p-2">
            <span className=" first-letter:capitalize">
              {globalStudent?.attributes?.email}
            </span>

            <span className=" text-primary/50">
              {globalStudent?.relationships?.role?.attributes?.name}
            </span>
          </div>
        </div>

        {/* course */}
        <div className="rounded-md px-3 py-2">
          <Title title="Course" />

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <span>
                {globalStudent?.relationships?.course?.attributes?.name}
              </span>

              <span className="text-primary/50">
                {globalStudent?.relationships?.course?.attributes?.code}
              </span>
            </div>

            <span>
              <StatusCell
                value={globalStudent?.relationships?.course?.attributes?.status}
              />
            </span>
          </div>
        </div>

        {/* intake */}
        <div className="rounded-md px-3 py-2">
          <Title title="Intake" />

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <span>
                {globalStudent?.relationships?.intake?.attributes?.name}
              </span>

              <span className="text-primary/50">
                {globalStudent?.relationships?.intake?.attributes?.code}
              </span>
            </div>

            <span>
              <StatusCell
                value={globalStudent?.relationships?.intake?.attributes?.status}
              />
            </span>
          </div>
        </div>
      </section>
    </section>
  );
};

export default StudentInfoWidget;
