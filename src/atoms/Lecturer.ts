import { atom } from "recoil";

const isEditingLecturerState = atom({
  key: "isEditingLecturerState",
  default: false,
});

const showCreateOrEditLecturerWidgetState = atom({
  key: "showCreateOrEditLecturerWidgetState",
  default: false,
});

const showLecturerInfoWidgetState = atom({
  key: "showLecturerInfoWidgetState",
  default: false,
});

const globalLecturerState = atom<any>({
  key: "globalLecturerState",
  default: null,
});

const lecturerAtoms = {
  isEditingLecturerState,
  showCreateOrEditLecturerWidgetState,
  globalLecturerState,
  showLecturerInfoWidgetState,
};

export default lecturerAtoms;
