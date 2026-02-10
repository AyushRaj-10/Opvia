import React, { useRef, useState, useEffect } from "react";

const RichTextEditorWithReorder = ({ value, onChange }) => {
  const editorRef = useRef(null);
  const [items, setItems] = useState([]);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [viewMode, setViewMode] = useState("editor"); // "editor" or "list"

  // Parse HTML to items for reordering view
  useEffect(() => {
    if (value && viewMode === "list") {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = value;
      
      const listItems = tempDiv.querySelectorAll("li");
      if (listItems.length > 0) {
        const parsedItems = Array.from(listItems).map(
          (li) => li.innerHTML.trim()
        );
        setItems(parsedItems);
      } else {
        setItems(
          value
            .split(/<br\s*\/?>/i)
            .map((line) => line.trim())
            .filter(Boolean)
        );
      }
    }
  }, [value, viewMode]);

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
  const toggleBulletList = () => execCommand("insertUnorderedList");
  const indent = () => execCommand("indent");
  const outdent = () => execCommand("outdent");

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newItems = [...items];
    const draggedItem = newItems[draggedIndex];
    
    newItems.splice(draggedIndex, 1);
    newItems.splice(index, 0, draggedItem);
    
    setItems(newItems);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    // Convert items back to HTML
    const html = `<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
    onChange(html);
  };

  const moveItemUp = (index) => {
    if (index === 0) return;
    const newItems = [...items];
    [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
    setItems(newItems);
    const html = `<ul>${newItems.map((item) => `<li>${item}</li>`).join("")}</ul>`;
    onChange(html);
  };

  const moveItemDown = (index) => {
    if (index === items.length - 1) return;
    const newItems = [...items];
    [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
    setItems(newItems);
    const html = `<ul>${newItems.map((item) => `<li>${item}</li>`).join("")}</ul>`;
    onChange(html);
  };

  const deleteItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    const html = `<ul>${newItems.map((item) => `<li>${item}</li>`).join("")}</ul>`;
    onChange(html);
  };

  const addNewItem = () => {
    const newItems = [...items, "New item"];
    setItems(newItems);
    const html = `<ul>${newItems
      .map((item) => `<li>${item.trim()}</li>`)
      .join("\n")}</ul>`;
    onChange(html);
  };
  

  const updateItem = (index, newContent) => {
    const newItems = [...items];
    newItems[index] = newContent;
    setItems(newItems);
    const html = `<ul>${newItems.map((item) => `<li>${item}</li>`).join("")}</ul>`;
    onChange(html);
  };

  return (
    <div className="border-2 rounded-lg" style={{ borderColor: "#2DD4BF" }}>
      {/* Toolbar */}
      <div className="flex gap-1 p-2 border-b-2 flex-wrap items-center" style={{ borderColor: "#2DD4BF", backgroundColor: "#F0FDFA" }}>
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

        <div className="w-px bg-gray-300 mx-1"></div>

        <button
          type="button"
          onClick={() => setViewMode(viewMode === "editor" ? "list" : "editor")}
          className="px-3 py-1 rounded hover:bg-teal-100 text-xs font-medium"
          style={{ 
            backgroundColor: viewMode === "list" ? "#0D9488" : "transparent",
            color: viewMode === "list" ? "white" : "#134E4A"
          }}
          title="Toggle reorder mode"
        >
          {viewMode === "editor" ? "📝 Edit" : "↕️ Reorder"}
        </button>
      </div>

      {/* Editor View */}
      {viewMode === "editor" && (
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          className="p-3 min-h-[120px] focus:outline-none"
          style={{ backgroundColor: "#F0FDFA", color: "#134E4A" }}
          suppressContentEditableWarning
          dangerouslySetInnerHTML={{ __html: value }}
        />
      )}

      {/* Reorder View */}
      {viewMode === "list" && (
        <div className="p-3 space-y-2" style={{ backgroundColor: "#F0FDFA" }}>
          {items.map((item, index) => (
            <div
              key={index}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className="flex items-start gap-2 p-2 rounded border-2 cursor-move hover:shadow-md transition-shadow"
              style={{ 
                borderColor: draggedIndex === index ? "#0D9488" : "#2DD4BF",
                backgroundColor: draggedIndex === index ? "#CCFBF1" : "white"
              }}
            >
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => moveItemUp(index)}
                  disabled={index === 0}
                  className="text-xs px-1 disabled:opacity-30"
                  style={{ color: "#0D9488" }}
                >
                  ▲
                </button>
                <button
                  type="button"
                  onClick={() => moveItemDown(index)}
                  disabled={index === items.length - 1}
                  className="text-xs px-1 disabled:opacity-30"
                  style={{ color: "#0D9488" }}
                >
                  ▼
                </button>
              </div>

              <div className="flex-1">
                <input
                  type="text"
                  value={item.replace(/<[^>]*>/g, "")} // Strip HTML for editing
                  onChange={(e) => updateItem(index, e.target.value)}
                  className="w-full px-2 py-1 border rounded focus:outline-none"
                  style={{ borderColor: "#2DD4BF" }}
                />
              </div>

              <button
                type="button"
                onClick={() => deleteItem(index)}
                className="text-red-600 hover:text-red-800 font-bold px-2"
              >
                ×
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addNewItem}
            className="w-full py-2 rounded-lg border-2 border-dashed font-medium hover:bg-teal-50"
            style={{ borderColor: "#2DD4BF", color: "#0D9488" }}
          >
            + Add Item
          </button>
        </div>
      )}
    </div>
  );
};

export default RichTextEditorWithReorder;