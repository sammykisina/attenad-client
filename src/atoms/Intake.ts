import { atom } from "recoil";

const isEditingIntakeState = atom({
  key: "isEditingIntakeState",
  default: false,
});

const showCreateOrEditIntakeWidgetState = atom({
  key: "showCreateOrEditIntakeWidgetState",
  default: false,
});

const showIntakeLinkingWidgetState = atom({
  key: "showIntakeLinkingWidgetState",
  default: false,
});

const globalIntakeState = atom<any>({
  key: "globalIntakeState",
  default: null,
});

const intakeAtoms = {
  isEditingIntakeState,
  showCreateOrEditIntakeWidgetState,
  globalIntakeState,
  showIntakeLinkingWidgetState,
};

export default intakeAtoms;
