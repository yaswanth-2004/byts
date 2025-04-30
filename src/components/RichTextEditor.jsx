
import { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],
  [{ 'header': 1 }, { 'header': 2 }],
  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
  [{ 'script': 'sub'}, { 'script': 'super' }],
  [{ 'indent': '-1'}, { 'indent': '+1' }],
  [{ 'direction': 'rtl' }],
  [{ 'size': ['small', false, 'large', 'huge'] }],
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  [{ 'color': [] }, { 'background': [] }],
  [{ 'font': [] }],
  [{ 'align': [] }],
  ['clean'],
  ['link', 'image', 'video']
];

const RichTextEditor = ({ value, onChange, placeholder = 'Write something amazing...' }) => {
  const [editorValue, setEditorValue] = useState(value || '');
  const [mounted, setMounted] = useState(false);
  
  // Handle client-side only rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (value !== undefined) {
      setEditorValue(value);
    }
  }, [value]);
  
  const handleChange = (content) => {
    setEditorValue(content);
    if (onChange) {
      onChange(content);
    }
  };
  
  if (!mounted) {
    return (
      <div className="border rounded-md min-h-[200px] p-4 bg-muted/20">
        <p className="text-muted-foreground">{placeholder}</p>
      </div>
    );
  }
  
  return (
    <div className="rich-text-editor">
      <ReactQuill
        theme="snow"
        value={editorValue}
        onChange={handleChange}
        modules={{
          toolbar: toolbarOptions,
        }}
        placeholder={placeholder}
        className="bg-background rounded-md"
      />
      <style jsx global>{`
        .ql-toolbar {
          border-top-left-radius: 0.375rem;
          border-top-right-radius: 0.375rem;
          background-color: hsl(var(--muted));
          border-color: hsl(var(--border));
        }
        .ql-container {
          font-family: inherit;
          font-size: 1rem;
          min-height: 200px;
          border-bottom-left-radius: 0.375rem;
          border-bottom-right-radius: 0.375rem;
          border-color: hsl(var(--border));
        }
        .ql-editor {
          min-height: 200px;
        }
        .ql-editor.ql-blank::before {
          color: hsl(var(--muted-foreground));
          font-style: normal;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
