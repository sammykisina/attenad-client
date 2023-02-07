import { app_atoms } from "@/atoms";
import { type ReactNode } from "react";
import { useRecoilValue } from "recoil";
import { Sidebar, TopHeader } from "@/components";
import { Toaster } from "react-hot-toast";
import { useAuth } from "@/hooks";
import Login from "src/pages/auth/login";

const Layout = ({ children }: { children: ReactNode }) => {
  /**
   * component states
   */
  const { is_sidebar_open_state, show_sidebar_state } = app_atoms;
  const show_sidebar = useRecoilValue(show_sidebar_state);
  const is_sidebar_open = useRecoilValue(is_sidebar_open_state);

  const { token } = useAuth();

  if (!token) return <Login />;

  return (
    <section className="relative mx-auto flex w-full max-w-[1200px]  sm:px-[20px]">
      {/* toaster */}
      <Toaster />

      {/* sidebar */}
      <div
        className={`absolute  duration-300 sm:left-0  ${
          show_sidebar ? "left-0" : "-left-[100%]"
        }`}
      >
        <Sidebar />
      </div>

      {/* rest of the body */}
      <div
        className={`h-screen max-w-[1200px] flex-1 overflow-x-scroll p-2 duration-300 scrollbar-hide  ${
          is_sidebar_open ? "sm:ml-[250px]" : "sm:ml-24"
        }`}
      >
        <TopHeader />

        <div className="mt-5 h-[47rem]  xs:h-[35.5rem]">{children}</div>
      </div>
    </section>
  );
};

export default Layout;
