import React from "react";
import { isEmpty } from "lodash";
import { TableProps, TableServerProps } from "./table.type";
import Lottie from "react-lottie";

import lottieAnimation from "@/public/assets/lotties/empty.json";
const LottieComponent = Lottie as React.ComponentType<any>;

const Table = ({ ...props }: TableProps) => {
  const { columns, rows } = props;

  return (
    <>
      <table
        className={
          "w-full border-collapse border border-slate-500 overflow-scroll hidden lg:table"
        }
      >
        <thead className={`bg-slate-50 dark:bg-slate-700 overflow-scroll`}>
          <tr>
            <th
              className={
                "border border-slate-300 dark:border-slate-600 font-semibold p-4 text-slate-900 dark:text-slate-200 text-center"
              }
            >
              {"ردیف"}
            </th>
            {!isEmpty(rows) && !isEmpty(rows[0].actions) && (
              <th
                className={
                  "border border-slate-300 dark:border-slate-600 font-semibold p-4 text-slate-900 dark:text-slate-200 text-center"
                }
              >
                {"عملیات"}
              </th>
            )}
            {columns.map((col) => (
              <th
                key={col.id}
                className={
                  "border border-slate-300 dark:border-slate-600 font-semibold p-4 text-slate-900 dark:text-slate-200 text-center"
                }
              >
                {col.title}
              </th>
            ))}
          </tr>
        </thead>

        {isEmpty(rows) ? (
          <tbody>
            <tr className="">
              <td
                className="font-semibold p-4 text-slate-900 dark:text-slate-200 text-center"
                colSpan={columns?.length + 1}
              >
                <LottieComponent
                  width={120}
                  height={120}
                  options={{ animationData: lottieAnimation, loop: false }}
                />
                {"موردی برای نمایش وجود ندارد"}
              </td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            {rows?.map((rowItem, index) => {
              return (
                <tr
                  key={index}
                  className={`app-text even:bg-neutral-100 even:dark:bg-slate-900`}
                >
                  {/****************************** ROW INDEX *******************************/}
                  <td className=" border border-slate-300 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400 text-sm  font-bold text-center py-3 w-[5rem] ">
                    {index + 1}
                  </td>

                  {/****************************** ACTIONS *******************************/}
                  {!isEmpty(rowItem.actions) && (
                    <td
                      className={`w-52 border border-slate-300 dark:border-slate-700 p-2`}
                    >
                      <div
                        className={`flex flex-wrap ${
                          rowItem.actions?.length === 1
                            ? "justify-center"
                            : "justify-between"
                        } gap-4 w-52`}
                      >
                        {rowItem.actions?.map((action, i) => {
                          return <div key={i}>{action.component}</div>;
                        })}
                      </div>
                    </td>
                  )}

                  {/****************************** ROW DATA *******************************/}
                  {rowItem.items?.map((item) => (
                    <td
                      key={item.id}
                      className="border border-slate-300 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400 text-center"
                    >
                      {item?.component()}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        )}
      </table>

      {/* MOBILE */}
      <div className="block lg:hidden rounded-10 dark:bg-slate-800 px-0 py-3">
        {isEmpty(rows) && (
          <div className=" font-semibold p-4 text-slate-900 dark:text-slate-200 text-center">
            <LottieComponent
              width={120}
              height={120}
              options={{ animationData: lottieAnimation, loop: false }}
            />
            {"موردی برای نمایش وجود ندارد"}
          </div>
        )}
        {rows?.map((rowItem, i) => {
          return (
            <div
              className={`my-4 rounded-10 border border-neutral-200 dark:border-slate-700 px-2 py-2 bg-neutral-100 dark:bg-slate-900 shadow-card dark:shadow-2xl`}
              key={i}
            >
              {rowItem.items?.map((item, j) => (
                <div
                  key={item.id}
                  className={`flex justify-between items-center border-t border-dashed border-neutral-300 dark:border-slate-800 py-1 text-neutral-700 dark:text-slate-300 text-center`}
                >
                  <p className="">{columns[j]?.title}</p>
                  {item?.component()}
                </div>
              ))}
              <div
                className={`w-full grid grid-cols-3 md:grid-cols-4  items-center text-white text-xs gap-1.5 mb-2 mt-4`}
              >
                {rowItem.actions?.map((action, i) => {
                  return (
                    <React.Fragment key={i}>
                      <div className="flex justify-center ">
                        {action.component}
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Table;
