import React from "react";

type PropsType = {
  firstText: string | null;
  secondText: string | null;
  thirdText?: string;
  size?: string;
  secondTextStyle?: string;
};
export const NestedText = ({
  firstText,
  secondText,
  thirdText = "",
  size = "text-md ",
  secondTextStyle = "dark:text-white",
}: PropsType) => {
  return (
    <div className={`flex flex-row items-center flex-wrap my-2 ${size}`}>
      <div className=" ml-1 font-light ">{firstText}:</div>
      <div className="flex flex-row">
        <div className={secondTextStyle}>{secondText} </div>{" "}
        <div className="mr-1">{thirdText}</div>
      </div>
    </div>
  );
};
