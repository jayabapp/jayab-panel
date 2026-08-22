import { Menu, Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import { CoordinateType } from ".";
import { MapPinIcon } from "@heroicons/react/24/outline";

type PropTypes = {
  isOpen: boolean;
  items: any[];
  onSelect: (coordinate: CoordinateType) => void;
};
const SearchDropDown = ({ isOpen, items, onSelect }: PropTypes) => {
  return (
    <div className="bg-red-400">
      <Menu as="div" className="w-full mx-auto ">
        <Transition
          show={isOpen}
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="z-20  mt-2 rounded-xl bg-white dark:bg-slate-700 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none  overflow-scroll">
            <div className="px-1 py-2 ">
              {items?.map((e: any, i: number) => {
                if (i > 4) {
                  return;
                }
                return (
                  <Menu.Item key={i}>
                    {({ active }) => (
                      <div
                        onClick={() => {
                          onSelect(e?.location);
                        }}
                        className={`hover:bg-primary-700 hover:text-white text-gray-600 dark:text-gray-300 group flex w-full items-center rounded-md px-2 py-2 text-sm font-light no-underline`}
                      >
                        <MapPinIcon className="ml-2 w-4" />
                        <div className="text-xs line-clamp-1 ">{e?.title}</div>
                      </div>
                    )}
                  </Menu.Item>
                );
              })}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

export default SearchDropDown;
