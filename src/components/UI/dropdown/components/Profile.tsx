import { useAuth } from "@/hooks";
import { appUtils } from "@/utils";
import React from "react";
import { ProfileImage } from "@/components";

const Profile = () => {
  /**
   * component states
   */
  const { profile } = useAuth();
  const { generateAvatar } = appUtils;

  return (
    <section className=" flex  h-[10rem] w-[15rem] flex-col items-center justify-center">
      <div className="relative">
        {profile?.attributes?.profilePictureUrl ? (
          <ProfileImage imageUrl={profile?.attributes?.profilePictureUrl} />
        ) : (
          <div className="">
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
        {/* <UploadImage /> */}
      </div>

      <span>{profile?.attributes?.email}</span>
    </section>
  );
};

export default Profile;
