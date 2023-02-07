import type { FC, ReactNode } from "react";

interface IconProps {
  icon: ReactNode;
  icon_wrapper_styles?: string;
  purpose?: () => void;
}

const Icon: FC<IconProps> = ({ icon, icon_wrapper_styles, purpose }) => {
  return (
    <div className={`${icon_wrapper_styles} cursor-pointer`} onClick={purpose}>
      {icon}
    </div>
  );
};

export default Icon;
