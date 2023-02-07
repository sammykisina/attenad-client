import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks";
import { AttendanceAPI } from "@/api";
import type { Attendance, SelectionOption } from "src/types/typings.t";
import { Button, DeleteAttendance, Notifications } from "@/components";
import { attendanceAtoms } from "@/atoms";
import { useSetRecoilState } from "recoil";
import { useMemo } from "react";
import { format } from "date-fns";

const useAttendance = () => {
  /**
   * hook states
   */
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    showCreateAttendanceWidgetState,
    showRegisterStudentsToAttendanceWidgetState,
    globalAttendanceState,
  } = attendanceAtoms;
  const setShowCreateAttendanceWidget = useSetRecoilState(
    showCreateAttendanceWidgetState
  );
  const setShowRegisterStudentsToAttendanceWidget = useSetRecoilState(
    showRegisterStudentsToAttendanceWidgetState
  );
  const setGlobalAttendance = useSetRecoilState(globalAttendanceState);

  const attendanceTableColumns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Week",
        accessor: "week",
      },
      {
        Header: "Content Delivery Type",
        accessor: "contentDeliveryType",
      },
      {
        Header: "Tutorial Group",
        accessor: "tutorialGroup",
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
        ],
      },
      {
        Header: "Student Count",
        accessor: "studentCount",
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
  const { data: intakes, isLoading: isFetchingIntakes } = useQuery({
    queryKey: ["courses", user?.role, user?.uuid],
    queryFn: async ({ queryKey }) => {
      const [_, role, uuid] = queryKey;

      if (role === "lecturer") {
        return await AttendanceAPI.getIntakes(uuid || "");
      }

      return [];
    },
  });

  const { data: attendances, isLoading: isFetchingAttendances } = useQuery({
    queryKey: ["attendances", user?.role, user?.uuid],
    queryFn: async ({ queryKey }) => {
      const [_, role, uuid] = queryKey;

      if (role === "lecturer") {
        return await AttendanceAPI.getAttendances(uuid || "");
      }

      return [];
    },
  });

  const { data: studentCards, isLoading: isFetchingStudentCards } = useQuery({
    queryKey: ["studentCards", user?.role],
    queryFn: async ({ queryKey }) => {
      const [_, role] = queryKey;

      if (role === "lecturer") {
        return await AttendanceAPI.getStudentCards();
      }

      return [];
    },
  });

  const {
    mutateAsync: createAttendanceMutateAsync,
    isLoading: isCreatingAttendance,
  } = useMutation({
    mutationFn: (data: { lecturerUuid: string; attendanceData: Attendance }) =>
      AttendanceAPI.createAttendance(data),

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["attendances"] });
      Notifications.successNotification(data.message);

      setShowCreateAttendanceWidget(false);
    },

    onError: (error) => {
      console.log("error", error);
    },
  });

  const {
    mutateAsync: registerStudentToAttendance,
    isLoading: isRegisteringStudentToAttendance,
  } = useMutation({
    mutationFn: (data: { attendanceUuid: string; physicalCardId: string }) =>
      AttendanceAPI.registerStudentToAttendance(data),

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["attendances"] });
      setGlobalAttendance(data?.attendance);
      Notifications.successNotification(data.message);

      setShowCreateAttendanceWidget(false);
    },

    onError: (error) => {
      console.log("error", error);
    },
  });

  const generateModulesForAttendanceOptions = (intakes: any) => {
    const moduleOptions = new Set();

    const intakesLinkedToCourses = intakes?.filter(
      (intake: any) => intake?.relationships?.courses?.length !== 0
    );

    const intakesLinkedToModules = intakesLinkedToCourses?.filter(
      (intake: any) =>
        intake?.relationships?.courses[0]?.relationships?.modules.length !== 0
    );

    intakesLinkedToModules?.map((intakesLinkedToModule: any) => {
      moduleOptions.add({
        name: `[ ${
          intakesLinkedToModule?.attributes?.name +
          ` (${intakesLinkedToModule?.relationships?.courses[0]?.attributes?.code})`
        } ] ${
          intakesLinkedToModule?.relationships?.courses[0]?.relationships
            ?.modules[0]?.attributes?.name
        }`,
        value: `[${
          intakesLinkedToModule?.attributes?.name +
          `(${intakesLinkedToModule?.relationships?.courses[0]?.attributes?.code})`
        }] ${
          intakesLinkedToModule?.relationships?.courses[0]?.relationships
            ?.modules[0]?.attributes?.name
        }`,
        intakeId: intakesLinkedToModule?.id,
        courseId: intakesLinkedToModule?.relationships?.courses[0]?.id,
        moduleId:
          intakesLinkedToModule?.relationships?.courses[0]?.relationships
            ?.modules[0]?.id,
      });
    });

    return [...moduleOptions.values()] as SelectionOption[];
  };

  const modifyAttendanceDataForAttendancesTable = (attendances: any) => {
    let allAttendance = [] as any;

    attendances.map((attendance: any) => {
      allAttendance = [
        ...allAttendance,
        {
          name: attendance?.attributes?.name,
          week: attendance?.attributes?.week,
          contentDeliveryType: attendance?.attributes?.contentDeliveryType,
          tutorialGroup: attendance?.attributes?.tutorialGroup ?? "-",
          createdBy: attendance?.relationships?.owner?.attributes?.email,
          createdAt: format(
            new Date(attendance?.attributes?.createdAt),
            "EE, MMM d, yyy"
          ),
          studentCount: attendance?.relationships?.students.length,
          actions: (
            <div className="flex gap-2">
              <Button
                title="Register Students"
                type="small"
                intent="primary"
                purpose={() => {
                  setShowRegisterStudentsToAttendanceWidget(true);
                  setGlobalAttendance(attendance);
                }}
              />

              <DeleteAttendance attendanceUuid={attendance?.attributes?.uuid} />
            </div>
          ),
        },
      ];
    });

    return allAttendance;
  };

  const {
    mutateAsync: deleteAttendanceMutateAsync,
    isLoading: isDeletingAttendance,
  } = useMutation({
    mutationFn: (attendanceUuid: string) =>
      AttendanceAPI.deleteAttendance(attendanceUuid),

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["attendances"] });
      Notifications.successNotification(data.message);
    },

    onError: (error) => {
      console.log("error", error);
    },
  });

  return {
    intakes,
    isFetchingIntakes,
    generateModulesForAttendanceOptions,
    createAttendanceMutateAsync,
    isCreatingAttendance,
    attendances,
    isFetchingAttendances,
    modifyAttendanceDataForAttendancesTable,
    attendanceTableColumns,
    deleteAttendanceMutateAsync,
    isDeletingAttendance,
    studentCards,
    isFetchingStudentCards,
    isRegisteringStudentToAttendance,
    registerStudentToAttendance,
  };
};

export default useAttendance;
