import { StudentProfileInfo, StudentSchoolInfo, Tab } from "@/components";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { HiAcademicCap, HiUser } from "react-icons/hi2";

const Users = () => {
  /**
   * pages states
   */
  const [index, setIndex] = useState(0);
  const router = useRouter();
  const usersTabs = [
    {
      label: "SchoolInfo",
      content: <StudentSchoolInfo />,
      icon: <HiAcademicCap className="icon" />,
    },
    {
      label: "ProfileInfo",
      content: <StudentProfileInfo />,
      icon: <HiUser className="icon" />,
    },
  ];

  useEffect(() => {
    if (Cookies.get("token") === "" || Cookies.get("token") === undefined) {
      router.push("/");
    }
  }, []);

  return (
    <section className="h-full">
      <Tab
        tabsData={usersTabs}
        tabsBodyStyles="lg:grid grid-cols-6 duration-300"
        index={index}
        iconsOnlyTabs
        setIndex={setIndex}
        iconsOnlyTabsStyles="flex flex-row  flex-wrap duration-300 lg:flex-col gap-2 col-span-1"
        tabsContentHeight="mt-[1rem] py-2 lg:mt-0 scrollbar-hide "
      />
    </section>
  );
};

export default Users;
