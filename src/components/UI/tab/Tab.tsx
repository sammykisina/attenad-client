import { Icon } from "@/components";
import type { TabsData } from "src/types/typings.t";
import type { FC } from "react";

interface TabProps {
  tabsData: TabsData[];
  tabsBodyStyles: string;
  iconsOnlyTabs?: boolean;
  iconsOnlyTabsStyles?: string;
  labelsOnlyTabsStyles?: string;
  tabsContentHeight: string;
  index: number;
  setIndex: (index: number) => void;
}

const Tab: FC<TabProps> = ({
  tabsBodyStyles,
  tabsContentHeight,
  tabsData,
  iconsOnlyTabs,
  iconsOnlyTabsStyles,
  labelsOnlyTabsStyles,
  index,
  setIndex,
}) => {
  /**
   * Component states
   */
  const { content } = tabsData[index];

  return (
    <section>
      <section className={`${tabsBodyStyles}`}>
        {/* Tab Btns */}
        <section
          className={`duration-300 ${
            iconsOnlyTabs ? iconsOnlyTabsStyles : labelsOnlyTabsStyles
          }`}
        >
          {tabsData.map(
            (singleTabsData: TabsData, singleTabsDataIndex: number) =>
              singleTabsData ? (
                <Icon
                  key={singleTabsDataIndex}
                  icon={singleTabsData.icon}
                  icon_wrapper_styles={`flex items-center gap-x-2 px-6 py-3  rounded-xl  uppercase text-sm w-fit border ${
                    singleTabsDataIndex === index &&
                    "text-secondary border-secondary"
                  } `}
                  purpose={() => setIndex(singleTabsDataIndex)}
                />
              ) : (
                <div className={`duration-300 `} key={singleTabsDataIndex}>
                  <button
                    className={`duration-300 ${
                      singleTabsDataIndex === index &&
                      "border-secondary text-secondary"
                    }`}
                    onClick={() => setIndex(singleTabsDataIndex)}
                  >
                    {singleTabsData?.label}
                  </button>

                  <div
                    className={`h-[5px] w-[30px] rounded-full  duration-300 ${
                      singleTabsDataIndex === index
                        ? "bg-c_green"
                        : "bg-c_green/60 h-[5px] w-[5px]"
                    }`}
                  />
                </div>
              )
          )}
        </section>

        {/* Tab Info */}
        <section
          className={`col-span-5 overflow-y-scroll duration-300 ${tabsContentHeight}  scrollbar-hide  ${
            iconsOnlyTabs && "lg:-ml-4 xl:-ml-10"
          }`}
        >
          {content}
        </section>
      </section>
    </section>
  );
};

export default Tab;
