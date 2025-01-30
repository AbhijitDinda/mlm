import { Editor as TinyMceEditor } from "@tinymce/tinymce-react";
import { useRef } from "react";
import { Editor as TinyMCEEditorType } from "tinymce";
import "./Editor.css";

const Editor = ({
  initialValue,
  onChangeValue,
  ...otherProps
}: {
  initialValue: string;
  onChangeValue: (value: string) => void;
  [x: string]: any;
}) => {
  const editorRef = useRef<TinyMCEEditorType | null>(null);
  const getContent = () => {
    return editorRef.current && editorRef.current.getContent();
  };

  return (
    <TinyMceEditor
      apiKey="tiny"
      onInit={(evt, editor) => (editorRef.current = editor)}
      initialValue={initialValue}
      init={{
        height: 500,
        skin: "oxide-dark",
        content_css: "dark",
        plugins: [
          "a11ychecker",
          "advlist",
          "advcode",
          "advtable",
          "autolink",
          "checklist",
          "export",
          "lists",
          "link",
          "image",
          "charmap",
          "preview",
          "anchor",
          "searchreplace",
          "visualblocks",
          "powerpaste",
          "fullscreen",
          "formatpainter",
          "insertdatetime",
          "media",
          "table",
          "help",
          "wordcount",
        ],
        toolbar:
          "undo redo | formatpainter casechange blocks | bold italic  forecolor fontsize fontfamily backcolor | " +
          "alignleft aligncenter alignright alignjustify | " +
          "bullist numlist checklist outdent indent | removeformat | a11ycheck code table help",
      }}
      onEditorChange={onChangeValue}
      {...otherProps}
    />
  );
};

export default Editor;
