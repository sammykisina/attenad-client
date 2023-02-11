import { LecturerAPI } from "@/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useMemo } from "react";
import type { Lecturer } from "src/types/typings.t";
import useAuth from "./useAuth";
import {
  Button,
  DeleteLecturer,
  Notifications,
  StatusCell,
} from "@/components";
import { lecturerAtoms } from "@/atoms";
import { useSetRecoilState } from "recoil";

const useLecturer = () => {
  /**
   * hook states
   */
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    globalLecturerState,
    isEditingLecturerState,
    showCreateOrEditLecturerWidgetState,
    showLecturerInfoWidgetState,
  } = lecturerAtoms;
  const setShowCreateOrEditLecturerWidget = useSetRecoilState(
    showCreateOrEditLecturerWidgetState
  );
  const setShowLecturerInfoWidget = useSetRecoilState(
    showLecturerInfoWidgetState
  );
  const setIsEditingLecturer = useSetRecoilState(isEditingLecturerState);
  const setGlobalLecturer = useSetRecoilState(globalLecturerState);

  const lecturerTableColumns = useMemo(
    () => [
      {
        Header: "Email",
        accessor: "email",
      },
      // {
      //   Header: "Role",
      //   accessor: "role",
      // },
      {
        Header: "Info",
        columns: [
          // {
          //   Header: "Status",
          //   accessor: "status",
          //   Cell: StatusCell,
          // },
          {
            Header: "Created By",
            accessor: "createdBy",
          },
          {
            Header: "Created On",
            accessor: "createdOn",
          },
          {
            Header: "Details Modified By",
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

  const { data: lecturers, isLoading: isFetchingLecturers } = useQuery({
    queryKey: ["lecturers", user?.role],
    queryFn: async ({ queryKey }) => {
      const [_, role] = queryKey;

      if (role === "admin") {
        return await LecturerAPI.get();
      }

      return [];
    },
  });

  const {
    mutateAsync: createLecturerMutateAsync,
    isLoading: isCreatingLecturer,
  } = useMutation({
    mutationFn: (lecturerData: Lecturer) => LecturerAPI.create(lecturerData),

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["lecturers"] });
      Notifications.successNotification(data.message);
      setShowCreateOrEditLecturerWidget(false);
    },

    onError: (error) => {
      console.log("error", error);
    },
  });

  const {
    mutateAsync: updateLecturerMutateAsync,
    isLoading: isUpdatingLecturer,
  } = useMutation({
    mutationFn: (data: { lecturerUuid: string; lecturerData: Lecturer }) =>
      LecturerAPI.update(data),

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["lecturers"] });
      Notifications.successNotification(data.message);

      setIsEditingLecturer(false);
      setGlobalLecturer(null);
      setShowCreateOrEditLecturerWidget(false);
    },

    onError: (error) => {
      console.log("error", error);
    },
  });

  const {
    mutateAsync: deleteLecturerMutateAsync,
    isLoading: isDeletingLecturer,
  } = useMutation({
    mutationFn: (lecturerUuid: string) => LecturerAPI.delete(lecturerUuid),

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["lecturers"] });
      Notifications.successNotification(data.message);
    },

    onError: (error) => {
      console.log("error", error);
    },
  });

  const modifyLecturerDataForLecturersTable = (lecturers: any) => {
    let allLecturers = [] as any;

    lecturers.map((lecturer: any) => {
      allLecturers = [
        ...allLecturers,
        {
          email: lecturer?.attributes?.email,
          role: lecturer?.relationships?.role?.attributes?.name,
          status: lecturer?.attributes?.status,
          createdBy: lecturer?.attributes?.createdBy,
          modifiedBy: lecturer?.attributes?.modifiedBy ?? "N/A",
          actions: (
            <div className="flex gap-2">
              <Button
                title="edit"
                type="small"
                intent="primary"
                purpose={() => {
                  setIsEditingLecturer(true);
                  setGlobalLecturer(lecturer);
                  setShowCreateOrEditLecturerWidget(true);
                }}
              />

              <DeleteLecturer lecturerUuid={lecturer?.attributes?.uuid} />

              <Button
                title="view"
                type="small"
                intent="secondary"
                purpose={() => {
                  setShowLecturerInfoWidget(true);
                  setGlobalLecturer(lecturer);
                }}
              />
            </div>
          ),
        },
      ];
    });

    return allLecturers;
  };

  return {
    lecturerTableColumns,
    lecturers,
    isFetchingLecturers,
    createLecturerMutateAsync,
    isCreatingLecturer,
    updateLecturerMutateAsync,
    isUpdatingLecturer,
    deleteLecturerMutateAsync,
    isDeletingLecturer,
    modifyLecturerDataForLecturersTable,
  };
};

export default useLecturer;
