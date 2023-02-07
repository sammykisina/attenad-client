import { atom } from "recoil";

const isEditingCourseState = atom({
  key: "isEditingCourseState",
  default: false,
});

const showCreateOrEditCourseWidgetState = atom({
  key: "showCreateOrEditCourseWidgetState",
  default: false,
});

const showCourseLinkingWidgetState = atom({
  key: "showCourseLinkingWidgetState",
  default: false,
});

const globalCourseState = atom<any>({
  key: "globalCourseState",
  default: null,
});

const courseAtoms = {
  isEditingCourseState,
  showCreateOrEditCourseWidgetState,
  globalCourseState,
  showCourseLinkingWidgetState,
};

export default courseAtoms;
