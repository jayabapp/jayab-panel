import { FormBreak, FormDivider, FormDividerTitle } from "./FormDivider";
import { p2e } from "@/helpers/p2e";
import FormInput from "./FormInput";
import FormInputMulti from "./FormInputMulti";
import FormSelect from "./FormSelect";
import FormSwitch from "./FormSwitch";
import { CreateProps } from "../Table/table.type";
import React, { useEffect, useState } from "react";
import ImageUploader from "./ImageUploader";
import FormSelectMulti from "./FormSelectMulti";
import { RegionType } from "../Map";
import TextEditor from "../RichTextEditor";
import VideoUploader from "./VideoUploader";
import { FormDatePicker } from "./FormDatePicker";
import { DateType } from "@/interfaces/schema.type";
import FormInputColor from "./FormInputColor";
import FormTagInput from "./FormTagInput";
import { produce } from "immer";
import dynamic from "next/dynamic";

type PropTypes = {
  formItems: CreateProps[];
  setStates: Function;
  states: { [key: string]: any };
  notEditableList: string[];
  containerClass?: string;
};
const FormBuilder = ({
  formItems,
  setStates,
  states,
  notEditableList,
  containerClass,
}: PropTypes) => {
  const [formItemsState, setFormItemsState] =
    useState<Array<CreateProps>>(formItems);

  const Map = React.useMemo(
    () =>
      dynamic(() => import("../Map"), {
        ssr: false,
      }),
    [],
  );

  useEffect(() => {
    setFormItemsState(formItems);
  }, [formItems]);
  const onChange = (key: string, value: unknown) => {
    setStates((e: any) => ({ ...e, [key]: value }));
  };

  const onUpdateFromSelectOptions = (index: number, newList: Array<any>) => {
    const nextState = produce(formItems, (draftState: CreateProps[]): any => {
      draftState[index].selectItems = newList;
    });
    setFormItemsState(nextState);
  };

  return (
    <>
      <div
        className={`grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 ${containerClass}`}
      >
        {formItemsState.map((item: CreateProps, formIndex: number) => (
          <React.Fragment key={item.state + ":" + formIndex}>
            {item.type == "divider" ? (
              <FormDivider />
            ) : item.type == "break" ? (
              <FormBreak />
            ) : item.type == "dividerTitle" ? (
              <FormDividerTitle title={item.title || ""} />
            ) : item.type == "input" ? (
              <FormInput
                title={item.title || ""}
                options={{
                  ...item.options,
                  disabled:
                    item.options?.disabled ||
                    Boolean(notEditableList.includes(item.state)),
                }}
                value={states[item.state]}
                onChangeText={(text) => onChange(item.state, text)}
                onRemoveValue={() => onChange(item.state, "")}
                showX={states[item.state]}
              />
            ) : item.type == "tagInput" ? (
              <FormTagInput
                title={item.title || ""}
                options={{
                  ...item.options,
                  disabled: Boolean(notEditableList.includes(item.state)),
                }}
                value={states[item.state]}
                onChange={(text) => onChange(item.state, text)}
              />
            ) : item.type == "textarea" ? (
              <FormInputMulti
                title={item.title || ""}
                options={{
                  ...item.options,
                  disabled: Boolean(notEditableList.includes(item.state)),
                  containerClass: "col-span-full md:col-span-2",
                }}
                value={states[item.state]}
                onChangeText={(text) => onChange(item.state, text)}
              />
            ) : item.type == "colorInput" ? (
              <FormInputColor
                title={item.title || ""}
                options={{
                  ...item.options,
                  disabled: Boolean(notEditableList.includes(item.state)),
                }}
                onRemoveValue={() => onChange(item.state, "")}
                value={states[item.state]}
                onChangeText={(text) => onChange(item.state, text)}
              />
            ) : item.type == "select" ? (
              <>
                <FormSelect
                  title={item.title || ""}
                  options={{
                    ...item.options,
                    disabled: Boolean(notEditableList.includes(item.state)),
                    isSearchable: Boolean(item.searchRoute),
                  }}
                  list={item.selectItems || []}
                  searchRoute={item.searchRoute}
                  searchColumn={item.searchColumn}
                  onSearchCompleted={(newList) =>
                    onUpdateFromSelectOptions(formIndex, newList)
                  }
                  value={states[item.state]}
                  onSelect={(obj) => onChange(item.state, obj)}
                  onRemoveValue={() => onChange(item.state, {})}
                  fixQuery={item.fixQuery}
                  showX={states[item.state]}
                />
              </>
            ) : item.type == "multiSelect" ? (
              <>
                <FormSelectMulti
                  title={item.title || ""}
                  options={{
                    ...item.options,
                    disabled: Boolean(notEditableList.includes(item.state)),
                  }}
                  searchRoute={item.searchRoute}
                  searchColumn={item.searchColumn}
                  onSearchCompleted={(newList) =>
                    onUpdateFromSelectOptions(formIndex, newList)
                  }
                  list={item.selectItems || []}
                  value={states[item.state]}
                  fixQuery={item.fixQuery}
                  onSelect={(arr) => onChange(item.state, arr)}
                />
              </>
            ) : item.type == "editor" ? (
              <div className="col-span-full">
                <TextEditor
                  title={item.title || ""}
                  options={{ ...item.options }}
                  value={states[item.state]}
                  onChangeText={(content) => onChange(item.state, content)}
                />
              </div>
            ) : item.type == "switch" ? (
              <FormSwitch
                title={item.title || ""}
                options={{
                  ...item.options,
                  disabled: Boolean(notEditableList.includes(item.state)),
                }}
                checked={states[item.state]}
                onCheck={(bool) => onChange(item.state, bool)}
              />
            ) : item.type == "date" ? (
              <FormDatePicker
                title={item.title || ""}
                options={{
                  ...item.options,
                  disabled: Boolean(notEditableList.includes(item.state)),
                }}
                value={states[item.state]}
                onSelect={(date: Date) => onChange(item.state, date)}
                onRemoveValue={() => onChange(item.state, "")}
              />
            ) : item.type == "image" ? (
              <div className="col-span-full row-span-2">
                <ImageUploader
                  title={item.title || ""}
                  options={{
                    ...item.options,
                    disabled: Boolean(notEditableList.includes(item.state)),
                  }}
                  list={states[item.state]}
                  disabled={false}
                  onSelect={(img: any) =>
                    item.options?.multiImage
                      ? onChange(
                          item.state,
                          (states[item.state] || []).concat(img),
                        )
                      : onChange(item.state, [img])
                  }
                  onDelete={(imageId: number) => {
                    item.options?.multiImage
                      ? onChange(
                          item.state,
                          (states[item.state] || []).filter(
                            (e: any) => e.id != imageId,
                          ),
                        )
                      : onChange(item.state, []);
                  }}
                />
              </div>
            ) : item.type == "video" ? (
              <div className="col-span-full row-span-2">
                <VideoUploader
                  title={item.title || ""}
                  options={{
                    ...item.options,
                    disabled: Boolean(notEditableList.includes(item.state)),
                  }}
                  list={states[item.state]}
                  disabled={false}
                  onSelect={(img: any) =>
                    item.options?.multiImage
                      ? onChange(
                          item.state,
                          (states[item.state] || []).concat(img),
                        )
                      : onChange(item.state, [img])
                  }
                  onDelete={(imageId: number) => {
                    item.options?.multiImage
                      ? onChange(
                          item.state,
                          (states[item.state] || []).filter(
                            (e: any) => e.id != imageId,
                          ),
                        )
                      : onChange(item.state, []);
                  }}
                />
              </div>
            ) : item.type == "map" ? (
              <div className="col-span-full row-span-2">
                <Map
                  title={item.title || ""}
                  onDragEnd={(v: RegionType) => onChange(item.state, v)}
                  initLoc={states[item.state]}
                  markers={states[item.state]}
                />
              </div>
            ) : (
              <></>
            )}
          </React.Fragment>
        ))}
      </div>
    </>
  );
};

export default FormBuilder;
