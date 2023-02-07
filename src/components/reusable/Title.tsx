import type { FC } from "react";

interface TitleProps {
  title: string;
  title_styles?: string;
}

const Title: FC<TitleProps> = ({ title, title_styles }) => {
  return (
    <h2
      className={`text-shadow whitespace-nowrap font-semibold leading-tight tracking-wider ${
        title_styles ? title_styles : "text-gray-900"
      }`}
    >
      {title}
    </h2>
  );
};

export default Title;
