import {
  Button,
  DeleteCourse,
  Icon,
  Notifications,
  StatusCell,
} from "@/components";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { useAuth } from "@/hooks";
import { CourseAPI } from "@/api";
import type { Course, SelectionOption } from "src/types/typings.t";
import { useSetRecoilState } from "recoil";
import { format } from "date-fns";
import { courseAtoms } from "@/atoms";
import { HiLink } from "react-icons/hi2";

const useCourse = () => {
  /**
   * hook states
   */
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    globalCourseState,
    isEditingCourseState,
    showCreateOrEditCourseWidgetState,
    showCourseLinkingWidgetState,
  } = courseAtoms;
  const setShowCreateOrEditCourseWidget = useSetRecoilState(
    showCreateOrEditCourseWidgetState
  );
  const setIsEditingCourse = useSetRecoilState(isEditingCourseState);
  const setGlobalCourse = useSetRecoilState(globalCourseState);
  const setShowCourseLinkingWidget = useSetRecoilState(
    showCourseLinkingWidgetState
  );

  const courseTableColumns = useMemo(
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
  const { data: courses, isLoading: isFetchingCourses } = useQuery({
    queryKey: ["courses", user?.role],
    queryFn: async ({ queryKey }) => {
      const [_, role] = queryKey;

      if (role === "admin") {
        return await CourseAPI.get();
      }

      return [];
    },
  });

  const { mutateAsync: createCourseMutateAsync, isLoading: isCreatingCourse } =
    useMutation({
      mutationFn: (courseData: Course) => CourseAPI.create(courseData),

      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["courses"] });
        Notifications.successNotification(data.message);

        setShowCreateOrEditCourseWidget(false);
      },

      onError: (error) => {
        console.log("error", error);
      },
    });

  const { mutateAsync: updateCourseMutateAsync, isLoading: isUpdatingCourse } =
    useMutation({
      mutationFn: (data: { courseUuid: string; courseData: Course }) =>
        CourseAPI.update(data),

      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["courses"] });
        Notifications.successNotification(data.message);

        setIsEditingCourse(false);
        setGlobalCourse(null);
        setShowCreateOrEditCourseWidget(false);
      },

      onError: (error) => {
        console.log("error", error);
      },
    });

  const { mutateAsync: deleteCourseMutateAsync, isLoading: isDeletingCourse } =
    useMutation({
      mutationFn: (courseUuid: string) => CourseAPI.delete(courseUuid),

      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["courses"] });
        Notifications.successNotification(data.message);
      },

      onError: (error) => {
        console.log("error", error);
      },
    });

  const {
    mutateAsync: linkCourseToModuleMutateAsync,
    isLoading: isLinkingCourse,
  } = useMutation({
    mutationFn: (data: { courseUuid: string; moduleUuid: string }) =>
      CourseAPI.link(data),

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      Notifications.successNotification(data.message);

      setGlobalCourse(data.course);
    },

    onError: (error) => {
      console.log("error", error);
    },
  });

  const modifyCourseDataForCourseTable = (courses: any) => {
    let allCourses = [] as any;

    courses.map((course: any) => {
      allCourses = [
        ...allCourses,
        {
          name: course?.attributes?.name,
          code: course?.attributes?.code,
          status: course?.attributes?.status,
          createdBy: course?.attributes?.createdBy,
          createdAt: format(
            new Date(course?.attributes?.createdAt),
            "EE, MMM d, yyy"
          ),

          modifiedBy: course?.attributes?.modifiedBy ?? "N/A",
          actions: (
            <div className="flex items-center gap-2">
              <Button
                title="edit"
                type="small"
                intent="primary"
                purpose={() => {
                  setShowCreateOrEditCourseWidget(true);
                  setIsEditingCourse(true);
                  setGlobalCourse(course);
                }}
              />

              <DeleteCourse courseUuid={course?.attributes?.uuid} />

              <Icon
                icon={<HiLink className="icon" />}
                icon_wrapper_styles="text-primary hover:text-primary/50"
                purpose={() => {
                  setGlobalCourse(course);
                  setShowCourseLinkingWidget(true);
                }}
              />
            </div>
          ),
        },
      ];
    });

    return allCourses;
  };

  const generateCourseOptions = (courses: any) => {
    const courseOptions = new Set();

    courses?.map((course: any) => {
      courseOptions.add({
        name: course?.attributes?.name,
        value: course?.id,
        uuid: course?.attributes?.uuid,
      });
    });

    return [...courseOptions.values()] as SelectionOption[];
  };

  return {
    courseTableColumns,
    courses,
    isFetchingCourses,
    createCourseMutateAsync,
    isCreatingCourse,
    updateCourseMutateAsync,
    isUpdatingCourse,
    deleteCourseMutateAsync,
    isDeletingCourse,
    modifyCourseDataForCourseTable,
    generateCourseOptions,
    isLinkingCourse,
    linkCourseToModuleMutateAsync,
  };
};

export default useCourse;
