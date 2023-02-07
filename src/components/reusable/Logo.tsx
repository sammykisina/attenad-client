import Link from "next/link";
import type { FC } from "react";

interface LogoProps {
  logo_styles?: string;
  dot_styles?: string;
}

const Logo: FC<LogoProps> = () => {
  return (
    <Link
      href="/"
      className={`flex cursor-pointer  items-center gap-1 text-[2.5rem] font-bold `}
    >
      <div className="text-shadow relative whitespace-nowrap text-[2.5rem] font-semibold leading-tight tracking-wider ">
        Attenad
        <div
          className={`absolute  bottom-[0.2rem] -right-[0.2rem] h-2  w-2 self-end rounded-full bg-secondary`}
        />
      </div>
    </Link>
  );
};

export default Logo;
