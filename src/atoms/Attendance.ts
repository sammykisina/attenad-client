import { atom } from "recoil";

const showCreateAttendanceWidgetState = atom({
  key: "showCreateAttendanceWidgetState",
  default: false,
});

const showRegisterStudentsToAttendanceWidgetState = atom({
  key: "showRegisterStudentsToAttendanceWidgetState",
  default: false,
});

const globalAttendanceState = atom<any>({
  key: "globalAttendanceState",
  default: null,
});

const attendanceAtoms = {
  showCreateAttendanceWidgetState,
  globalAttendanceState,
  showRegisterStudentsToAttendanceWidgetState,
};

export default attendanceAtoms;
