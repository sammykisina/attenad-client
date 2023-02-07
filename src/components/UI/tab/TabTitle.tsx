import React, { type FC } from "react";
import { Title } from "@/components";

type TabTitleProps = {
  title: string;
  title_styles?: string;
};

const TabTitle: FC<TabTitleProps> = ({ title, title_styles }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="h-5 w-5 rounded-full bg-secondary" />
      <Title
        title={title}
        title_styles={`${title_styles ? title_styles : "text-c_white"}`}
      />
    </div>
  );
};

export default TabTitle;
