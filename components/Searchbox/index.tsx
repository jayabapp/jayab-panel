import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { Spinner } from "@nextui-org/react";
import { debounce } from "lodash";
import React, { useCallback, useEffect, useRef, useState } from "react";

interface props {
  initValue?: string | undefined;
  placeholder?: string;
  cancelText?: string;
  containerClass?: string;
  boxId?: string;
  autofocus?: boolean;

  onSubmit: (e: string | null) => void | null;
  onClear: () => void | null;
  errors?: { [key: string]: string[] };
  item?: {
    bg?: string;
  };
}

const Searchbox = ({
  placeholder = "جستجو ...",
  cancelText = "لغو",
  onSubmit,
  autofocus = false,
  initValue,
  onClear,
  containerClass = "w-[90%] mx-auto",
  item,
  boxId = "SEARCH_BOX",
}: props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState(initValue || "");

  const [isTyping, setisTyping] = useState(true);
  const [loading, setLoading] = useState(false);
  const [element, setElement] = useState<HTMLInputElement>(document.getElementById(boxId) as HTMLInputElement);
  useEffect(() => {
    setElement(document.getElementById(boxId) as HTMLInputElement);
  }, [document.getElementById(boxId)]);

  useEffect(() => {
    autofocus && inputRef?.current?.focus();
  }, []);

  useEffect(() => {
    if (initValue) {
      setText(initValue);
      typeof onSubmit == "function" && onSubmit(initValue);
    }
  }, [initValue]);

  useEffect(() => {
    if (!isTyping) {
      // inputRef.current.blur();
      typeof onSubmit == "function" && element.value != "" && onSubmit(element.value);

      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  }, [isTyping]);

  const checkTyping = useCallback(
    debounce(() => {
      setisTyping(false);
    }, 1000),
    []
  );
  useEffect(() => {
    if (!element?.value) {
      onSubmit(null);
      cancelSearch();
    }
  }, [document]);

  function handleChange(text: string) {
    setText(text);
    setisTyping(true);
    checkTyping();
  }

  const cancelSearch = () => {
    if (element) {
      setText("");
      element.value = "";
      typeof onSubmit == "function" && onSubmit(null);
      onClear();
    }
  };
  return (
    <div className={containerClass}>
      <div
        className={`bg-white overflow-hidden dark:bg-slate-700 border border-neutral-200 dark:border-gray-600 py-0 pl-3 rounded-lg flex justify-between items-center  ${item?.bg}`}
      >
        <div className="flex items-center w-full">
          <input
            id={boxId}
            ref={inputRef}
            placeholder={placeholder}
            className={`bg-white dark:bg-slate-700 py-3 pl-0.5 pr-3 placeholder:text-gray-500 dark:placeholder:text-gray-400 w-full ${item?.bg} `}
            onChange={(v) => handleChange(v.target.value)}
            value={text}
          />
        </div>

        <div className="flex items-center w-1/4 justify-end">
          {loading && (
            <div className="ml-2">
              <Spinner size="sm" color="warning" />
            </div>
          )}

          {element?.value && (
            <div className="text-primary-700 text-xs mr-2 " onClick={cancelSearch}>
              {cancelText}
            </div>
          )}
        </div>
        <div className="mr-4">
          <MagnifyingGlassIcon className="w-6 text-gray-500 dark:text-gray-300" />
        </div>
      </div>
    </div>
  );
};

export default Searchbox;
