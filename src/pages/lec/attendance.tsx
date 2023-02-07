import { attendanceAtoms } from "@/atoms";
import {
  Button,
  CreateAttendanceWidget,
  RegisterStudentsToAttendanceWidget,
  SpinnerLoader,
  TabTitle,
  Table,
  Widget,
} from "@/components";
import { useAttendance } from "@/hooks";
import { useRecoilState, useRecoilValue } from "recoil";

const Attendance = () => {
  /**
   * page states
   */

  const {
    globalAttendanceState,
    showCreateAttendanceWidgetState,
    showRegisterStudentsToAttendanceWidgetState,
  } = attendanceAtoms;
  const [showCreateAttendanceWidget, setShowCreateAttendanceWidget] =
    useRecoilState(showCreateAttendanceWidgetState);
  const showRegisterStudentsToAttendanceWidget = useRecoilValue(
    showRegisterStudentsToAttendanceWidgetState
  );

  const {
    attendances,
    isFetchingAttendances,
    modifyAttendanceDataForAttendancesTable,
    attendanceTableColumns,
  } = useAttendance();

  return (
    <section className="h-full">
      <div className="flex items-center justify-between">
        {/* title */}
        <TabTitle title="Manage Attendances" />

        <Button
          title="Create Attendance"
          type="medium"
          intent="primary"
          purpose={() => setShowCreateAttendanceWidget(true)}
        />
      </div>

      {/* the  body */}
      <section className="mt-5">
        {isFetchingAttendances ? (
          <div className="flex h-[32rem]  items-center  justify-center xs:h-[27.5rem] lg:h-[28.5rem]">
            <SpinnerLoader color="fill-primary" />
          </div>
        ) : attendances?.length > 0 ? (
          <Table
            data={modifyAttendanceDataForAttendancesTable(attendances)}
            columns={attendanceTableColumns}
            show_filters={true}
            table_height="h-[32rem] xs:h-[27.5rem] lg:h-[28.5rem]"
          />
        ) : (
          <div className="flex h-[32rem] flex-col items-center justify-center gap-3 rounded-[2rem] border xs:h-[27.5rem]  lg:h-[28.5rem]">
            You have not created any attendance Yet.
          </div>
        )}
      </section>

      <Widget
        widgetState={showCreateAttendanceWidget}
        component={<CreateAttendanceWidget />}
        widgetStyles="w-[90vw] h-fit"
      />

      <Widget
        widgetState={showRegisterStudentsToAttendanceWidget}
        component={<RegisterStudentsToAttendanceWidget />}
        widgetStyles="w-[90vw] h-fit"
      />
    </section>
  );
};

export default Attendance;
