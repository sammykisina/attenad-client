import { ReactNode } from "react";

export type LoginData = {
  email: string;
  password: string;
};

export type Route = {
  inactiveIcon?: ReactNode;
  activeIcon?: ReactNode;
  name?: string | ReactNode;
  to: string;
};

export type SelectionOption = {
  name: string;
  value: string;
  uuid?: string;
  intakeId?: string;
  courseId?: string;
  moduleId?: string;
};

export type Student = {
  role: "student";
  email: string;
  password: string;
  physicalCardId: string;
  course_id: string;
  intake_id: string;
};

export type Lecturer = {
  role: "lecturer";
  email: string;
  password: string;
  courses: number[];
  intakes: number[];
  modules: number[];
};

export type Intake = {
  name: string;
  code: string;
};

export type Course = {
  name: string;
  code: string;
};
export type Module = {
  name: string;
  code: string;
};

export type TabsData = {
  label?: string;
  icon?: ReactNode;
  content: ReactNode;
};

export type Attendance = {
  name: string;
  intakeId: string;
  courseId: string;
  moduleId: string;
  week: string;
  contentDeliveryType: string;
  tutorialGroup?: string;
};
