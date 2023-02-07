import { API } from "./api";
import type { Attendance } from "src/types/typings.t";

const AttendanceAPI = {
  getIntakes: async (lecturerUuid: string) =>
    API.get(`/lecturers/${lecturerUuid}/intakes?include=courses.modules`),

  getAttendances: async (lecturerUuid: string) =>
    API.get(`/lecturers/${lecturerUuid}/attendances`),

  getStudentCards: async () =>
    API.get(`/lecturers/students?filter[role.slug]=student`),

  createAttendance: async (data: {
    lecturerUuid: string;
    attendanceData: Attendance;
  }) =>
    API.post(
      `/lecturers/${data.lecturerUuid}/attendances`,
      data.attendanceData
    ),

  registerStudentToAttendance: async (data: {
    attendanceUuid: string;
    physicalCardId: string;
  }) =>
    API.post(
      `/lecturers/attendances/${data.attendanceUuid}/students/register`,
      {
        physicalCardId: data.physicalCardId,
      }
    ),

  deleteAttendance: async (attendanceUuid: string) =>
    API.delete(`/lecturers/attendances/${attendanceUuid}`),
};

export default AttendanceAPI;
