import type { Student } from "src/types/typings.t";
import { API } from "./api";

const StudentAPI = {
  get: async () =>
    API.get(
      "/admin/students?include=role,course,intake&filter[role.slug]=student"
    ),

  create: async (studentData: Student) =>
    API.post("/admin/students", studentData),

  update: async (data: { studentUuid: string; studentData: Student }) =>
    API.patch(`/admin/students/${data.studentUuid}`, data.studentData),

  delete: async (studentUuid: string) =>
    API.delete(`/admin/students/${studentUuid}`),
};

export default StudentAPI;
