import { Button, DeleteModule, Notifications, StatusCell } from "@/components";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { useAuth } from "@/hooks";
import { ModuleAPI } from "@/api";
import type { Module, SelectionOption } from "src/types/typings.t";
import { moduleAtoms } from "@/atoms";
import { useSetRecoilState } from "recoil";
import { format } from "date-fns";

const useModule = () => {
  /**
   * hook states
   */
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    globalModuleState,
    isEditingModuleState,
    showCreateOrEditModuleWidgetState,
  } = moduleAtoms;
  const setShowCreateOrEditModuleWidget = useSetRecoilState(
    showCreateOrEditModuleWidgetState
  );
  const setIsEditingModule = useSetRecoilState(isEditingModuleState);
  const setGlobalModule = useSetRecoilState(globalModuleState);

  const moduleTableColumns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Code",
        accessor: "code",
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: StatusCell,
      },
      {
        Header: "Extra Info",
        columns: [
          {
            Header: "Created By",
            accessor: "createdBy",
          },
          {
            Header: "Created At",
            accessor: "createdAt",
          },
          {
            Header: "Modified By",
            accessor: "modifiedBy",
          },
        ],
      },
      {
        Header: "Actions",
        accessor: "actions",
      },
    ],
    []
  );

  /**
   * hook functions
   */
  const { data: modules, isLoading: isFetchingModules } = useQuery({
    queryKey: ["modules", user?.role],
    queryFn: async ({ queryKey }) => {
      const [_, role] = queryKey;

      if (role === "admin") {
        return await ModuleAPI.get();
      }

      return [];
    },
  });

  const { mutateAsync: createModuleMutateAsync, isLoading: isCreatingModule } =
    useMutation({
      mutationFn: (moduleData: Module) => ModuleAPI.create(moduleData),

      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["modules"] });
        Notifications.successNotification(data.message);

        setShowCreateOrEditModuleWidget(false);
      },

      onError: (error) => {
        console.log("error", error);
      },
    });

  const { mutateAsync: updateModuleMutateAsync, isLoading: isUpdatingModule } =
    useMutation({
      mutationFn: (data: { moduleUuid: string; moduleData: Module }) =>
        ModuleAPI.update(data),

      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["modules"] });
        Notifications.successNotification(data.message);

        setIsEditingModule(false);
        setGlobalModule(null);
        setShowCreateOrEditModuleWidget(false);
      },

      onError: (error) => {
        console.log("error", error);
      },
    });

  const { mutateAsync: deleteModuleMutateAsync, isLoading: isDeletingModule } =
    useMutation({
      mutationFn: (moduleUuid: string) => ModuleAPI.delete(moduleUuid),

      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["modules"] });
        Notifications.successNotification(data.message);
      },

      onError: (error) => {
        console.log("error", error);
      },
    });

  const modifyModuleDataForModuleTable = (modules: any) => {
    let allModules = [] as any;

    modules.map((module: any) => {
      allModules = [
        ...allModules,
        {
          name: module?.attributes?.name,
          code: module?.attributes?.code,
          status: module?.attributes?.status,
          createdBy: module?.attributes?.createdBy,
          createdAt: format(
            new Date(module?.attributes?.createdAt),
            "EE, MMM d, yyy"
          ),

          modifiedBy: module?.attributes?.modifiedBy ?? "N/A",
          actions: (
            <div className="flex gap-2">
              <Button
                title="edit"
                type="small"
                intent="primary"
                purpose={() => {
                  setShowCreateOrEditModuleWidget(true);
                  setIsEditingModule(true);
                  setGlobalModule(module);
                }}
              />

              <DeleteModule moduleUuid={module?.attributes?.uuid} />
            </div>
          ),
        },
      ];
    });

    return allModules;
  };

  const generateModulesOptions = (modules: any) => {
    const moduleOptions = new Set();

    modules?.map((module: any) => {
      moduleOptions.add({
        name: module?.attributes?.name,
        value: module?.id,
        uuid: module?.attributes?.uuid,
      });
    });

    return [...moduleOptions.values()] as SelectionOption[];
  };

  return {
    moduleTableColumns,
    modules,
    isFetchingModules,
    createModuleMutateAsync,
    isCreatingModule,
    updateModuleMutateAsync,
    isUpdatingModule,
    deleteModuleMutateAsync,
    isDeletingModule,
    modifyModuleDataForModuleTable,
    generateModulesOptions,
  };
};

export default useModule;
