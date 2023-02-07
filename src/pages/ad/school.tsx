import { Course, Intake, Tab, Module } from "@/components";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  HiBookmark,
  HiDocumentDuplicate,
  HiDocumentText,
} from "react-icons/hi2";

const Users = () => {
  /**
   * pages states
   */
  const [index, setIndex] = useState(0);
  const router = useRouter();
  const usersTabs = [
    {
      label: "Intakes",
      content: <Intake />,
      icon: <HiDocumentDuplicate className="icon" />,
    },
    {
      label: "Courser",
      content: <Course />,
      icon: <HiDocumentText className="icon" />,
    },
    {
      label: "Module",
      content: <Module />,
      icon: <HiBookmark className="icon" />,
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
