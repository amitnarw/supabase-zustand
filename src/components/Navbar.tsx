import { ModeToggle } from "./mode-toggle";
import { Link } from "react-router";
import useStore from "@/utils/zustand_store";

const Navbar = () => {
  const { user } = useStore();

  const menuList = [
    { title: "Home", route: "/", showTo: "loggedIn" },
    { title: "Contact us", route: "/contact", showTo: "all" },
    { title: "About us", route: "/about", showTo: "all" },
    {
      title: "Logout",
      route: "/logout",
      showTo: "loggedIn",
      style: "bg-red-500 text-white",
    },
    {
      title: "Login",
      route: "/login",
      showTo: "loggedOut",
      style: "bg-green-500 text-white",
    },
    {
      title: "Register",
      route: "/register",
      showTo: "loggedOut",
      style: "bg-gray-800 text-white",
    },
  ];

  return (
    <div className="flex items-center justify-end gap-2 fixed pt-5 pb-4 z-100 w-full top-0 bg-white dark:bg-[#262626] shadow-xl">
      <ul className="flex flex-row gap-2">
        <li className="mt-[-6px]">
          <ModeToggle />
        </li>
        {menuList?.map(
          (item) =>
            ((user && item?.showTo === "loggedIn") ||
              (!user && item?.showTo === "loggedOut") ||
              item?.showTo === "all") && (
              <li key={item?.route}>
                <Link
                  to={item?.route}
                  className={`${
                    item?.style
                      ? item?.style + " hover:bg-gray-400"
                      : "border dark:border-gray-700 text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
                  }  duration-300 cursor-pointer px-4 py-1.5 rounded-md `}
                >
                  {item?.title}
                </Link>
              </li>
            )
        )}
      </ul>
    </div>
  );
};

export default Navbar;
