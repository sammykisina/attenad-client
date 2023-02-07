import React, { useEffect } from "react";
import {
  Button,
  CreateOrEditStudentWidget,
  SpinnerLoader,
  StudentInfoWidget,
  TabTitle,
  Table,
  Widget,
} from "@/components";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { studentAtoms } from "@/atoms";
import { useRecoilState, useRecoilValue } from "recoil";
import { useStudent } from "@/hooks";

const Students = () => {
  /**
   * page states
   */
  const router = useRouter();
  const { showCreateOrEditStudentWidgetState, showStudentInfoWidgetState } =
    studentAtoms;
  const [showCreateOrEditStudentWidget, setShowCreateOrEditStudentWidget] =
    useRecoilState(showCreateOrEditStudentWidgetState);

  const showStudentInfoWidget = useRecoilValue(showStudentInfoWidgetState);

  const {
    students,
    isFetchingStudents,
    modifyStudentDataForStudentsTable,
    studentsTableColumns,
  } = useStudent();

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
        <TabTitle title="Manage Students" />

        <Button
          title="Create A Student"
          type="medium"
          intent="primary"
          purpose={() => setShowCreateOrEditStudentWidget(true)}
        />
      </div>

      {/* the  body */}
      <section className="mt-5">
        {isFetchingStudents ? (
          <div className="flex h-[32rem]  items-center  justify-center xs:h-[27.5rem] lg:h-[28.5rem]">
            <SpinnerLoader color="fill-primary" />
          </div>
        ) : students.length > 0 ? (
          <Table
            data={modifyStudentDataForStudentsTable(students)}
            columns={studentsTableColumns}
            show_filters={true}
            table_height="h-[32rem] xs:h-[27.5rem] lg:h-[28.5rem]"
          />
        ) : (
          <div className="flex h-[32rem] flex-col items-center justify-center gap-3 rounded-[2rem] border xs:h-[27.5rem]  lg:h-[28.5rem]">
            No Students Yet.
          </div>
        )}
      </section>

      <Widget
        widgetState={showCreateOrEditStudentWidget}
        component={<CreateOrEditStudentWidget />}
        widgetStyles="w-[90vw] h-fit"
      />

      <Widget
        widgetState={showStudentInfoWidget}
        component={<StudentInfoWidget />}
        widgetStyles="w-[90vw] h-fit"
      />
    </section>
  );
};

export default Students;
