import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthAPI } from "@/api";
import type { LoginData } from "src/types/typings.t";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Notifications } from "@/components";

export type User = {
  name: string;
  email: string;
  role: string;
  uuid: string;
};

const useAuth = () => {
  /**
   * hook states
   */
  const [user, setUser] = useState<User | undefined>(undefined);
  const [token, setToken] = useState<string | undefined>(undefined);
  const router = useRouter();
  const queryClient = useQueryClient();

  /**
   * hook functions
   */
  const { mutateAsync: loginMutateAsync, isLoading: isLogging } = useMutation({
    mutationFn: (loginData: LoginData) => {
      console.log(loginData);
      return AuthAPI.login(loginData);
    },

    onSuccess: async (data) => {
      Cookies.set("user", JSON.stringify(data.user));
      Cookies.set("token", data.token);
      await redirect();
      router.refresh();
      Notifications.successNotification(data.message);
    },

    onError: async (error) => {
      console.log("error", error);
    },
  });

  const {
    mutateAsync: updatePasswordMutateAsync,
    isLoading: isUpdatingPassword,
  } = useMutation({
    mutationFn: (data: { userUuid: string; password: string }) => {
      return AuthAPI.updatePassword(data);
    },

    onSuccess: async (data) => {
      Notifications.successNotification(data.message);
    },
  });

  const redirect = async () => await router.push("/");

  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("user");

    setToken(undefined);
    setUser(undefined);

    router.replace("/");
    router.refresh();
  };

  const { data: profile, isLoading: isFetchingProfile } = useQuery({
    queryKey: ["profile", user?.role, user?.uuid],
    queryFn: async ({ queryKey }) => {
      const [_, role, uuid] = queryKey;

      if (role === "lecturer") {
        return await AuthAPI.getLecturerProfile(uuid || "");
      }

      if (role === "admin") {
        return await AuthAPI.getAdminProfile(uuid || "");
      }

      if (role === "student") {
        return await AuthAPI.getStudentProfile(uuid || "");
      }

      return null;
    },
  });

  const {
    mutateAsync: uploadProfileMutateAsync,
    isLoading: isUploadingProfilePic,
  } = useMutation({
    mutationFn: (data: { userUuid: string; profilePic: any }) => {
      return AuthAPI.uploadProfilePic(data);
    },

    onSuccess: async (data) => {
      router.refresh();
      Notifications.successNotification(data.message);
    },
  });

  useEffect(() => {
    const user = Cookies.get("user") && JSON?.parse(Cookies.get("user") || "");
    const token = Cookies.get("token");
    if (token !== undefined || token !== "") {
      setToken(token);
    }

    if (user !== undefined || user !== "") {
      setUser(user);
    }
  }, []);

  return {
    user,
    token,
    loginMutateAsync,
    isLogging,
    logout,
    profile,
    isFetchingProfile,
    updatePasswordMutateAsync,
    isUpdatingPassword,
    uploadProfileMutateAsync,
    isUploadingProfilePic,
  };
};

export default useAuth;
