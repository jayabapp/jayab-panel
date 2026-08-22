import React from "react";
import { usePagination, DOTS } from "./usePagination";

type PropTypes = {
  onPageChange: Function;
  totalCount: number;
  siblingCount: number;
  currentPage: number;
  pageSize: number;
  onClickPrev: Function;
  onClickNext: Function;
};
const Pagination = (props:PropTypes) => {
  const { onPageChange, totalCount, siblingCount = 1, currentPage, pageSize, onClickPrev, onClickNext } = props;

  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });

  return (
    <div className="flex items-center justify-center mb-4">
      {/* <div
        className={`bg-white dark:bg-slate-800 rounded-full w-8 h-8 flex justify-center items-center ml-2 cursor-pointer transition-all hover:translate-x-2 ${
          currentPage == 1 && "opacity-0"
        }`}
        onClick={() => (currentPage > 1 ? onClickPrev() : void null)}
      >
        <ChevronRight />
      </div> */}
      <div className="flex items-center bg-white dark:bg-slate-700 rounded-full  px-2">
        {paginationRange?.map((e, i) => {
          if (e == DOTS)
            return (
              <div key={i} className="">
                &#8230;
              </div>
            );
          return (
            <div
              key={i}
              className={`w-8 h-8 flex justify-center items-center text-center font-medium mx-2 cursor-pointer border dark:border-0 border-gray-200 rounded-md ${
                currentPage == e
                  ? "shadow-card shadow-primary-700 bg-primary-700 rounded-md text-white scale-[1.15] ease-in-out duration-300 transition-all border-0"
                  : "hover:text-primary-700"
              }`}
              onClick={() => onPageChange(e)}
            >
              {e}
            </div>
          );
        })}
      </div>
      {/* <div
        className={`bg-white dark:bg-slate-800 rounded-full w-8 h-8 flex justify-center items-center mr-2 cursor-pointer transition-all hover:-translate-x-2 ${
          currentPage >= totalCount / pageSize && "opacity-0"
        }`}
        onClick={() => (currentPage < totalCount / pageSize ? onClickNext() : void null)}
      >
        <ChevronLeft />
      </div> */}
    </div>
  );
};

export default Pagination;

const ChevronRight = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
};

const ChevronLeft = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  );
};
