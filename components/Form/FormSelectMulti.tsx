/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { Fragment, useEffect, useRef, useState } from "react";
import { Transition } from "@headlessui/react";
import { isEmpty, remove } from "lodash";
import { ChevronDownIcon, CheckCircleIcon } from "@heroicons/react/24/solid";
import { CheckBadgeIcon } from "@heroicons/react/24/outline";
import { Chip } from "@nextui-org/react";
import { ApiCall } from "@/helpers/ApiCall";

type FormSelectMultiProps = {
  title: string;
  options: {
    disabled?: boolean;
    optionClass?: string;
    placeholder?: string;
    titleHint?: string;
    containerClass?: string;
    isMandatory?: boolean;
  };
  list: { [key: string]: any }[];
  isSearchable?: boolean;
  value: any[];
  property?: string;
  dropdownIcon?: string;
  onSelect: (value: any) => void;
  titleClass?: string;
  innerContainer?: string;
  inputClass?: string;
  onSearchCompleted?: (data: any) => void;
  searchRoute?: string;
  searchColumn?: string;
  fixQuery?: string;
};

type CheckIconProps = {
  isSelected: boolean;
};

const FormSelectMulti = ({
  title,
  options,
  list,
  value,
  property = "title",
  dropdownIcon,
  isSearchable = false,
  onSelect,
  titleClass,
  innerContainer,
  inputClass,
  searchRoute,
  searchColumn,
  onSearchCompleted,
  fixQuery,
}: FormSelectMultiProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState<string | null>(null);
  const [selectOptions, setSelectOptions] = useState(list);
  const selectorRef = useRef<HTMLDivElement>(null);

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

  const handleItemSelect = (item: any) => {
    if (options?.disabled) return;
    let res = value;
    if (!Array.isArray(value)) res = [];
    const index = res.findIndex((e) => e.id == item.id);
    if (index > -1) res = res.filter((_, i) => i != index);
    else res = res.concat(item);
    onSelect(res);
    setIsOpen(false);
    setQuery(null);
  };

  return (
    <div className={options?.containerClass || ""} ref={selectorRef}>
      <div className="relative inline-block w-full">
        <div>
          <div
            className={` text-sm mb-3 font-normal   ${titleClass} ${
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
                value={typeof query == "string" ? query : ""}
                className="bg-white  dark:bg-slate-900  w-5/6 "
              />
            ) : (
              <div className={`${!!value ? "opacity-100" : "opacity-70"} text-right w-5/6 ${!!value && inputClass}`}>
                {options?.placeholder || "انتخاب گزینه"}
              </div>
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
          <div className="absolute z-20 right-0 mt-2 w-full origin-top-center  rounded-4 bg-white  dark:bg-slate-700  shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none max-h-64 overflow-scroll">
            <div className="py-1 divide-y divide-gray-250 dark:divide-gray-500">
              {isEmpty(selectOptions) && <p className="opacity-60 text-xs text-center pt-3">موردی یافت نشد</p>}
              {selectOptions?.map((e, i) => {
                const isSelected = value?.findIndex((_) => _.id == e.id) > -1;
                return (
                  <div key={i}>
                    <button
                      className={`${
                        isSelected
                          ? "dark:bg-slate-900 bg-neutral-300 bg-opacity-10 dark:bg-opacity-30"
                          : "text-gray-700 dark:text-gray-300 hover:bg-primary-700 dark:hover:bg-slate-600 hover:text-white"
                      }  flex w-full optionss-center  px-2 py-3 ${options?.optionClass || "text"}`}
                      onClick={() => handleItemSelect(e)}
                    >
                      <CheckIcon isSelected={isSelected} />
                      <div className="text-right">{e[property]}</div>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </Transition>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {value?.map((e) => (
          <Chip color="primary" variant="flat" key={e.id} onClose={() => handleItemSelect(e)}>
            {e.title}
          </Chip>
        ))}
      </div>
    </div>
  );
};

const CheckIcon = ({ isSelected }: CheckIconProps) => {
  return <CheckCircleIcon className={`${isSelected ? "opacity-100" : "opacity-0"} h-6 w-6  ml-2  text-green-400`} />;
};
export default FormSelectMulti;
