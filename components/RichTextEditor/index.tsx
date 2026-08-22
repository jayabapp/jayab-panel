import React, { useCallback, useEffect, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Button } from "@nextui-org/react";
import { ApiCall } from "@/helpers/ApiCall";
import { apiRoutes } from "@/utils/urls";
import { CONTENT_STYLE, CUSTOM_CALENDAR } from "./tinymce.constant";
import { debounce } from "lodash";

type PropsType = {
  value: string | undefined;
  onChangeText: (e: any) => void | null;
  title: string;
  options?: {
    containerClass?: string;
    titleClass?: string;
    hint?: string;
    placeholder?: string;
    titleHint?: string;
    maxLength?: number;
    isMandatory?: boolean;
  };
};
const RichTextEditor = ({ title, value, onChangeText, options }: PropsType) => {
  const imagePickerRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<any>(null);
  const [isTyping, setisTyping] = useState(true);
  const initialValue = useRef<string>(value || "");

  useEffect(() => {
    if (!isTyping) {
      const c = editorRef?.current?.getContent();
      onChangeText(c);
    }
  }, [isTyping]);

  const checkTyping = useCallback(
    debounce(() => {
      setisTyping(false);
    }, 1000),
    [],
  );

  return (
    <div className="">
      <input
        className="hidden"
        type="file"
        id={`formFile-image}`}
        ref={imagePickerRef}
        onClick={(e) => ((e.target as HTMLInputElement).value = "")}
      />
      {/*********** TITLE ***********/}
      <div
        className={` text-sm mb-3 font-normal   ${options?.titleClass} ${
          options?.isMandatory &&
          "after:content-['*'] after:mr-1 after:text-red-500"
        }`}
      >
        {title}
        <span className="mr-1.5 text-danger"> {options?.titleHint}</span>
      </div>

      {/*********** TINYMCE ***********/}
      <Editor
        onEditorChange={(e) => {
          setisTyping(true);
          checkTyping();
        }}
        tinymceScriptSrc={"/lib/tinymce/tinymce.min.js"}
        onInit={(evt, editor) => (editorRef.current = editor)}
        initialValue={initialValue?.current}
        init={{
          promotion: false,
          directionality: "rtl",
          menubar: "edit view format tools insert",
          convert_urls: false,
          toolbar1:
            "undo redo | sizeselect | fontselect |  fontsize | bold italic forecolor backcolor |  \
     alignleft aligncenter alignright alignjustify tindent_bttn | tfecha_bttn | \
     bullist numlist outdent indent | removeformat | restoredraft wordcount | image media link | code | searchreplace",
          toolbar2:
            "rtl ltr | h1 h2 h3 h4 h5 h6 | selectall | emoticons | fullscreen | table | accordion",
          plugins: [
            "directionality",
            "emoticons",
            "fullscreen",
            "searchreplace",
            "textcolor",
            "lists",
            "advlist",
            "charmap",
            "wordcount ",
            "print",
            "wordcount ",
            "link",
            // "insertdatetime",
            "pagebreak",
            "image",
            "media",
            "table",
            "code",
            "accordion",
            "quickbars",
          ],

          contextmenu: "copy wordcount image",
          browser_spellcheck: true,
          images_file_types: "png,jpg,jpeg,webp,avif",
          // language: "fa",
          // language_url: "/assets/libs/tinymce_lang/fa.js",
          paste_data_images: false,
          force_p_newlines: false,
          branding: false,
          forced_root_block: "",
          block_unsupported_drop: true,
          paste_as_text: true, // forces plain text paste by default
          paste_remove_styles: true,
          paste_remove_styles_if_webkit: true,
          paste_strip_class_attributes: "all",
          images_upload_handler: async function (
            blobInfo: any,
          ): Promise<string> {
            let formData = new FormData();
            formData.append("file", blobInfo.blob());
            let result = "";
            await ApiCall(
              "POST",
              apiRoutes.UPLOAD_ATTACHMENT("CONTENT"),
              formData,
              "upload",
              ({ data }) => {
                result = `https://${data.bucket}.${data.end_point}/${data.path}/${data.name}`;
              },
              (err) => {
                result = "";
              },
            );
            return result;
          },
          image_advtab: true,
          image_class_list: [
            { title: "Empty", value: "" },
            { title: "Float Left", value: "mce-float-left" },
            { title: "Float Right", value: "mce-float-right" },
            // { title: "Rounded 10", value: "mce-rounded-10" },
            { title: "Center", value: "mce-img-center" },
          ],

          file_picker_types: "media",
          file_picker_callback: function (callback, value, meta) {
            if (meta.filetype === "media") {
              const input = document.createElement("input");
              input.setAttribute("type", "file");
              input.setAttribute("accept", "video/*"); // فقط ویدیو
              input.onchange = async function (e: any) {
                const file = e?.target?.files?.[0];

                let formData = new FormData();
                formData.append("file", file);
                await ApiCall(
                  "POST",
                  apiRoutes.UPLOAD_VIDEO(),
                  formData,
                  "upload",
                  ({ data }) => {
                    const result = `https://${data.bucket}.${data.end_point}/${data.path}/${data.name}`;
                    callback(result, {
                      title: `video-${new Date().getTime()}`,
                    });
                  },
                  (err) => {},
                );
              };
              input.click();
            }
          },
          height: "400px",
          // content_css: "dark",
          content_style: CONTENT_STYLE,
          valid_styles: {
            "*": "text-align,color,background-color,text-decoration", // ✅ allow alignment
            img: "width,height",
          },
          valid_children: "+body[details],+details[summary|div]",
          extended_valid_elements:
            "img[class|src|alt|title|width|height],a[!href|target|width|height|title|rel|ref],details[open],summary",
          setup(editor) {
            editor.on("NodeChange", (e) => {
              if (e.element.nodeName === "IMG") {
                const c = e.element.classList?.[0] || "mce-img-center";
                e.element.classList.add(c);
              } else if (e.element.nodeName === "TD") {
                const tds = editor.getDoc().querySelectorAll("td");
                tds.forEach((td) => {
                  td.classList.add(
                    "border", // border around cell
                    "border-gray-300", // Tailwind color
                    "px-2", // horizontal padding
                    "py-2", // vertical padding
                    "text-center", // align left
                  );
                });
              }
            });
            // editor.ui.registry.addButton("FAQ", {
            //   text: "FAQ",
            //   onAction: () => {
            //     const id = "acc_" + Math.random().toString(16).slice(2);
            //     editor.insertContent(`
            //         <details data-type="faq">
            //           <summary>
            //             پرسش
            //           </summary>
            //           <div id="${id}">
            //             <p>پاسخ</p>
            //           </div>
            //         </details>
            //         <p></p>
            //       `);
            //   },
            // });
          },
        }}
      />
    </div>
  );
};

export default RichTextEditor;
