import React, { useRef, useCallback } from 'react';

interface HtmlEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

type FormatAction =
  | { type: 'wrap'; tag: string; attrs?: string }
  | { type: 'block'; tag: string }
  | { type: 'list'; ordered: boolean }
  | { type: 'link' }
  | { type: 'image' };

const toolbarButtons: { icon: string; title: string; action: FormatAction }[] = [
  { icon: 'B', title: 'Bold', action: { type: 'wrap', tag: 'strong' } },
  { icon: 'I', title: 'Italic', action: { type: 'wrap', tag: 'em' } },
  { icon: 'U', title: 'Underline', action: { type: 'wrap', tag: 'u' } },
  { icon: 'H1', title: 'Heading 1', action: { type: 'block', tag: 'h1' } },
  { icon: 'H2', title: 'Heading 2', action: { type: 'block', tag: 'h2' } },
  { icon: 'H3', title: 'Heading 3', action: { type: 'block', tag: 'h3' } },
  { icon: 'P', title: 'Paragraph', action: { type: 'block', tag: 'p' } },
  { icon: '•', title: 'Bullet List', action: { type: 'list', ordered: false } },
  { icon: '1.', title: 'Numbered List', action: { type: 'list', ordered: true } },
  { icon: '🔗', title: 'Link', action: { type: 'link' } },
  { icon: '🖼', title: 'Image', action: { type: 'image' } },
];

export const HtmlEditor: React.FC<HtmlEditorProps> = ({
  value,
  onChange,
  placeholder = 'Enter HTML content...',
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertAtCursor = useCallback((before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.substring(start, end);
    const newText = value.substring(0, start) + before + selected + after + value.substring(end);

    onChange(newText);

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      const newPos = start + before.length + selected.length;
      textarea.setSelectionRange(newPos, newPos);
    }, 0);
  }, [value, onChange]);

  const wrapSelection = useCallback((tag: string, attrs: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.substring(start, end) || 'text';

    const openTag = attrs ? `<${tag} ${attrs}>` : `<${tag}>`;
    const closeTag = `</${tag}>`;

    const newText = value.substring(0, start) + openTag + selected + closeTag + value.substring(end);
    onChange(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + openTag.length, start + openTag.length + selected.length);
    }, 0);
  }, [value, onChange]);

  const insertBlock = useCallback((tag: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.substring(start, end) || 'Content here';

    const block = `<${tag}>${selected}</${tag}>\n`;
    const newText = value.substring(0, start) + block + value.substring(end);
    onChange(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + tag.length + 2, start + tag.length + 2 + selected.length);
    }, 0);
  }, [value, onChange]);

  const insertList = useCallback((ordered: boolean) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.substring(start, end);

    const items = selected ? selected.split('\n').filter(Boolean) : ['Item 1', 'Item 2', 'Item 3'];
    const listItems = items.map(item => `  <li>${item}</li>`).join('\n');
    const tag = ordered ? 'ol' : 'ul';
    const list = `<${tag}>\n${listItems}\n</${tag}>\n`;

    const newText = value.substring(0, start) + list + value.substring(end);
    onChange(newText);

    setTimeout(() => {
      textarea.focus();
    }, 0);
  }, [value, onChange]);

  const insertLink = useCallback(() => {
    const url = prompt('Enter URL:', 'https://');
    if (!url) return;

    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.substring(start, end) || 'Link text';

    const link = `<a href="${url}" target="_blank" rel="noopener noreferrer">${selected}</a>`;
    const newText = value.substring(0, start) + link + value.substring(end);
    onChange(newText);

    setTimeout(() => textarea.focus(), 0);
  }, [value, onChange]);

  const insertImage = useCallback(() => {
    const src = prompt('Enter image URL:', '/screenshots/');
    if (!src) return;

    const alt = prompt('Enter alt text:', 'Screenshot');
    const img = `<img src="${src}" alt="${alt || ''}" class="rounded-lg shadow-md max-w-full" />`;
    insertAtCursor(img);
  }, [insertAtCursor]);

  const handleAction = useCallback((action: FormatAction) => {
    switch (action.type) {
      case 'wrap':
        wrapSelection(action.tag, action.attrs);
        break;
      case 'block':
        insertBlock(action.tag);
        break;
      case 'list':
        insertList(action.ordered);
        break;
      case 'link':
        insertLink();
        break;
      case 'image':
        insertImage();
        break;
    }
  }, [wrapSelection, insertBlock, insertList, insertLink, insertImage]);

  const insertTemplate = useCallback((template: string) => {
    const templates: Record<string, string> = {
      section: `<section class="py-8">
  <h2 class="text-2xl font-bold mb-4">Section Title</h2>
  <p class="text-slate-400">Your content here...</p>
</section>`,
      features: `<section class="py-8">
  <h2 class="text-2xl font-bold mb-6">Key Features</h2>
  <div class="grid md:grid-cols-2 gap-6">
    <div class="p-4 bg-white/5 rounded-lg border border-white/10">
      <h3 class="font-semibold mb-2">Feature 1</h3>
      <p class="text-slate-400">Description of feature 1</p>
    </div>
    <div class="p-4 bg-white/5 rounded-lg border border-white/10">
      <h3 class="font-semibold mb-2">Feature 2</h3>
      <p class="text-slate-400">Description of feature 2</p>
    </div>
  </div>
</section>`,
      cta: `<section class="py-8 text-center">
  <h2 class="text-2xl font-bold mb-4">Ready to Get Started?</h2>
  <p class="text-slate-400 mb-6">Start using the app today.</p>
  <a href="#" class="inline-block px-6 py-3 bg-accent-cyan text-obsidian font-bold rounded-lg hover:bg-accent-cyan/90">
    Get Started
  </a>
</section>`,
    };

    insertAtCursor(templates[template] || '');
  }, [insertAtCursor]);

  return (
    <div className="border border-white/10 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-white/[0.03] border-b border-white/10 p-2 flex flex-wrap gap-1">
        {toolbarButtons.map((btn, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleAction(btn.action)}
            className="px-2 py-1 text-sm font-medium text-slate-400 hover:text-accent-cyan hover:bg-white/5 rounded transition-colors min-w-[28px]"
            title={btn.title}
          >
            {btn.icon}
          </button>
        ))}

        <div className="w-px bg-white/10 mx-1" />

        {/* Templates dropdown */}
        <select
          onChange={(e) => {
            if (e.target.value) {
              insertTemplate(e.target.value);
              e.target.value = '';
            }
          }}
          className="px-2 py-1 text-sm text-slate-400 bg-white/5 border border-white/10 rounded hover:bg-white/10"
          defaultValue=""
        >
          <option value="" disabled>Templates</option>
          <option value="section">Section</option>
          <option value="features">Features Grid</option>
          <option value="cta">Call to Action</option>
        </select>
      </div>

      {/* Editor */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 font-mono text-sm focus:outline-none resize-y min-h-[200px] bg-white/[0.02] text-white placeholder-slate-500"
        placeholder={placeholder}
        rows={10}
      />

      {/* Footer */}
      <div className="bg-white/[0.03] border-t border-white/10 px-3 py-1.5 text-xs text-slate-500 flex justify-between items-center">
        <span>HTML mode • Use toolbar to insert formatted elements</span>
        <span className="text-slate-600">{value.length} chars</span>
      </div>
    </div>
  );
};
