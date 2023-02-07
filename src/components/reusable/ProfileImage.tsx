import Image from "next/image";
import type { FC } from "react";

type ProfileImageProps = {
  imageUrl: string;
};

const ProfileImage: FC<ProfileImageProps> = ({ imageUrl }) => {
  return (
    <div className="relative h-20 w-20">
      <Image
        src={imageUrl}
        alt=""
        fill
        className="h-full w-full rounded-full object-cover"
      />
    </div>
  );
};

export default ProfileImage;
