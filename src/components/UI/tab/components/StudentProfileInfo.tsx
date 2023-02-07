import {
  Button,
  Error,
  Notifications,
  SpinnerLoader,
  TabTitle,
  Title,
  UploadImage,
} from "@/components";
import { useAuth } from "@/hooks";
import { authSchemas } from "@/schemas";
import { appUtils } from "@/utils";
import React from "react";
import type { z } from "zod";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const StudentProfileInfo = () => {
  /**
   * page states
   */
  const {
    profile,
    isFetchingProfile,
    updatePasswordMutateAsync,
    user,
    isUpdatingPassword,
  } = useAuth();
  const { generateAvatar } = appUtils;

  const { passwordUpdateSchema } = authSchemas;
  type PasswordUpdatedSchema = z.infer<typeof passwordUpdateSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordUpdatedSchema>({
    resolver: zodResolver(passwordUpdateSchema),
  });

  /**
   * page functions
   */
  const onSubmit: SubmitHandler<PasswordUpdatedSchema> = async ({
    password,
  }) => {
    if (password === "") {
      Notifications.errorNotification("Enter the new password.");
      return;
    }

    await updatePasswordMutateAsync({
      userUuid: user?.uuid || "",
      password: password,
    });
  };

  return (
    <section className="divide-y">
      {/* personal info */}
      <div className="flex w-full justify-center ">
        {isFetchingProfile ? (
          <div className="h- flex h-[8rem] w-4/5 items-center  justify-between rounded-[1rem] border px-3 py-2 md:w-3/4 lg:w-2/3">
            <SpinnerLoader color="fill-primary" />
          </div>
        ) : (
          <div className="flex w-full justify-center">
            <div className="flex h-[8rem] w-4/5 items-center  justify-between rounded-[1rem] border px-6 py-2 md:w-3/4 lg:w-2/3">
              <div className="flex flex-col">
                <span className="font-bold  tracking-wider text-primary first-letter:uppercase">
                  {profile?.attributes?.email}
                </span>
                <TabTitle
                  title={profile?.relationships?.role?.attributes?.name}
                  title_styles="text-primary/20 font-thin"
                />
              </div>

              <div className="relative">
                {profile?.attributes?.profilePictureUrl ? (
                  <div className="h-20 w-20">
                    <img
                      className=" h-full w-full rounded-full object-cover"
                      src={profile?.attributes?.profilePictureUrl}
                      alt=""
                    />
                  </div>
                ) : (
                  <div>
                    <img
                      className="h-20 w-20 rounded-full"
                      src={generateAvatar(
                        profile?.attributes?.email,
                        "121927",
                        "ffffff",
                        false
                      )}
                      alt=""
                    />
                  </div>
                )}

                <UploadImage />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* update password */}
      <div className="mt-6 flex justify-center ">
        <form
          className="w-full space-y-1 rounded-[2rem] p-6 sm:w-3/4 lg:w-1/2"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Title title="Updated Your Password" title_styles="text-lg" />
          <section className="flex w-full flex-col gap-4 py-3">
            <div className="relative">
              <input
                type="password"
                {...register("password")}
                className="input peer"
                placeholder="Password"
              />
              <label className="input_label">Password</label>

              {errors["password"] && (
                <Error error_message={errors["password"].message} />
              )}
            </div>

            <div className="relative">
              <input
                type="password"
                {...register("confirm")}
                className="input peer"
                placeholder="Confirm Password"
              />
              <label className="input_label">Confirm Password</label>

              {errors["confirm"] && (
                <Error error_message={errors["confirm"].message} />
              )}
            </div>
          </section>

          <div className="flex justify-end">
            <Button
              title={
                isUpdatingPassword ? (
                  <SpinnerLoader color="fill-white" />
                ) : (
                  "Update"
                )
              }
              intent="primary"
            />
          </div>
        </form>
      </div>
    </section>
  );
};

export default StudentProfileInfo;
