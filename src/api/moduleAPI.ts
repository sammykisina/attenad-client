import type { Module } from "src/types/typings.t";
import { API } from "./api";

const ModuleAPI = {
  get: async () => API.get("/admin/modules"),

  create: async (moduleData: Module) => API.post("/admin/modules", moduleData),

  update: async (data: { moduleUuid: string; moduleData: Module }) =>
    API.patch(`/admin/modules/${data.moduleUuid}`, data.moduleData),

  delete: async (moduleUuid: string) =>
    API.delete(`/admin/modules/${moduleUuid}`),
};

export default ModuleAPI;
