import Link from "next/link";
import React, { useState } from "react";
import { Bars2Icon } from "@heroicons/react/24/outline";
import { Popover } from "@headlessui/react";
import ProfileMenu from "./ProfileMenu";
import { usePathname } from "next/navigation";
import DropDownMenu from "./DropDownMenu";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Header() {
  const [openMenu, setOpen] = useState<boolean>(false);
  const pathname = usePathname();

  const navigation = [
    {
      name: "Marketplace",
      href: "/",
      current: pathname === "/" ? true : false,
    },
    {
      name: "Apply to join",
      href: "/apply",
      current: pathname === "/apply" ? true : false,
    },
    // { name: "Ranking", href: "/ranking", current: false },
    {
      name: "About Us",
      href: "/about",
      current: pathname === "/about" ? true : false,
    },
  ];

  const isOpen = () => {
    setOpen(true);
  };

  const closeMenu = () => {
    setOpen(false);
  };
  const zIndex = pathname === "/profile" ? "z-1" : "z-20";

  return (
    <Popover className={`relative ${zIndex}`}>
      {({ open }) => (
        //Desktop
        <>
          <div className="px-2 sm:px-6 uppercase text-green">
            <div
              className={`fixed flex h-20  xl:max-w-[1600px] left-[50%] translate-x-[-50%]  top-0 
               w-screen px-4 md:px-5 
              lg:px-0 items-center justify-center bg-black`}
            >
              <div className="flex  items-center w-full justify-center lg:px-8 sm:items-stretch ">
                <header className="flex items-center md:hidden">
                  <button
                    className="inline-flex items-center justify-center  text-gray-400 "
                    onClick={isOpen}
                  >
                    <Bars2Icon className="h-7 w-7 mr-2" aria-hidden="true" />
                    <span className="sr-only">Open menu</span>
                  </button>
                </header>
                <div className="flex  items-center basis-[48%]">
                  <Link href="/">
                    <h1 className="text-4xl md:text-3xl ml-2 md:ml-0 whitespace-nowrap lg:text-dynamicXl font-compressed">
                      NEW ELEMENTS
                    </h1>
                  </Link>
                </div>

                <div className="basis-[56%] flex  justify-between">
                  <div className=" w-full items-center">
                    <div className="flex">
                      <div className="flex w-full items-start font-xxCompressed justify-end md:justify-between">
                        {navigation.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            className={classNames(
                              // item.name === "About Us" ? "mr-12" : "mr-0",
                              "text-blue opacity-70 hover:opacity-100 focus:opacity-100",
                              "px-3 rounded-md md:text-dynamic font-medium tracking-wide hidden md:flex"
                            )}
                            aria-current={item.current ? "page" : undefined}
                          >
                            {item.name}
                          </Link>
                        ))}{" "}
                      </div>
                      <div className="flex mb-1 ml-0 lg:ml-[2%] xl:ml-[10%] md:mb-0 md:mt-1 justify-center">
                        <ProfileMenu />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Mobile */}
          <DropDownMenu openMenu={openMenu} closeMenu={closeMenu} />
        </>
      )}
    </Popover>
  );
}
