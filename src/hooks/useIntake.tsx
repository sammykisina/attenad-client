import {
  Button,
  DeleteIntake,
  Icon,
  Notifications,
  StatusCell,
} from "@/components";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { useAuth } from "@/hooks";
import { IntakeAPI } from "@/api";
import type { Intake, SelectionOption } from "src/types/typings.t";
import { intakeAtoms } from "@/atoms";
import { useSetRecoilState } from "recoil";
import { format } from "date-fns";
import { HiLink } from "react-icons/hi2";

const useIntake = () => {
  /**
   * hook states
   */
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    globalIntakeState,
    isEditingIntakeState,
    showCreateOrEditIntakeWidgetState,
    showIntakeLinkingWidgetState,
  } = intakeAtoms;
  const setShowCreateOrEditIntakeWidget = useSetRecoilState(
    showCreateOrEditIntakeWidgetState
  );
  const setIsEditingIntake = useSetRecoilState(isEditingIntakeState);
  const setGlobalIntake = useSetRecoilState(globalIntakeState);
  const setShowIntakeLinkingWidget = useSetRecoilState(
    showIntakeLinkingWidgetState
  );

  const intakeTableColumns = useMemo(
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
  const { data: intakes, isLoading: isFetchingIntakes } = useQuery({
    queryKey: ["intakes", user?.role],
    queryFn: async ({ queryKey }) => {
      const [_, role] = queryKey;

      if (role === "admin") {
        return await IntakeAPI.get();
      }

      return [];
    },
  });

  const { mutateAsync: createIntakesMutateAsync, isLoading: isCreatingIntake } =
    useMutation({
      mutationFn: (intakeData: Intake) => IntakeAPI.create(intakeData),

      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["intakes"] });
        Notifications.successNotification(data.message);

        setShowCreateOrEditIntakeWidget(false);
      },

      onError: (error) => {
        console.log("error", error);
      },
    });

  const { mutateAsync: updateIntakesMutateAsync, isLoading: isUpdatingIntake } =
    useMutation({
      mutationFn: (data: { intakeUuid: string; intakeData: Intake }) =>
        IntakeAPI.update(data),

      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["intakes"] });
        Notifications.successNotification(data.message);

        setIsEditingIntake(false);
        setGlobalIntake(null);
        setShowCreateOrEditIntakeWidget(false);
      },

      onError: (error) => {
        console.log("error", error);
      },
    });

  const {
    mutateAsync: linkIntakeToCourseMutateAsync,
    isLoading: isLinkingIntake,
  } = useMutation({
    mutationFn: (data: { intakeUuid: string; courseUuid: string }) =>
      IntakeAPI.link(data),

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["intakes"] });
      Notifications.successNotification(data.message);

      setGlobalIntake(data.intake);
    },

    onError: (error) => {
      console.log("error", error);
    },
  });

  const { mutateAsync: deleteIntakeMutateAsync, isLoading: isDeletingIntake } =
    useMutation({
      mutationFn: (intakeUuid: string) => IntakeAPI.delete(intakeUuid),

      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["intakes"] });
        Notifications.successNotification(data.message);
      },

      onError: (error) => {
        console.log("error", error);
      },
    });

  const modifyIntakeDataForIntakesTable = (intakes: any) => {
    let allIntakes = [] as any;

    intakes.map((intake: any) => {
      allIntakes = [
        ...allIntakes,
        {
          name: intake?.attributes?.name,
          code: intake?.attributes?.code,
          status: intake?.attributes?.status,
          createdBy: intake?.attributes?.createdBy,
          createdAt: format(
            new Date(intake?.attributes?.createdAt),
            "EE, MMM d, yyy"
          ),

          modifiedBy: intake?.attributes?.modifiedBy ?? "N/A",
          actions: (
            <div className="flex items-center gap-2">
              <Button
                title="edit"
                type="small"
                intent="primary"
                purpose={() => {
                  setShowCreateOrEditIntakeWidget(true);
                  setIsEditingIntake(true);
                  setGlobalIntake(intake);
                }}
              />

              <DeleteIntake intakeUuid={intake?.attributes?.uuid} />

              <Icon
                icon={<HiLink className="icon" />}
                icon_wrapper_styles="text-primary hover:text-primary/50"
                purpose={() => {
                  setGlobalIntake(intake);
                  setShowIntakeLinkingWidget(true);
                }}
              />
            </div>
          ),
        },
      ];
    });

    return allIntakes;
  };

  const generateIntakeOptions = (intakes: any) => {
    const intakeOptions = new Set();

    intakes?.map((intake: any) => {
      intakeOptions.add({
        name: intake?.attributes?.name,
        value: intake?.id,
      });
    });

    return [...intakeOptions.values()] as SelectionOption[];
  };

  return {
    intakeTableColumns,
    intakes,
    isFetchingIntakes,
    updateIntakesMutateAsync,
    isUpdatingIntake,
    deleteIntakeMutateAsync,
    isDeletingIntake,
    modifyIntakeDataForIntakesTable,
    createIntakesMutateAsync,
    isCreatingIntake,
    generateIntakeOptions,
    linkIntakeToCourseMutateAsync,
    isLinkingIntake,
  };
};

export default useIntake;
