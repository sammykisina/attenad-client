import toast from "react-hot-toast";
import Notify from "./Notify";

const Notification = {
  /**
   * error notification
   */
  errorNotification: (title: string) => getNotified(title, "text-red-500"),

  /**
   * success notification
   */
  successNotification: (title: string) => getNotified(title, "text-green-500"),
};

export default Notification;

const getNotified = (title: string, notification_color: string) => {
  toast.custom(
    (t) => (
      <Notify
        t={t}
        title={title}
        notification_wrapper_styles={`bg-white border shadow-md px-4 py-2 rounded-full ${notification_color}`}
      />
    ),
    {
      position: "top-right",
    }
  );
};
