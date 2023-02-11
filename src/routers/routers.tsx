import {
  HiAcademicCap,
  HiBookmark,
  HiHome,
  HiOutlineAcademicCap,
  HiOutlineBookmark,
  HiOutlineHome,
  HiOutlineUserCircle,
  HiOutlineUserGroup,
  HiOutlineUsers,
  HiUserCircle,
  HiUserGroup,
  HiUsers,
} from "react-icons/hi2";
import type { Route } from "src/types/typings.t";

const commonRoutes = [
  {
    name: "Home",
    inactiveIcon: <HiOutlineHome className="icon" />,
    activeIcon: <HiHome className="icon" />,
    to: "/",
  },
];

const adminRoutes: Route[] = [
  {
    name: "APU",
    inactiveIcon: <HiOutlineAcademicCap className="icon" />,
    activeIcon: <HiAcademicCap className="icon" />,
    to: "/ad/apu",
  },
  {
    name: "Students",
    to: "/ad/students",
    inactiveIcon: <HiOutlineUserGroup className="icon" />,
    activeIcon: <HiUserGroup className="icon" />,
  },
  {
    name: "Lecturers",
    inactiveIcon: <HiOutlineUsers className="icon" />,
    activeIcon: <HiUsers className="icon" />,
    to: "/ad/lecturers",
  },
  {
    name: "Profile",
    inactiveIcon: <HiOutlineUserCircle className="icon" />,
    activeIcon: <HiUserCircle className="icon" />,
    to: "/ad/profile",
  },
];

const lecturerRoutes: Route[] = [
  {
    name: "Attendance",
    inactiveIcon: <HiOutlineBookmark className="icon" />,
    activeIcon: <HiBookmark className="icon" />,
    to: "/lec/attendance",
  },
  {
    name: "Profile",
    inactiveIcon: <HiOutlineUserCircle className="icon" />,
    activeIcon: <HiUserCircle className="icon" />,
    to: "/lec/profile",
  },
];

const studentsRoutes: Route[] = [
  {
    name: "Profile",
    inactiveIcon: <HiOutlineUserCircle className="icon" />,
    activeIcon: <HiUserCircle className="icon" />,
    to: "/stu/profile",
  },
];

const routes = {
  commonRoutes,
  adminRoutes,
  lecturerRoutes,
  studentsRoutes,
};

export default routes;
