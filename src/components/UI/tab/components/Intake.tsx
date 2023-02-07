import { intakeAtoms } from "@/atoms";
import {
  Button,
  CreateOrEditIntakeWidget,
  LinkIntakeWidget,
  SpinnerLoader,
  TabTitle,
  Table,
  Widget,
} from "@/components";
import { useIntake } from "@/hooks";
import { useRecoilState } from "recoil";

const Intake = () => {
  /**
   * component states
   */
  const { showCreateOrEditIntakeWidgetState, showIntakeLinkingWidgetState } =
    intakeAtoms;
  const [showCreateOrEditIntakeWidget, setShowCreateOrEditIntakeWidget] =
    useRecoilState(showCreateOrEditIntakeWidgetState);
  const [showIntakeLinkingWidget, setShowIntakeLinkingWidget] = useRecoilState(
    showIntakeLinkingWidgetState
  );

  const {
    isFetchingIntakes,
    intakes,
    modifyIntakeDataForIntakesTable,
    intakeTableColumns,
  } = useIntake();

  return (
    <section className="W h-full xs:h-[31rem] lg:h-[35rem]">
      {/* title */}
      <div className="flex  justify-between">
        <TabTitle title="Intakes." />
        <Button
          title="Create An Intake"
          type="medium"
          intent="primary"
          purpose={() => setShowCreateOrEditIntakeWidget(true)}
        />
      </div>

      {/* the  body */}
      <section className="mt-5">
        {isFetchingIntakes ? (
          <div className="flex h-full items-center justify-center">
            <SpinnerLoader color="fill-primary" />
          </div>
        ) : intakes.length > 0 ? (
          <Table
            data={modifyIntakeDataForIntakesTable(intakes)}
            columns={intakeTableColumns}
            show_filters={true}
            table_height="h-[32rem] xs:h-[23rem] lg:h-[27rem]"
          />
        ) : (
          <div className="flex h-[32rem] flex-col items-center justify-center gap-3 rounded-[2rem] border xs:h-[26.5rem] lg:h-[31rem]">
            No Intakes Yet.
            <Button
              title="Create"
              type="medium"
              intent="primary"
              purpose={() => setShowCreateOrEditIntakeWidget(true)}
            />
          </div>
        )}
      </section>

      <Widget
        widgetState={showCreateOrEditIntakeWidget}
        component={<CreateOrEditIntakeWidget />}
        widgetStyles="w-[90vw] h-fit"
      />

      <Widget
        widgetState={showIntakeLinkingWidget}
        component={<LinkIntakeWidget />}
        widgetStyles="w-[90vw] h-fit"
      />
    </section>
  );
};

export default Intake;
