import React from "react";
import { Spinner } from "@nextui-org/react";

const Loading = ({ text = "لطفا شکیبا باشید..." }) => {
  return (
    <div className="flex flex-col items-center mt-20 ">
      <Spinner color="warning" />
      <p className="text-[10px] text-gray-400 mt-3 animate-pulse mb-4 ">{text}</p>
    </div>
  );
};

export default Loading;
