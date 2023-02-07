import { courseAtoms } from "@/atoms";
import {
  Button,
  CreateOrEditCourseWidget,
  LinkCourseWidget,
  SpinnerLoader,
  TabTitle,
  Table,
  Widget,
} from "@/components";
import { useCourse } from "@/hooks";
import { useRecoilState, useRecoilValue } from "recoil";

const Course = () => {
  /**
   * component states
   */
  const { showCreateOrEditCourseWidgetState, showCourseLinkingWidgetState } =
    courseAtoms;
  const [showCreateOrEditCourseWidget, setShowCreateOrEditCourseWidget] =
    useRecoilState(showCreateOrEditCourseWidgetState);
  const showCourseLinkingWidget = useRecoilValue(showCourseLinkingWidgetState);

  const {
    isFetchingCourses,
    courses,
    modifyCourseDataForCourseTable,
    courseTableColumns,
  } = useCourse();

  return (
    <section className="W h-full xs:h-[31rem] lg:h-[35rem]">
      {/* title */}
      <div className="flex  justify-between">
        <TabTitle title="Courses." />
        <Button
          title="Create A Course"
          type="medium"
          intent="primary"
          purpose={() => setShowCreateOrEditCourseWidget(true)}
        />
      </div>

      {/* the  body */}
      <section className="mt-5">
        {isFetchingCourses ? (
          <div className="flex h-full items-center justify-center">
            <SpinnerLoader color="fill-primary" />
          </div>
        ) : courses.length > 0 ? (
          <Table
            data={modifyCourseDataForCourseTable(courses)}
            columns={courseTableColumns}
            show_filters={true}
            table_height="h-[32rem] xs:h-[23rem] lg:h-[27rem]"
          />
        ) : (
          <div className="flex h-[32rem] flex-col items-center justify-center gap-3 rounded-[2rem] border xs:h-[26.5rem] lg:h-[31rem]">
            No Courses Yet.
            <Button
              title="Create"
              type="medium"
              intent="primary"
              purpose={() => setShowCreateOrEditCourseWidget(true)}
            />
          </div>
        )}
      </section>

      <Widget
        widgetState={showCreateOrEditCourseWidget}
        component={<CreateOrEditCourseWidget />}
        widgetStyles="w-[90vw] h-fit"
      />

      <Widget
        widgetState={showCourseLinkingWidget}
        component={<LinkCourseWidget />}
        widgetStyles="w-[90vw] h-fit"
      />
    </section>
  );
};

export default Course;
