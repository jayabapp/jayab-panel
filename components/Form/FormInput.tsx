import { isEmpty } from "lodash";
import React, { useRef, memo } from "react";
import Num2persian from "@/helpers/Num2Persian";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { p2e } from "@/helpers/p2e";
import { Button } from "@nextui-org/react";
import { Trash, X } from "@phosphor-icons/react";

type PropsType = {
  value: string | number | undefined;
  errorKey?: string;
  onChangeText: (e: any) => void | null;
  onRemoveValue?: () => void | null;
  errors?: { [key: string]: string[] };
  title: string;
  showX: boolean;
  options?: {
    containerClass?: string;
    titleClass?: string;
    hint?: string;
    placeholder?: string;
    titleHint?: string;
    inputClass?: string;
    keyboard?: "number" | "numberString" | "password" | "text";
    id?: number;
    maxLength?: number;
    isMandatory?: boolean;
    disabled?: boolean;
    convertToText?: boolean;
    unit?: string;
  };
};
const FormInput = ({ title, options, value, onChangeText, errors, errorKey = "", onRemoveValue, showX }: PropsType) => {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className={options?.containerClass + " mb-4"}>
      <label
        htmlFor={`input-${options?.id}`}
        className={`flex mb-3 mr-2 text-sm  pr-1 font-normal text-dark-100 dark:text-gray-300 ${
          options?.isMandatory && "after:content-['*'] after:mr-1 after:text-red-500"
        } ${options?.titleClass || ""}`}
      >
        {title}
        <span className="mx-1.5 text-danger"> {options?.titleHint}</span>
        {/* {showRemoveFilterButton && (
          <div className="flex items-center mr-0.5 text-[7px] text-danger cursor-pointer" onClick={onRemoveValue}>
            حذف فیلتر <Trash className="text-danger mr-0.5" size={8} weight="bold" />
          </div>
        )} */}
      </label>
      <div className="relative">
        <input
          // type={options?.keyboard == "password" ? "password" : options?.keyboard == "number" ? "number" : "text"}
          // onBlur={options?.onBlur}
          ref={inputRef}
          inputMode={options?.keyboard == "number" ? "tel" : "text"}
          pattern={options?.keyboard == "number" ? "[0-9]*" : ""}
          className={`form-control !pl-7 font-normal w-full rounded-xl  placeholder:text-gray-400   placeholder:font-light placeholder:text-sm placeholder:opacity-60 dark:placeholder:text-slate-500  ${options?.inputClass} 
        } `}
          style={{ fontSize: 16 }}
          id={`input-${options?.id}`}
          placeholder={options?.placeholder || title}
          onChange={(v) => {
            const value = p2e(v.target.value);
            if (["number", "numberString"].includes(options?.keyboard || "")) {
              !isNaN(Number(value)) && onChangeText(value);
            } else onChangeText(value);
            if (inputRef.current && options?.maxLength && value.length >= options?.maxLength) inputRef.current.blur();
          }}
          maxLength={options?.maxLength || 512}
          disabled={options?.disabled}
          value={value ?? ""}
          // autoFocus={options?.autoFocus}
          onFocus={(event) => {
            event.target.setAttribute("autocomplete", "off");
          }}
          onWheel={() => inputRef?.current?.blur()}
        />

        <div className="absolute left-0 top-0  h-full   flex justify-end items-center ">
          {!!showX && <X className="text-danger ml-2 mr-1" size={18} weight="bold" onClick={onRemoveValue} />}
          {!!options?.unit && (
            <p className="bg-neutral-200 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-l-xl px-2 py-1.5 text-center h-full w-fit">
              {options?.unit}
            </p>
          )}
        </div>
      </div>

      {!!options?.hint && (
        <div className={`flex text-xs font-light text-warning mt-2 mr-1`}>
          <ExclamationTriangleIcon className="text-warning w-3.5 ml-1" />
          <p>{options?.hint}</p>
        </div>
      )}

      {!!errors && !!errors[errorKey] && (
        <div className={`text-xs text-red-100  mt-2 mr-5  `}>{errors[errorKey]?.map((e: string) => e)}</div>
      )}
      {!!options?.convertToText && (
        <div className="text-xs text-primary text-right mt-1">{value ? Num2persian(value) : "بدون مقدار"}</div>
      )}
    </div>
  );
};

function isEqualProps(prevProps: PropsType, nextProps: PropsType) {
  return prevProps.value == nextProps.value;
}
export default memo(FormInput, isEqualProps);
