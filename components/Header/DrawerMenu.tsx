import { Transition } from "@headlessui/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { isEmpty } from "lodash";
import SidebarItem from "../Sidebar/SidebarRow";
import { SettingStore, useSettingStore } from "@/store";

const DrawerMenu = ({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: Function }) => {
  return (
    <Transition show={!!isOpen} className="z-50 fixed  inset-0">
      <Transition.Child
        enter="transition-opacity  duration-700"
        enterFrom="opacity-0 "
        enterTo="opacity-100 "
        leave="transition-opacity  duration-300"
        leaveFrom="opacity-100 "
        leaveTo="opacity-0 "
        className={"backdrop-grayscale fixed inset-0  z-10"}
        onClick={() => setIsOpen(0)}
      >
        <div className="bg-neutral-900 bg-opacity-80  w-full  h-full" />
      </Transition.Child>
      <Transition.Child
        enter="transition ease-in duration-500 transform"
        enterFrom="translate-x-full"
        enterTo="translate-x-0 "
        leave="transition ease-out duration-500 transform"
        leaveFrom="translate-x-0"
        leaveTo={"translate-x-full"}
        className="fixed inset-0 h-screen bg-white dark:bg-slate-800 w-80 z-20 overflow-scroll"
      >
        <div className={`w-full h-full`}>
          <DrawerContent onSelect={() => setIsOpen(false)} />
        </div>
      </Transition.Child>
    </Transition>
  );
};

const DrawerContent = ({ onSelect }: { onSelect: Function }) => {
  const router = useRouter();
  const [isOpen, setisOpen] = useState(0);
  const setting = useSettingStore((state: SettingStore) => state.setting);
  const sidebar = useSettingStore((state: SettingStore) => state.sidebar);

  return (
    <div className="w-full h-full bg-white dark:bg-slate-800 relative">
      <div
        className="w-full h-40 flex justify-center items-center bg-gradient-to-r from-teal-500 to-cyan-800"
        onClick={() => router.push("/")}
      >
        <img src={setting?.APP_LOGO} alt="panel" className="w-24 h-auto object-contain" />
      </div>
      <div className="mx-2 pb-20">
        {sidebar?.map((e) => {
          return (
            <div key={e.id}>
              {!isEmpty(e.items) && (
                <p className="mb-2 text-bold text-lg text-right mx-2 opacity-75 mt-8">{e.headerTitle}</p>
              )}

              {e.items?.map((e) => (
                <SidebarItem
                  key={`${e?.id}SIDEBARITEM`}
                  item={e}
                  isOpen={isOpen}
                  setIsOpen={setisOpen}
                  onSelect={onSelect}
                />
              ))}
            </div>
          );
        })}
      </div>
      <div className="sticky w-full  bottom-0  flex justify-between bg-neutral-100 dark:bg-slate-700  py-1.5 px-3">
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
export default DrawerMenu;
