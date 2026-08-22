"use client";
import { useEffect, useState } from "react";
// import SidebarItem from "./SidebarItem";
import { isEmpty } from "lodash";
import SidebarItem from "./SidebarRow";
import { SettingStore, useSettingStore, useSidebarStore } from "@/store";
import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { CaretDoubleLeft, CaretDoubleRight } from "@phosphor-icons/react";
//@ts-ignore
import ParticleBackground from "react-particle-backgrounds";
import { useTheme } from "next-themes";
import { ApiCall } from "@/helpers/ApiCall";
import { apiRoutes } from "@/utils/urls";

const settings = {
  particle: {
    particleCount: 40,
    color: "#999",
    minSize: 1,
    maxSize: 4,
  },
  velocity: {
    // directionAngle: 30,
    // directionAngleVariance: 90,
    minSpeed: 0.2,
    maxSpeed: 0.8,
  },
  opacity: {
    minOpacity: 0,
    maxOpacity: 0.4,
    opacityTransitionTime: 10000,
  },
};

const Sidebar = ({}) => {
  const router = useRouter();
  const [isOpen, setisOpen] = useState<number>(0);
  const isSidebarOpen = useSidebarStore((state: any) => state.isSidebarOpen);
  const toggleSidebar = useSidebarStore((state: any) => state.toggleSidebar);
  const sidebar = useSettingStore((state: SettingStore) => state.sidebar);
  const setting = useSettingStore((state: SettingStore) => state.setting);

  /**
   * بج ها رو هر چند ثانیه یکبار میگیریم و اپدیت میکنیم
   */
  useEffect(() => {
    setInterval(() => {
      getSidebarBadge();
    }, 10000);
  }, []);

  const getSidebarBadge = () => {
    ApiCall("GET", apiRoutes.DASHBOARD3, null, "Sidebar Badge", ({ data }) => {
      useSidebarStore.setState({ badgeCount: data });
    });
  };

  return (
    <div className="pb-40 min-h-screen bg-white dark:bg-slate-800 overflow-scroll lg:card-shadow border-l-1 border-gray-100 dark:border-slate-800 ">
      <div>
        <div
          className={`bg-[#FCFCFC] text-slate-700 bg-gradient-to-r from-slate-700 to-slate-900 h-[77px]  mb-10 flex  items-center px-4   font-bold dark:text-white text-2xl cursor-pointer fixed right-0 top-0  z-10 border-b-1 dark:border-slate-800 ${
            isSidebarOpen ? "w-[300px] justify-between" : "w-[80px] justify-center"
          }`}
        >
          <div className="absolute inset-0 top-0">
            <ParticleBackground settings={settings} />
          </div>

          <p
            className={`font-extrabold text-lg text-teal-400  ${isSidebarOpen ? "block" : "hidden"}`}
            onClick={() => router.push("/")}
          >
            {isSidebarOpen ? `پــنل مدیـریــت ${setting?.APP_FA_NAME || ""}` : ""}
          </p>
          <div className="z-30">
            {isSidebarOpen ? (
              <CaretDoubleRight className="fill-white" weight="duotone" size={22} onClick={() => toggleSidebar()} />
            ) : (
              <CaretDoubleLeft className="fill-white" weight="duotone" size={22} onClick={() => toggleSidebar()} />
            )}
          </div>
        </div>
      </div>
      <div className="px-3 pt-24">
        {sidebar?.map((e) => {
          return (
            <div key={e?.id}>
              {!isEmpty(e?.items) && (
                <p
                  className={`mb-2 text-bold   opacity-75 mt-8 ${
                    isSidebarOpen ? "text-lg text-right mx-2" : "text-xs text-center mx-0"
                  }`}
                >
                  {e.headerTitle}
                </p>
              )}

              {e?.items?.map((e) => (
                <SidebarItem
                  key={`${e?.id}SIDEBARITEM`}
                  item={e}
                  isOpen={isOpen}
                  setIsOpen={setisOpen}
                  onSelect={() => {}}
                />
              ))}
            </div>
          );
        })}
      </div>
      <div
        className={`fixed w-[300px] bottom-0  flex justify-between bg-neutral-100 dark:bg-slate-700  py-1.5 px-3 ${
          !isSidebarOpen ? "hidden" : "block"
        }`}
      >
        <p className="text-xs opacity-80 text-en text-center">2022-{new Date().getFullYear()} &copy;</p>
        <div className="text-xs  justify-center opacity-60">
          Made with <span className="text-red-600">&#10084;</span> in{" "}
          <span>
            <a href="https://kiantc.com" className="text-blue underline" target="_blank" rel="noreferrer">
              Kian Tejarat
            </a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
