import React, { useRef, useCallback, useEffect } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

type FormatCommand =
  | 'bold' | 'italic' | 'underline' | 'strikeThrough'
  | 'insertUnorderedList' | 'insertOrderedList'
  | 'justifyLeft' | 'justifyCenter' | 'justifyRight'
  | 'removeFormat';

interface ToolbarButton {
  icon: React.ReactNode;
  title: string;
  command: FormatCommand | 'heading' | 'link' | 'image' | 'divider';
  arg?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Start typing...',
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const isInternalChange = useRef(false);

  // Sync value to editor
  useEffect(() => {
    if (editorRef.current && !isInternalChange.current) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || '';
      }
    }
    isInternalChange.current = false;
  }, [value]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      isInternalChange.current = true;
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const execCommand = useCallback((command: FormatCommand, arg?: string) => {
    document.execCommand(command, false, arg);
    editorRef.current?.focus();
    handleInput();
  }, [handleInput]);

  const handleHeading = useCallback((level: string) => {
    document.execCommand('formatBlock', false, level);
    editorRef.current?.focus();
    handleInput();
  }, [handleInput]);

  const handleLink = useCallback(() => {
    const url = prompt('Enter URL:', 'https://');
    if (url) {
      document.execCommand('createLink', false, url);
      // Make links open in new tab
      const selection = window.getSelection();
      if (selection && selection.anchorNode) {
        const link = selection.anchorNode.parentElement;
        if (link?.tagName === 'A') {
          link.setAttribute('target', '_blank');
          link.setAttribute('rel', 'noopener noreferrer');
        }
      }
      handleInput();
    }
    editorRef.current?.focus();
  }, [handleInput]);

  const handleImage = useCallback(() => {
    const url = prompt('Enter image URL:', '/screenshots/');
    if (url) {
      document.execCommand('insertImage', false, url);
      handleInput();
    }
    editorRef.current?.focus();
  }, [handleInput]);

  const handleDivider = useCallback(() => {
    document.execCommand('insertHTML', false, '<hr class="my-4 border-slate-300" />');
    handleInput();
    editorRef.current?.focus();
  }, [handleInput]);

  const toolbarGroups: ToolbarButton[][] = [
    // Text formatting
    [
      { icon: <BoldIcon />, title: 'Bold (Ctrl+B)', command: 'bold' },
      { icon: <ItalicIcon />, title: 'Italic (Ctrl+I)', command: 'italic' },
      { icon: <UnderlineIcon />, title: 'Underline (Ctrl+U)', command: 'underline' },
      { icon: <StrikeIcon />, title: 'Strikethrough', command: 'strikeThrough' },
    ],
    // Headings
    [
      { icon: <span className="font-bold text-xs">H1</span>, title: 'Heading 1', command: 'heading', arg: 'h1' },
      { icon: <span className="font-bold text-xs">H2</span>, title: 'Heading 2', command: 'heading', arg: 'h2' },
      { icon: <span className="font-bold text-xs">H3</span>, title: 'Heading 3', command: 'heading', arg: 'h3' },
      { icon: <span className="text-xs">¶</span>, title: 'Paragraph', command: 'heading', arg: 'p' },
    ],
    // Lists
    [
      { icon: <ListBulletIcon />, title: 'Bullet List', command: 'insertUnorderedList' },
      { icon: <ListNumberIcon />, title: 'Numbered List', command: 'insertOrderedList' },
    ],
    // Alignment
    [
      { icon: <AlignLeftIcon />, title: 'Align Left', command: 'justifyLeft' },
      { icon: <AlignCenterIcon />, title: 'Align Center', command: 'justifyCenter' },
      { icon: <AlignRightIcon />, title: 'Align Right', command: 'justifyRight' },
    ],
    // Insert
    [
      { icon: <LinkIcon />, title: 'Insert Link', command: 'link' },
      { icon: <ImageIcon />, title: 'Insert Image', command: 'image' },
      { icon: <DividerIcon />, title: 'Insert Divider', command: 'divider' },
    ],
    // Clear
    [
      { icon: <ClearIcon />, title: 'Clear Formatting', command: 'removeFormat' },
    ],
  ];

  const handleToolbarClick = (btn: ToolbarButton) => {
    switch (btn.command) {
      case 'heading':
        handleHeading(btn.arg || 'p');
        break;
      case 'link':
        handleLink();
        break;
      case 'image':
        handleImage();
        break;
      case 'divider':
        handleDivider();
        break;
      default:
        execCommand(btn.command);
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="bg-slate-50 border-b border-gray-300 p-2 flex flex-wrap items-center gap-1">
        {toolbarGroups.map((group, groupIndex) => (
          <React.Fragment key={groupIndex}>
            {groupIndex > 0 && <div className="w-px h-6 bg-gray-300 mx-1" />}
            {group.map((btn, btnIndex) => (
              <button
                key={btnIndex}
                type="button"
                onClick={() => handleToolbarClick(btn)}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded transition-colors"
                title={btn.title}
              >
                {btn.icon}
              </button>
            ))}
          </React.Fragment>
        ))}
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onBlur={handleInput}
        className="min-h-[300px] max-h-[500px] overflow-y-auto p-4 focus:outline-none prose prose-slate max-w-none
          [&>h1]:text-3xl [&>h1]:font-bold [&>h1]:mb-4
          [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mb-3
          [&>h3]:text-xl [&>h3]:font-semibold [&>h3]:mb-2
          [&>p]:mb-3
          [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-3
          [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-3
          [&>img]:max-w-full [&>img]:rounded-lg [&>img]:my-4
          [&>a]:text-blue-600 [&>a]:underline
          [&_*]:outline-none"
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />

      {/* Footer */}
      <div className="bg-slate-50 border-t border-gray-300 px-3 py-1.5 text-xs text-slate-500 flex justify-between">
        <span>Visual editor • Select text to format</span>
        <span>{value.length} chars</span>
      </div>

      {/* Placeholder styles */}
      <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #94a3b8;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

// Icons
const BoldIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z" />
  </svg>
);

const ItalicIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 4h4m2 0l-6 16m-2 0h4" />
  </svg>
);

const UnderlineIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v7a5 5 0 0010 0V4M5 20h14" />
  </svg>
);

const StrikeIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 12H7m10-4a4 4 0 00-8 0m0 8a4 4 0 008 0" />
  </svg>
);

const ListBulletIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h.01M8 6h12M4 12h.01M8 12h12M4 18h.01M8 18h12" />
  </svg>
);

const ListNumberIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h.01M8 6h12M4 12h.01M8 12h12M4 18h.01M8 18h12" />
    <text x="2" y="8" fontSize="6" fill="currentColor">1</text>
  </svg>
);

const AlignLeftIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M3 12h12M3 18h18" />
  </svg>
);

const AlignCenterIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M6 12h12M3 18h18" />
  </svg>
);

const AlignRightIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M9 12h12M3 18h18" />
  </svg>
);

const LinkIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
  </svg>
);

const ImageIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const DividerIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 12h16" />
  </svg>
);

const ClearIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);
