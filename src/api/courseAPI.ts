import type { Course } from "src/types/typings.t";
import { API } from "./api";

const CourseAPI = {
  get: async () => API.get("/admin/courses?include=modules"),

  create: async (courseData: Course) => API.post("/admin/courses", courseData),

  update: async (data: { courseUuid: string; courseData: Course }) =>
    API.patch(`/admin/courses/${data.courseUuid}`, data.courseData),

  delete: async (courseUuid: string) =>
    API.delete(`/admin/courses/${courseUuid}`),

  link: async (data: { courseUuid: string; moduleUuid: string }) =>
    API.post(
      `/admin/school/courses/${data.courseUuid}/modules/${data.moduleUuid}/link`,
      {}
    ),
};

export default CourseAPI;
