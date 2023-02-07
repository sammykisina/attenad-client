import { atom } from "recoil";

const isEditingStudentState = atom({
  key: "isEditingStudentState",
  default: false,
});

const showCreateOrEditStudentWidgetState = atom({
  key: "showCreateOrEditStudentWidgetState",
  default: false,
});

const showStudentInfoWidgetState = atom({
  key: "showStudentInfoWidgetState",
  default: false,
});

const globalStudentState = atom<any>({
  key: "globalStudentState",
  default: null,
});

const studentAtoms = {
  isEditingStudentState,
  showCreateOrEditStudentWidgetState,
  globalStudentState,
  showStudentInfoWidgetState,
};

export default studentAtoms;
