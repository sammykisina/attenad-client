import { Logo, NavLink } from "@/components";
import { useAuth } from "@/hooks";
import { routes } from "@/routes";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  // component states
  const { token, user, logout } = useAuth();
  const pathname = usePathname();
  const { commonRoutes, adminRoutes, lecturerRoutes, studentsRoutes } = routes;

  return (
    <aside className="relative z-40 flex h-screen w-[250px] flex-col justify-between border-x-2 bg-white p-2 pt-8 duration-300">
      <div className="mt-5">
        {/* logo */}
        <div className="flex justify-center">
          <Logo />
        </div>

        {/* links */}
        <ul className="flex flex-col gap-2  pt-6">
          {user?.role === "admin" &&
            commonRoutes
              .concat(adminRoutes)
              .map((adminRoute, routeIndex) => (
                <NavLink
                  key={routeIndex}
                  route={adminRoute}
                  type="medium"
                  fullWidth={true}
                  active={pathname === adminRoute.to && true}
                />
              ))}

          {user?.role === "lecturer" &&
            commonRoutes
              .concat(lecturerRoutes)
              .map((lecturerRoute, lecturerRouteIndex) => (
                <NavLink
                  key={lecturerRouteIndex}
                  route={lecturerRoute}
                  type="medium"
                  fullWidth={true}
                  active={pathname === lecturerRoute.to && true}
                />
              ))}

          {user?.role === "student" &&
            commonRoutes
              .concat(studentsRoutes)
              .map((studentRoute, studentRouteIndex) => (
                <NavLink
                  key={studentRouteIndex}
                  route={studentRoute}
                  type="medium"
                  fullWidth={true}
                  active={pathname === studentRoute.to && true}
                />
              ))}
        </ul>
      </div>

      {/* logout button */}
      {token && (
        <button
          className={`flex items-center justify-center whitespace-nowrap rounded-full bg-secondary  px-4 py-2 font-bold text-gray-900 focus:outline-none`}
          onClick={logout}
        >
          <span>Logout</span>
        </button>
      )}
    </aside>
  );
};

export default Sidebar;
