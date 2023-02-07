import type { Lecturer } from "src/types/typings.t";
import { API } from "./api";

const LecturerAPI = {
  get: async () =>
    API.get(
      "/admin/lecturers?include=role,intakes,courses,modules&filter[role.slug]=lecturer"
    ),

  create: async (lecturerData: Lecturer) =>
    API.post("/admin/lecturers", lecturerData),

  update: async (data: { lecturerUuid: string; lecturerData: Lecturer }) =>
    API.patch(`/admin/lecturers/${data.lecturerUuid}`, data.lecturerData),

  delete: async (lecturerUuid: string) =>
    API.delete(`/admin/lecturers/${lecturerUuid}`),
};

export default LecturerAPI;
