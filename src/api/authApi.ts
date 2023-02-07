import type { LoginData } from "src/types/typings.t";
import { API } from "./api";

const AuthAPI = {
  login: async (data: LoginData) => API.post("/auth/login", data),

  getLecturerProfile: (uuid: string) =>
    API.get(`/users/lecturers/${uuid}/profile`),

  getAdminProfile: (uuid: string) => API.get(`/users/admin/${uuid}/profile`),

  getStudentProfile: (uuid: string) =>
    API.get(`/users/students/${uuid}/profile`),

  updatePassword: (data: { userUuid: string; password: string }) =>
    API.post(`/users/${data.userUuid}/reset-password`, {
      password: data.password,
    }),

  uploadProfilePic: (data: { userUuid: string; profilePic: File }) =>
    API.post(`/users/${data.userUuid}/upload-profile-pic`, {
      profilePic: data.profilePic,
    }),
};

export default AuthAPI;
