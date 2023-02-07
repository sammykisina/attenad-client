import { type FC } from "react";
import { TabTitle, Title } from "@/components";
import WidgetClose from "./WidgetClose";

interface WidgetHeader {
  close: () => void;
  title: string;
}

const InfoWidgetHeader: FC<WidgetHeader> = ({ close, title }) => {
  return (
    <section className="border-c_gray  space-y-2 border-b  px-4">
      <WidgetClose close={close} />

      <div className="px-3">
        <TabTitle title={title} />
      </div>
    </section>
  );
};

export default InfoWidgetHeader;
