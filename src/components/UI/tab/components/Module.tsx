import { moduleAtoms } from "@/atoms";
import {
  Button,
  CreateOrEditModuleWidget,
  SpinnerLoader,
  TabTitle,
  Table,
  Widget,
} from "@/components";
import { useModule } from "@/hooks";
import { useRecoilState } from "recoil";

const Module = () => {
  /**
   * component states
   */
  const { showCreateOrEditModuleWidgetState } = moduleAtoms;
  const [showCreateOrEditModuleWidget, setShowCreateOrEditModuleWidget] =
    useRecoilState(showCreateOrEditModuleWidgetState);

  const {
    isFetchingModules,
    modules,
    modifyModuleDataForModuleTable,
    moduleTableColumns,
  } = useModule();

  return (
    <section className="W h-full xs:h-[31rem] lg:h-[35rem]">
      {/* title */}
      <div className="flex  justify-between">
        <TabTitle title="Modules." />
        <Button
          title="Create An Module"
          type="medium"
          intent="primary"
          purpose={() => setShowCreateOrEditModuleWidget(true)}
        />
      </div>

      {/* the  body */}
      <section className="mt-5">
        {isFetchingModules ? (
          <div className="flex h-full items-center justify-center">
            <SpinnerLoader color="fill-primary" />
          </div>
        ) : modules.length > 0 ? (
          <Table
            data={modifyModuleDataForModuleTable(modules)}
            columns={moduleTableColumns}
            show_filters={true}
            table_height="h-[32rem] xs:h-[23rem] lg:h-[27rem]"
          />
        ) : (
          <div className="flex h-[32rem] flex-col items-center justify-center gap-3 rounded-[2rem] border xs:h-[26.5rem] lg:h-[31rem]">
            No Module Yet.
            <Button
              title="Create"
              type="medium"
              intent="primary"
              purpose={() => setShowCreateOrEditModuleWidget(true)}
            />
          </div>
        )}
      </section>

      <Widget
        widgetState={showCreateOrEditModuleWidget}
        component={<CreateOrEditModuleWidget />}
        widgetStyles="w-[90vw] h-fit"
      />
    </section>
  );
};

export default Module;
