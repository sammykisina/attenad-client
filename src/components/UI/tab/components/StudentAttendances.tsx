import React from "react";
import TabTitle from "../TabTitle";
import { useAttendance, useAuth } from "@/hooks";
import SpinnerLoader from "src/components/reusable/SpinnerLoader";
import Table from "../../table/Table";

const StudentAttendances = () => {
  /**
   * component states
   */
  const { profile, isFetchingProfile } = useAuth();
  const {
    studentAttendanceTableColumns,
    modifyAttendanceDataForAttendancesTable,
  } = useAttendance();

  return (
    <section className="W h-full xs:h-[31rem] lg:h-[35rem]">
      {/* title */}
      <TabTitle title="Your Attendances." />

      {/* the  body */}
      <section className="mt-5">
        {isFetchingProfile ? (
          <div className="flex h-full items-center justify-center">
            <SpinnerLoader color="fill-primary" />
          </div>
        ) : profile?.relationships?.attendances?.length > 0 ? (
          <Table
            data={modifyAttendanceDataForAttendancesTable(
              profile?.relationships?.attendances
            )}
            columns={studentAttendanceTableColumns}
            show_filters={true}
            table_height="h-[32rem] xs:h-[23rem] lg:h-[27rem]"
          />
        ) : (
          <div className="flex h-[32rem] flex-col items-center justify-center gap-3 rounded-[2rem] border xs:h-[26.5rem] lg:h-[31rem]">
            No Module Yet.
          </div>
        )}
      </section>
    </section>
  );
};

export default StudentAttendances;
