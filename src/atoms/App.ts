import { atom } from "recoil";

const is_sidebar_open_state = atom<boolean>({
  key: "is_sidebar_open_state",
  default: true,
});

const show_sidebar_state = atom<boolean>({
  key: "show_sidebar_state",
  default: false,
});

const token_state = atom<string | undefined>({
  key: "token_state",
  default: "",
});

const app_atoms = {
  is_sidebar_open_state,
  show_sidebar_state,
  token_state,
};

export default app_atoms;
