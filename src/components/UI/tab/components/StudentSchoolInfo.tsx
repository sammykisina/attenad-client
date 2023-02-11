import {
  InfoSummary,
  ProfileImage,
  SpinnerLoader,
  StatusCell,
  TabTitle,
  Title,
} from "@/components";
import { useAuth } from "@/hooks";
import { appUtils } from "@/utils";
import React from "react";
import { format } from "date-fns";

const StudentSchoolInfo = () => {
  /**
   * page states
   */
  const { profile, isFetchingProfile } = useAuth();
  const { generateAvatar } = appUtils;

  console.log("profile", profile);

  return (
    <section className="h-[31rem] divide-y overflow-scroll  py-4 scrollbar-hide">
      {/* personal info */}
      <div className="flex w-full justify-center ">
        {isFetchingProfile ? (
          <div className="flex h-[8rem] w-4/5 items-center  justify-between rounded-[1rem] border px-3 py-2 md:w-3/4 lg:w-2/3">
            <SpinnerLoader color="fill-primary" />
          </div>
        ) : (
          <div className="relative w-4/5 justify-between gap-4  rounded-[1rem] border px-6 py-2  sm:flex sm:flex-col  md:grid md:h-[12rem]  md:w-3/4  md:grid-cols-2  md:divide-x lg:w-2/3">
            <div className="flex flex-col gap-2 md:py-0">
              <Title title="Identification Info." />
              <div>
                <span className="font-bold  tracking-wider text-primary first-letter:uppercase">
                  {profile?.attributes?.email}
                </span>
                <div className="flex flex-col py-3">
                  <TabTitle
                    title={profile?.relationships?.role?.attributes?.name}
                    title_styles="text-primary/20 font-thin"
                  />
                  <span>
                    ID: <span>{profile?.attributes?.physicalCardId}</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 border-t py-3 md:border-t-0 md:py-0 md:pl-4">
              <Title title="Created By." />
              <div className="flex flex-col">
                <span className="font-bold  tracking-wider text-primary first-letter:uppercase">
                  admin@admin.com
                </span>

                <div className="flex flex-col py-3">
                  <span>Admin</span>
                  {profile?.attributes?.createdAt && (
                    <span>
                      {format(
                        new Date(profile?.attributes?.createdAt),
                        "EE, MMM d, yyy"
                      )}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="absolute -bottom-[3rem] -right-[2.5rem] rounded-full border-2 border-secondary bg-secondary/20 p-2">
              {profile?.attributes?.profilePictureUrl ? (
                <ProfileImage
                  imageUrl={profile?.attributes?.profilePictureUrl}
                />
              ) : (
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
              )}
            </div>

            <div className="absolute -top-[1rem] -right-5">
              <StatusCell value={profile?.attributes?.status} />
            </div>
          </div>
        )}
      </div>

      {/* update password */}
      <div className="mt-16 flex justify-center py-3">
        <div className=" w-4/5  items-center  gap-4 gap-y-2 rounded-[1rem]   border  px-6 py-2 md:w-3/4 lg:w-2/3">
          <div>
            <Title title="Course" />
            <InfoSummary
              infoName={profile?.relationships?.course?.attributes?.name}
              infoCode={profile?.relationships?.course?.attributes?.code}
              infoStatus={profile?.relationships?.course?.attributes?.status}
            />
          </div>

          <div>
            <Title title="Intake" />
            <InfoSummary
              infoName={profile?.relationships?.intake?.attributes?.name}
              infoCode={profile?.relationships?.intake?.attributes?.code}
              infoStatus={profile?.relationships?.intake?.attributes?.status}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudentSchoolInfo;
