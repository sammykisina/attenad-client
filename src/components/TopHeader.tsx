import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { Dropdown, Icon, NavLink, Profile, Title } from "@/components";
import { HiBars2, HiOutlineUser } from "react-icons/hi2";
import { useAuth } from "@/hooks";
import { app_atoms } from "@/atoms";
import { useSetRecoilState } from "recoil";

const TopHeader = () => {
  /**
   * component states
   */

  const pathname = usePathname();
  const [show_profile_dropdown, setShowProfileDropdown] =
    useState<boolean>(false);
  const { show_sidebar_state } = app_atoms;
  const setShowSidebar = useSetRecoilState(show_sidebar_state);

  const { token, profile, isFetchingProfile } = useAuth();

  /**
   * component function
   */
  const getTitle: (pathname: string) => string = (pathname) => {
    let title = "";

    switch (pathname) {
      case "/":
        title = "Home";
        break;
      case "/login":
        title = ".";
        break;
      case "/ad/students":
        title = "Students";
        break;

      case "/ad/lecturers":
        title = "Lecturers";
        break;

      case "/ad/apu":
        title = "APU";
        break;

      case "/lec/profile":
        title = "My Profile";
        break;

      case "/ad/profile":
        title = "My Profile";
        break;

      case "/stu/profile":
        title = "My Profile";
        break;

      case "/lec/attendance":
        title = "Attendance";
        break;

      default:
        title = "";
    }

    return title;
  };

  return (
    <nav className="flex h-[50px] items-center justify-between rounded-md border  px-2 sm:px-0">
      <div className="flex items-center gap-x-4">
        <Icon
          icon={<HiBars2 className="text-c_green h-5 w-5 sm:hidden" />}
          purpose={() => setShowSidebar((prevShowSidebar) => !prevShowSidebar)}
        />

        {/* the current page title */}
        {pathname && (
          <Title
            title={getTitle(pathname)}
            title_styles="capitalize text-c_dark text-xl font-semibold tracking-wider"
          />
        )}
      </div>

      {/* the rest of the icons */}
      <div className="flex items-center  gap-x-2">
        {/* the current user dropdown */}
        {token ? (
          <div>
            <Dropdown
              inactive={<HiOutlineUser className="icon" />}
              dropdown_component={<Profile />}
              display_state={show_profile_dropdown}
              setDisplayState={setShowProfileDropdown}
            />
          </div>
        ) : (
          <div className="flex items-center px-2">
            <NavLink
              route={{ to: "/login", name: "Login" }}
              type="small"
              active
            />
            <NavLink
              route={{ to: "/signup", name: "Register" }}
              type="text_only"
            />
          </div>
        )}
      </div>
    </nav>
  );
};

export default TopHeader;
