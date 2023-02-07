import { app_atoms } from "@/atoms";
import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import type { FC } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { type Route } from "src/types/typings.t";

const navlink_styles = cva(
  "flex items-center rounded-full focus:outline-none w-full px-4 py-2  gap-3 duration-300 hover:bg-primary hover:text-white",
  {
    variants: {
      type: {
        small: "h-[38px] gap-[6px] text-[14px]",
        medium: "h-[40px] gap-[8px] px-[16px] text-[16px] ",
        large: "h-[56px] gap-[8px] px-[20px] text-[18px] ",
        text_only:
          "text-[14px] py-1 px-0  text-c_dark hover:underline duration-300 hover:tracking-wider",
      },
      fullWidth: {
        true: "w-full",
        false: "w-fit",
      },
      active: {
        true: "bg-primary text-white",
        for_text_only: "underline tracking-wider text-c_dark",
      },
    },
  }
);

interface NavLinkProps extends VariantProps<typeof navlink_styles> {
  route: Route;
  moreActions?: () => void;
}

const NavLink: FC<NavLinkProps> = ({
  fullWidth,
  type,
  route,
  moreActions,
  active,
}) => {
  /**
   * component states
   */
  const { show_sidebar_state, is_sidebar_open_state } = app_atoms;
  const setShowSidebar = useSetRecoilState(show_sidebar_state);
  const is_sidebar_open = useRecoilValue(is_sidebar_open_state);

  return (
    <Link
      href={route.to}
      onClick={() => {
        setShowSidebar(false);
        moreActions && moreActions();
      }}
    >
      <div className={navlink_styles({ fullWidth, type, active })}>
        <div className={` ${active && "text-white duration-300"}`}>
          {active ? route.activeIcon : route.inactiveIcon}
        </div>

        <span
          className={`${!is_sidebar_open && "hidden"} ${
            active && "duration-300"
          }`}
        >
          {route.name}
        </span>
      </div>
    </Link>
  );
};

export default NavLink;
