import { useEditor, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { RichTextEditor, Link } from "@mantine/tiptap";
import "./styles.scss";
import Placeholder from "@tiptap/extension-placeholder";

export function RichEditor({
  onChange,
  placeholder = "",
  value = "",
  readonly = false,
}: {
  onChange?: (value: string) => void;
  placeholder?: string;
  value?: string;
  readonly?: boolean;
}) {
  const editor = useEditor({
    extensions: [StarterKit, Placeholder.configure({ placeholder }), Link],
    content: value,
    editable: !readonly,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  return (
    <RichTextEditor
      editor={editor}
      className={`rich-editor ${readonly ? "readonly" : ""}`}
      // styles={{
      //   content: {
      //     padding: 0,
      //   },
      // }}
      // style={{
      //   padding: "0px !important",
      //   border: "none",
      // }}
    >
      {editor && (
        <BubbleMenu editor={editor}>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
            <RichTextEditor.Link />
          </RichTextEditor.ControlsGroup>
        </BubbleMenu>
      )}
      <RichTextEditor.Content />
    </RichTextEditor>
  );
}
