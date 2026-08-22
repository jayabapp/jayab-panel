import React, { HtmlHTMLAttributes, SyntheticEvent } from "react";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { CellProps } from "./table.type";
import moment from "moment-jalaali";
import numberWithCommas from "@/helpers/NumberWithCommas";
import hexToRgbA from "@/helpers/hexToRgba";
import { SettingStore, useSettingStore } from "@/store";
import { useRouter } from "next/navigation";
import Notify from "../shared/Toast";

const Cell = ({
  value,
  cellType = "string",
  optionalClass,
  link,
  linkTitle,
}: CellProps) => {
  const setting = useSettingStore((state: SettingStore) => state.setting);

  return (
    <CellWrapper link={link} value={value}>
      {cellType === "string" ? (
        <div className={`line-clamp-3 ${optionalClass}`}>{`${
          value || "-"
        }`}</div>
      ) : cellType === "link" ? (
        <a
          className="text-primary-600 underline underline-offset-4"
          href={value}
          target="_blank"
          rel="noreferrer"
        >
          <div className={`line-clamp-3  ${optionalClass} `}>
            {(linkTitle || value) ?? "-"}
          </div>
        </a>
      ) : cellType === "object" ? (
        <div className={`${optionalClass}`}>{`${value || "-"}`}</div>
      ) : cellType === "date" ? (
        <div className={`${optionalClass}`}>{`${value || "-"}`}</div>
      ) : cellType === "dateTime" ? (
        <div className={`text-xs whitespace-nowrap ltr ${optionalClass}`}>{`${
          value || "-"
        }`}</div>
      ) : cellType === "number" ? (
        <div className={`${optionalClass}`}>{`${
          numberWithCommas(value) || "-"
        }`}</div>
      ) : cellType === "enum" ? (
        <div
          className={`py-1.5 px-1.5 rounded-8 text-xs ${optionalClass}`}
          style={{
            background: value?.hex ? hexToRgbA(value.hex, 0.1) : "transparent",
            color: value?.hex || "#999",
          }}
        >{`${value?.title || "-"}`}</div>
      ) : cellType == "colorfulList" ? (
        <>
          {value?.map((e: any) => (
            <p
              key={e.title}
              className="px-1 py-0.5 rounded-6 font-bold text-xs ml-1 my-1 w-fit whitespace-nowrap"
              style={{
                backgroundColor: e.hex,
                color: "white",
                // borderColor: e.hex,
                // borderWidth: 1,
              }}
            >
              {e.title}
            </p>
          ))}
        </>
      ) : cellType === "image" ? (
        <div className="flex justify-end lg:justify-center w-[10rem] md:w-full z-0 ">
          <img
            src={`https://${value?.end_point}/${value?.bucket}/${value?.path}/${value?.name}`}
            className="w-16 h-16  m-2 rounded-[1rem] object-contain"
            onError={(e: SyntheticEvent<HTMLImageElement, Event>) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = setting?.APP_LOGO || "";
              e.currentTarget.className =
                "grayscale brightness-150  w-16 h-16 object-contain m-2 z-0";
            }}
            onLoadedData={(e: SyntheticEvent<HTMLImageElement, Event>) => {
              e.currentTarget.className =
                "w-16 h-16  m-2 rounded-[1rem] object-contain";
            }}
          />
        </div>
      ) : cellType == "boolean" ? (
        <div className="flex justify-center">
          {value ? (
            <CheckCircleIcon className="w-10 h-10  text-teal-500" />
          ) : (
            <XCircleIcon className="w-10 h-10  text-red-400" />
          )}
        </div>
      ) : cellType === "html" ? (
        <div
          className="font-medium text-center leading-7 opacity-80 line-clamp-1"
          dangerouslySetInnerHTML={{ __html: value ?? "" }}
        />
      ) : cellType === "color" ? (
        <div
          className="w-10 h-10 rounded-full mx-auto"
          style={{ background: `${value}` }}
        ></div>
      ) : cellType == "arrayOfStrings" ? (
        <div className="">
          {Array.isArray(value) ? value.join(" • ") : " - "}
        </div>
      ) : (
        <>Please define Cell</>
      )}
    </CellWrapper>
  );
};

export default Cell;

const CellWrapper = ({
  children,
  link,
  value,
}: {
  children: React.ReactNode;
  link?: string;
  value?: any;
}) => {
  const isLink = !!link && !!value;

  const _copyContent = (value: string): void => {
    try {
      navigator.clipboard.writeText(`${value || ""}`);
      Notify({ type: "success", body: "مقدار کپی شد" });
    } catch (error) {}
  };

  return (
    <div
      className={
        !!isLink
          ? "cursor-pointer text-blue-400 underline underline-offset-4"
          : ""
      }
    >
      {isLink ? (
        <a href={link} target="_blank" referrerPolicy="same-origin" rel="prev">
          {children}
        </a>
      ) : (
        <div
          className=" cursor-copy select-all"
          onClick={() => _copyContent(value)}
        >
          {children}
        </div>
      )}
    </div>
  );
};
