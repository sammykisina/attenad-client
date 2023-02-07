import type { Intake } from "src/types/typings.t";
import { API } from "./api";

const IntakeAPI = {
  get: async () => API.get("/admin/intakes?include=courses"),

  create: async (intakeData: Intake) => API.post("/admin/intakes", intakeData),

  update: async (data: { intakeUuid: string; intakeData: Intake }) =>
    API.patch(`/admin/intakes/${data.intakeUuid}`, data.intakeData),

  delete: async (intakeUuid: string) =>
    API.delete(`/admin/intakes/${intakeUuid}`),

  link: async (data: { intakeUuid: string; courseUuid: string }) =>
    API.post(
      `/admin/school/intakes/${data.intakeUuid}/courses/${data.courseUuid}/link`,
      {}
    ),
};

export default IntakeAPI;
