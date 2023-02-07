import { StudentAPI } from "@/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useMemo } from "react";
import { Student } from "src/types/typings.t";
import useAuth from "./useAuth";
import { Button, DeleteStudent, Notifications, StatusCell } from "@/components";
import { studentAtoms } from "@/atoms";
import { useSetRecoilState } from "recoil";
import { format } from "date-fns";

const useStudent = () => {
  /**
   * hook states
   */
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    showCreateOrEditStudentWidgetState,
    globalStudentState,
    isEditingStudentState,
    showStudentInfoWidgetState,
  } = studentAtoms;
  const setShowCreateOrEditStudentWidget = useSetRecoilState(
    showCreateOrEditStudentWidgetState
  );
  const setShowStudentInfoWidget = useSetRecoilState(
    showStudentInfoWidgetState
  );
  const setIsEditingStudent = useSetRecoilState(isEditingStudentState);
  const setGlobalStudent = useSetRecoilState(globalStudentState);

  const studentsTableColumns = useMemo(
    () => [
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Role",
        accessor: "role",
      },
      {
        Header: "Info",
        columns: [
          {
            Header: "Physical Card Id",
            accessor: "physicalCardId",
          },
          {
            Header: "Status",
            accessor: "status",
            Cell: StatusCell,
          },
          {
            Header: "Created By",
            accessor: "createdBy",
          },
          {
            Header: "Created At",
            accessor: "createdAt",
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

  const { data: students, isLoading: isFetchingStudents } = useQuery({
    queryKey: ["students", user?.role],
    queryFn: async ({ queryKey }) => {
      const [_, role] = queryKey;

      if (role === "admin") {
        return await StudentAPI.get();
      }

      return [];
    },
  });

  const {
    mutateAsync: createStudentMutateAsync,
    isLoading: isCreatingStudent,
  } = useMutation({
    mutationFn: (studentData: Student) => StudentAPI.create(studentData),

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      Notifications.successNotification(data.message);
      setShowCreateOrEditStudentWidget(false);
    },

    onError: (error) => {
      console.log("error", error);
    },
  });

  const {
    mutateAsync: updateStudentMutateAsync,
    isLoading: isUpdatingStudent,
  } = useMutation({
    mutationFn: (data: { studentUuid: string; studentData: Student }) =>
      StudentAPI.update(data),

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      Notifications.successNotification(data.message);

      setIsEditingStudent(false);
      setGlobalStudent(null);
      setShowCreateOrEditStudentWidget(false);
    },

    onError: (error) => {
      console.log("error", error);
    },
  });

  const {
    mutateAsync: deleteStudentMutateAsync,
    isLoading: isDeletingStudent,
  } = useMutation({
    mutationFn: (studentUuid: string) => StudentAPI.delete(studentUuid),

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      Notifications.successNotification(data.message);
    },

    onError: (error) => {
      console.log("error", error);
    },
  });

  const modifyStudentDataForStudentsTable = (students: any) => {
    let allStudents = [] as any;

    students.map((student: any) => {
      allStudents = [
        ...allStudents,
        {
          email: student?.attributes?.email,
          role: student?.relationships?.role?.attributes?.name,
          physicalCardId: student?.attributes?.physicalCardId,
          status: student?.attributes?.status,
          createdBy: student?.attributes?.createdBy,
          createdAt: format(
            new Date(student?.attributes?.createdAt),
            "EE, MMM d, yyy"
          ),
          modifiedBy: student?.attributes?.modifiedBy ?? "N/A",
          actions: (
            <div className="flex gap-2">
              <Button
                title="edit"
                type="small"
                intent="primary"
                purpose={() => {
                  setShowCreateOrEditStudentWidget(true);
                  setIsEditingStudent(true);
                  setGlobalStudent(student);
                }}
              />

              <DeleteStudent studentUuid={student?.attributes?.uuid} />

              <Button
                title="view"
                type="small"
                intent="secondary"
                purpose={() => {
                  setShowStudentInfoWidget(true);
                  setGlobalStudent(student);
                }}
              />
            </div>
          ),
        },
      ];
    });

    return allStudents;
  };

  return {
    createStudentMutateAsync,
    isCreatingStudent,
    students,
    isFetchingStudents,
    updateStudentMutateAsync,
    isUpdatingStudent,
    modifyStudentDataForStudentsTable,
    studentsTableColumns,
    deleteStudentMutateAsync,
    isDeletingStudent,
  };
};

export default useStudent;
