import type { FC } from "react";

interface ErrorProps {
  error_message?: string;
}

const Error: FC<ErrorProps> = ({ error_message }) => {
  return (
    <span className="text-base capitalize text-red-500">{error_message}</span>
  );
};

export default Error;
