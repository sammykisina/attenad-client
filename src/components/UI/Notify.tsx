import type { FC } from "react";
import type { Toast } from "react-hot-toast";

interface NotifyProps {
  t: Toast;
  title: string;
  notification_wrapper_styles: string;
}

const Notify: FC<NotifyProps> = ({ t, title, notification_wrapper_styles }) => {
  return (
    <section
      className={`${
        t.visible ? "animate-enter" : "animate-leave"
      } ${notification_wrapper_styles}`}
    >
      <span>{title}</span>
    </section>
  );
};

export default Notify;
