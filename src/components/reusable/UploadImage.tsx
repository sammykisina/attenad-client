import React, { useRef, useState } from "react";
import { Icon, SpinnerLoader } from "@/components";
import { HiOutlineArrowUpOnSquareStack, HiOutlinePhoto } from "react-icons/hi2";
import { useAuth } from "@/hooks";

const UploadImage = () => {
  /**
   * component states
   */
  const [selectedFile, setSelectedFile] = useState<File>();
  const filePickerRef = useRef<HTMLInputElement>(null);

  const { isUploadingProfilePic, uploadProfileMutateAsync, user } = useAuth();

  /**
   * component functions
   */
  const handleUpload = async () => {
    await uploadProfileMutateAsync({
      userUuid: user?.uuid || "",
      profilePic: selectedFile,
    });

    if (!isUploadingProfilePic) {
      setSelectedFile(undefined);
    }
  };

  return (
    <div className="absolute top-0 right-0">
      <input
        type="file"
        ref={filePickerRef}
        hidden
        onChange={(event) => {
          if (event.target.files) {
            setSelectedFile(event.target.files[0]);
          }
        }}
      />

      {selectedFile ? (
        <div className="relative">
          <Icon
            icon={
              isUploadingProfilePic ? (
                <SpinnerLoader size="h-4 w-4" color="fill-secondary" />
              ) : (
                <HiOutlineArrowUpOnSquareStack />
              )
            }
            purpose={() => handleUpload()}
            icon_wrapper_styles="bg-primary text-white border border-2 border-white p-1 rounded-full"
          />

          <div className="absolute -top-[5px] right-0   h-3 w-3 animate-ping rounded-full bg-secondary" />
        </div>
      ) : (
        <Icon
          icon={<HiOutlinePhoto />}
          purpose={() => filePickerRef?.current?.click()}
          icon_wrapper_styles="bg-primary text-white border border-2 border-white p-1 rounded-full"
        />
      )}
    </div>
  );
};

export default UploadImage;
