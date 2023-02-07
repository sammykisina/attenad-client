import { attendanceAtoms } from "@/atoms";
import { Button, SpinnerLoader, Title, WidgetHeader } from "@/components";
import { useAttendance } from "@/hooks";
import { appUtils } from "@/utils";
import React, { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";

const RegisterStudentsToAttendanceWidget = () => {
  /**
   * component states
   */
  const [studentCard, setStudentCard] = useState("");
  const { globalAttendanceState, showRegisterStudentsToAttendanceWidgetState } =
    attendanceAtoms;
  const [globalAttendance, setGlobalAttendance] = useRecoilState(
    globalAttendanceState
  );
  const setShowRegisterStudentsToAttendanceWidget = useSetRecoilState(
    showRegisterStudentsToAttendanceWidgetState
  );

  const {
    studentCards,
    isFetchingStudentCards,
    registerStudentToAttendance,
    isRegisteringStudentToAttendance,
  } = useAttendance();
  const { getRandomStudentCard } = appUtils;

  /**
   * component functions
   */
  const scanForCard = (): any => {
    if (!isFetchingStudentCards && studentCards?.length > 0) {
      const card =
        studentCards[getRandomStudentCard(studentCards)]?.physical_card_id;
      if (card) return card;
      return scanForCard();
    }
  };

  useEffect(() => {
    if (studentCard !== "") {
      registerStudentToAttendance({
        attendanceUuid: globalAttendance?.attributes?.uuid,
        physicalCardId: studentCard,
      });

      setStudentCard("");
    }
  }, [
    studentCard,
    globalAttendance?.attributes?.uuid,
    registerStudentToAttendance,
  ]);

  return (
    <section>
      {/* header */}
      <WidgetHeader
        close={() => {
          setShowRegisterStudentsToAttendanceWidget(false);
          setGlobalAttendance(null);
        }}
        title={globalAttendance?.attributes?.name}
      />

      <section className="flex flex-col gap-6 px-2 py-3">
        <div className="flex flex-col gap-y-5 rounded-md border border-primary/10 py-4 px-2">
          <div className="relative">
            <div className="flex items-center">
              <input
                type="text"
                className="input peer"
                placeholder="Card ID"
                value={studentCard}
                onChange={(event) => setStudentCard(event.target.value)}
              />

              <Button
                title={
                  isRegisteringStudentToAttendance ? (
                    <SpinnerLoader color="fill-white" size="h-4 w-5" />
                  ) : studentCard !== "" ? (
                    <div className="relative">
                      <span>Register</span>
                      <div className="absolute -top-[5px] right-0 h-3 w-3 animate-ping rounded-full bg-secondary" />
                    </div>
                  ) : (
                    "Scan Card"
                  )
                }
                type="small"
                purpose={() => {
                  setStudentCard(scanForCard());
                }}
                disabled={isRegisteringStudentToAttendance}
              />

              <label className="input_label">Card ID</label>
            </div>
          </div>
        </div>

        {/* students */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between px-4">
            <div>
              <Title title="Students Already Registered." title_styles="pl-2" />

              <div className="flex flex-col">
                <span>
                  Intake:{" "}
                  {globalAttendance?.relationships?.intake?.attributes?.name}
                </span>

                <span>
                  Course:{" "}
                  {globalAttendance?.relationships?.course?.attributes?.name}
                </span>

                <span>
                  Module:{" "}
                  {globalAttendance?.relationships?.module?.attributes?.name}
                </span>
              </div>
            </div>

            <span
              className={`${
                globalAttendance?.relationships?.students?.length === 0 &&
                "hidden"
              } flex h-6 w-fit items-center justify-center rounded-full bg-secondary px-2  text-white`}
            >
              {globalAttendance?.relationships?.students?.length} members so
              far.
            </span>
          </div>

          <div className="flex h-[20rem] flex-col gap-3 overflow-y-scroll rounded-md border py-2 px-3">
            {globalAttendance?.relationships?.students?.length > 0 ? (
              globalAttendance?.relationships?.students?.map(
                (student: any, studentIndex: number) => (
                  <div key={studentIndex} className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border bg-primary text-white">
                      {studentIndex + 1}.
                    </span>
                    <span>{student?.attributes?.email}</span>
                    <span>{student?.attributes?.physicalCardId}</span>
                  </div>
                )
              )
            ) : (
              <div className="flex h-full items-center justify-center font-bold">
                No registered students yet.
              </div>
            )}
          </div>
        </div>
      </section>
    </section>
  );
};

export default RegisterStudentsToAttendanceWidget;
