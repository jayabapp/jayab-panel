import React, { ReactNode } from "react";
import toast from "react-hot-toast";
import { errorIcon, successIcon, warningIcon, closeIcon, infoIcon } from "./icons";
interface props {
  type?: "success" | "error" | "warn" | "info";
  title?: string;
  body?: string;
  cb?: () => void | null;
  children?: ReactNode;
}
const Notify = (props: props) => {
  const { type = "info", title, body, cb, children } = props || {};

  const _findTypeData = () => {
    switch (type) {
      case "success":
        return { icon: successIcon, border: "border-r-green-500" };
      case "error":
        return { icon: errorIcon, border: "border-r-rose-500" };
      case "warn":
        return { icon: warningIcon, border: "border-r-yellow-400" };
      case "info":
        return { icon: infoIcon, border: "border-r-sky-400" };

      default:
        return { icon: infoIcon, border: "border-r-sky-400" };
    }
  };

  toast.custom(
    (t) => (
      <div
        className={`flex justify-start relative items-center bg-white  dark:bg-slate-700   w-full md:w-1/2 rounded-lg px-3 py-3 text-black mx-auto  border border-gray-100 dark:border-0 
        border-r-8 dark:border-r-8 ${_findTypeData().border} shadow-lg
        transform-gpu translate-y-0 hover:translate-y-1  relative transition-all duration-500 ease-in-out 
        ${t.visible ? "top-0" : "-top-96"}`}
        onClick={() => {
          toast.dismiss(t.id);
          typeof cb == "function" && cb();
        }}
      >
        {_findTypeData().icon}
        <div className="mr-3 app-text">
          <h1 className="font-bold text-sm mx-2">{title}</h1>
          <p className="font-light w-full text-[13px] mx-2">{body}</p>
          {children}
        </div>
        <div className="absolute left-3 ">{closeIcon}</div>
      </div>
    ),
    { id: `${Math.random() * 100}`, position: "top-center", duration: 6000 }
  );
};

export default Notify;
