import React, { useEffect } from "react";
import {
  Button,
  CreateOrEditLecturerWidget,
  CreateOrEditStudentWidget,
  LecturerInfoWidget,
  SpinnerLoader,
  StudentInfoWidget,
  TabTitle,
  Table,
  Widget,
} from "@/components";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { lecturerAtoms } from "@/atoms";
import { useRecoilState, useRecoilValue } from "recoil";
import { useLecturer } from "@/hooks";

const Lecturers = () => {
  /**
   * page states
   */
  const router = useRouter();
  const { showCreateOrEditLecturerWidgetState, showLecturerInfoWidgetState } =
    lecturerAtoms;
  const [showCreateOrEditLecturerWidget, setShowCreateOrEditLecturerWidget] =
    useRecoilState(showCreateOrEditLecturerWidgetState);

  const showLecturerInfoWidget = useRecoilValue(showLecturerInfoWidgetState);

  const {
    lecturers,
    isFetchingLecturers,
    modifyLecturerDataForLecturersTable,
    lecturerTableColumns,
  } = useLecturer();

  /**
   * page functions
   */
  useEffect(() => {
    if (Cookies.get("token") === "" || Cookies.get("token") === undefined) {
      router.push("/auth/login");
    }
  }, []);

  return (
    <section className="h-full">
      <div className="flex items-center justify-between">
        {/* title */}
        <TabTitle title="Manage Staff" />

        <Button
          title="Create Staff"
          type="medium"
          intent="primary"
          purpose={() => setShowCreateOrEditLecturerWidget(true)}
        />
      </div>

      {/* the  body */}
      <section className="mt-5">
        {isFetchingLecturers ? (
          <div className="flex h-[32rem]  items-center  justify-center xs:h-[27.5rem] lg:h-[28.5rem]">
            <SpinnerLoader color="fill-primary" />
          </div>
        ) : lecturers.length > 0 ? (
          <Table
            data={modifyLecturerDataForLecturersTable(lecturers)}
            columns={lecturerTableColumns}
            show_filters={true}
            table_height="h-[32rem] xs:h-[27.5rem] lg:h-[28.5rem]"
          />
        ) : (
          <div className="flex h-[32rem] flex-col items-center justify-center gap-3 rounded-[2rem] border xs:h-[27.5rem]  lg:h-[28.5rem]">
            No Staff Yet.
          </div>
        )}
      </section>

      <Widget
        widgetState={showCreateOrEditLecturerWidget}
        component={<CreateOrEditLecturerWidget />}
        widgetStyles="w-[90vw] h-fit"
      />

      <Widget
        widgetState={showLecturerInfoWidget}
        component={<LecturerInfoWidget />}
        widgetStyles="w-[90vw] h-fit"
      />
    </section>
  );
};

export default Lecturers;
