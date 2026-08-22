/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { Fragment, useEffect, useRef, useState } from "react";
import { Transition } from "@headlessui/react";
import { isEmpty } from "lodash";
import { ChevronDownIcon, CheckCircleIcon } from "@heroicons/react/24/solid";
import { CheckBadgeIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { ApiCall } from "@/helpers/ApiCall";
import { X } from "@phosphor-icons/react";

type FormSelectProps = {
  title: string;
  showX: boolean;
  options: {
    isSearchable?: boolean;
    disabled?: boolean;
    optionClass?: string;
    placeholder?: string;
    titleHint?: string;
    containerClass?: string;
    isMandatory?: boolean;
    property?: string;
    hint?: string;
  };
  list: { [key: string]: any }[];
  value: { [key: string]: any };
  dropdownIcon?: string;
  onSelect: (value: any) => void;
  onSearch?: (q: string) => void;
  onSearchCompleted?: (data: any) => void;
  onRemoveValue?: () => void | null;
  searchRoute?: string;
  searchColumn?: string;
  titleClass?: string;
  innerContainer?: string;
  inputClass?: string;
  fixQuery?: string;
};

type CheckIconProps = {
  isSelected: boolean;
};

const FormSelect = ({
  title,
  options,
  list,
  value,
  showX,
  onSelect,
  titleClass,
  innerContainer,
  inputClass,
  searchRoute,
  searchColumn,
  onSearchCompleted,
  onRemoveValue,
  fixQuery,
}: FormSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState<string | null>(null);
  const [selectOptions, setSelectOptions] = useState(list);
  const selectorRef = useRef<HTMLDivElement>(null);
  const property = options?.property || "title";

  useEffect(() => {
    setSelectOptions(list);
  }, [list]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (selectorRef.current && !selectorRef.current.contains(event.target as Node)) {
        //Close if clicked on outside of element
        setIsOpen(false);
        query && setQuery(null);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // if (query == null || query?.length < 3) return;
    typeof onSearchCompleted === "function" && searchRoute && search();
  }, [query]);

  const search = () => {
    let address = `${searchRoute}?page=1&per_page=200`;
    if (fixQuery) address += `&${fixQuery}`;
    if (query != null) address += `&${searchColumn || "title"}=${query}`;

    ApiCall(
      "GET",
      `${address}`,
      null,
      "SEARCH",
      ({ data }) => {
        typeof onSearchCompleted == "function" && onSearchCompleted(data.data || data);
      }
      // () => setDisabled(false)
    );
  };

  return (
    <div className={options?.containerClass || ""} ref={selectorRef}>
      <div className="relative inline-block w-full">
        <div>
          <div
            className={` text-sm mb-3 font-normal  ${titleClass} ${
              options?.isMandatory && "after:content-['*'] after:mr-1 after:text-red-500"
            }`}
          >
            {title}
            <span className="mr-1.5 text-danger"> {options?.titleHint}</span>
          </div>
          <div
            className={`${innerContainer} ${
              options?.disabled ? "bg-neutral-200 dark:bg-slate-700" : ""
            } form-control border border-gray-300 rounded-xl justify-between optionss-center w-full cursor-pointer`}
            onClick={() => (!options?.disabled ? setIsOpen((e) => !e) : void null)}
          >
            {!!searchRoute ? (
              <input
                placeholder={options?.placeholder}
                onChange={(e) => setQuery(e.target.value)}
                value={typeof query == "string" ? query : value?.[property] || ""}
                className="bg-white  dark:bg-slate-900  w-5/6 "
                style={{ fontSize: 16 }}
              />
            ) : (
              <div className={`${!!value ? "opacity-100" : "opacity-70"} w-5/6 text-right ${!!value && inputClass}`}>
                {value ? value[property] : options?.placeholder || "انتخاب"}
              </div>
            )}
            {showX && typeof onRemoveValue == "function" && (
              <X
                className="text-danger ml-2 mr-1 z-30"
                style={{ zIndex: 1000 }}
                size={18}
                weight="bold"
                onClick={() => {
                  onRemoveValue();
                  setIsOpen(false);
                }}
              />
            )}
            <ChevronDownIcon className="w-4" />
          </div>
        </div>
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
          <div className="absolute z-50 right-0 mt-2 w-full origin-top-center  rounded-4 bg-white  dark:bg-slate-700  shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none max-h-64 overflow-scroll">
            <div className="py-1 divide-y divide-gray-250 dark:divide-gray-500">
              {isEmpty(selectOptions) && <p className="opacity-60 text-xs text-center pt-3">موردی یافت نشد</p>}
              {selectOptions?.map((e, i) => {
                const isSelected = e.id == value?.id;
                return (
                  <div key={i}>
                    <button
                      className={`${
                        isSelected
                          ? "dark:bg-slate-900 bg-neutral-300 bg-opacity-10 dark:bg-opacity-30"
                          : "text-gray-700 dark:text-gray-300 hover:bg-primary-700 dark:hover:bg-slate-600 hover:text-white"
                      }  flex justify-between w-full items-center  px-2 py-3 ${options?.optionClass || "text"}`}
                      onClick={(v) => {
                        if (options?.disabled) return;
                        onSelect(e);
                        setIsOpen(false);
                        setQuery(null);
                      }}
                    >
                      <div className="text-right">{e[property]}</div>
                      <CheckIcon isSelected={isSelected} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </Transition>
      </div>
      {!!options?.hint && (
        <div className={`flex text-xs font-light text-warning mt-2 mr-1`}>
          <ExclamationTriangleIcon className="text-warning w-3.5 ml-1" />
          <p>{options?.hint}</p>
        </div>
      )}
    </div>
  );
};

const CheckIcon = ({ isSelected }: CheckIconProps) => {
  return <CheckCircleIcon className={`${isSelected ? "opacity-100" : "opacity-0"} h-6 w-6  ml-2  text-green-400`} />;
};
export default FormSelect;
