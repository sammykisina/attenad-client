import { type FC, type ReactNode, useRef } from "react";
import { Icon } from "@/components";
import { type SetterOrUpdater } from "recoil";
import { useClickOutside } from "@/hooks";

interface DropdownProps {
  active?: ReactNode;
  inactive: ReactNode;
  dropdown_component: ReactNode;
  display_state: boolean;
  setDisplayState: SetterOrUpdater<boolean>;
  badge?: number;
}

const Dropdown: FC<DropdownProps> = ({
  active,
  inactive,
  dropdown_component,
  display_state,
  setDisplayState,
  badge,
}) => {
  /**
   * Component States
   */
  const dropdown_component_ref = useRef<HTMLDivElement>(null);

  /**
   * Component Functions
   */
  useClickOutside(dropdown_component_ref, () => setDisplayState(false));

  return (
    <div className="relative z-40" ref={dropdown_component_ref}>
      <div className="group">
        <Icon
          icon={badge ? active : inactive}
          icon_wrapper_styles={`p-2 z-30  rounded-full relative ${
            display_state && "bg-primary text-white"
          }`}
          purpose={() => setDisplayState((prev) => !prev)}
        />

        {badge
          ? badge > 0 && (
              <div className="group-hover:text-dark absolute top-[0.5rem] right-[0.5rem] z-30 h-2 w-2 items-center justify-center rounded-full bg-red-500 text-sm duration-300" />
            )
          : ""}
      </div>

      <div
        className={` ${
          display_state ? "dropdown_content active" : "dropdown_content"
        }`}
      >
        {dropdown_component}
      </div>
    </div>
  );
};

export default Dropdown;
