import React, { useRef, useState } from "react";

const RichTextEditor = ({ value, onChange }) => {
  const editorRef = useRef(null);
  const [isBulletList, setIsBulletList] = useState(false);

  const handleInput = () => {
    const content = editorRef.current.innerHTML;
    onChange(content);
  };

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
    handleInput();
  };

  const toggleBold = () => execCommand("bold");
  const toggleItalic = () => execCommand("italic");
  const toggleUnderline = () => execCommand("underline");
  
  const toggleBulletList = () => {
    execCommand("insertUnorderedList");
    setIsBulletList(!isBulletList);
  };

  const indent = () => execCommand("indent");
  const outdent = () => execCommand("outdent");

  return (
    <div className="border-2 rounded-lg" style={{ borderColor: "#2DD4BF" }}>
      {/* Toolbar */}
      <div className="flex gap-1 p-2 border-b-2 flex-wrap" style={{ borderColor: "#2DD4BF", backgroundColor: "#F0FDFA" }}>
        <button
          type="button"
          onClick={toggleBold}
          className="px-3 py-1 rounded hover:bg-teal-100 font-bold"
          title="Bold (Ctrl+B)"
          style={{ color: "#134E4A" }}
        >
          B
        </button>
        
        <button
          type="button"
          onClick={toggleItalic}
          className="px-3 py-1 rounded hover:bg-teal-100 italic"
          title="Italic (Ctrl+I)"
          style={{ color: "#134E4A" }}
        >
          I
        </button>
        
        <button
          type="button"
          onClick={toggleUnderline}
          className="px-3 py-1 rounded hover:bg-teal-100 underline"
          title="Underline (Ctrl+U)"
          style={{ color: "#134E4A" }}
        >
          U
        </button>

        <div className="w-px bg-gray-300 mx-1"></div>

        <button
          type="button"
          onClick={toggleBulletList}
          className="px-3 py-1 rounded hover:bg-teal-100"
          title="Bullet List"
          style={{ color: "#134E4A" }}
        >
          • List
        </button>

        <button
          type="button"
          onClick={indent}
          className="px-3 py-1 rounded hover:bg-teal-100"
          title="Indent"
          style={{ color: "#134E4A" }}
        >
          →
        </button>

        <button
          type="button"
          onClick={outdent}
          className="px-3 py-1 rounded hover:bg-teal-100"
          title="Outdent"
          style={{ color: "#134E4A" }}
        >
          ←
        </button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="p-3 min-h-[120px] focus:outline-none"
        style={{ backgroundColor: "#F0FDFA", color: "#134E4A" }}
        suppressContentEditableWarning
        dangerouslySetInnerHTML={{ __html: value }}
      />
    </div>
  );
};

export default RichTextEditor;