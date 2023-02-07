import { atom } from "recoil";

const isEditingModuleState = atom({
  key: "isEditingModuleState",
  default: false,
});

const showCreateOrEditModuleWidgetState = atom({
  key: "showCreateOrEditModuleWidgetState",
  default: false,
});



const globalModuleState = atom<any>({
  key: "globalModuleState",
  default: null,
});

const moduleAtoms = {
  isEditingModuleState,
  showCreateOrEditModuleWidgetState,
  globalModuleState,
  
};

export default moduleAtoms;
