'use client';

import React, { useState, useRef } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  Table as TableIcon,
  Minus,
  Eye,
  Edit3,
  Columns,
  Loader2,
  Undo,
  Redo
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Write your article or content here...',
  minHeight = '320px'
}) => {
  const [viewMode, setViewMode] = useState<'edit' | 'preview' | 'split'>('edit');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [history, setHistory] = useState<string[]>([value]);
  const [historyIdx, setHistoryIdx] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const imageUploadInputRef = useRef<HTMLInputElement>(null);

  // Update value and maintain history
  const updateContent = (newContent: string) => {
    onChange(newContent);
    const newHist = history.slice(0, historyIdx + 1);
    newHist.push(newContent);
    if (newHist.length > 50) newHist.shift();
    setHistory(newHist);
    setHistoryIdx(newHist.length - 1);
  };

  const handleUndo = () => {
    if (historyIdx > 0) {
      const prev = history[historyIdx - 1];
      setHistoryIdx(historyIdx - 1);
      onChange(prev);
    }
  };

  const handleRedo = () => {
    if (historyIdx < history.length - 1) {
      const next = history[historyIdx + 1];
      setHistoryIdx(historyIdx + 1);
      onChange(next);
    }
  };

  // Helper to wrap or prepend text at cursor
  const insertFormatting = (prefix: string, suffix = '', defaultText = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end) || defaultText;

    const replacement = `${prefix}${selectedText}${suffix}`;
    const newContent = value.substring(0, start) + replacement + value.substring(end);

    updateContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selectedText.length
      );
    }, 10);
  };

  const insertLinePrefix = (prefix: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    const lineEnd = value.indexOf('\n', end);
    const actualLineEnd = lineEnd === -1 ? value.length : lineEnd;

    const currentLine = value.substring(lineStart, actualLineEnd);
    const newLine = `${prefix}${currentLine}`;
    const newContent = value.substring(0, lineStart) + newLine + value.substring(actualLineEnd);

    updateContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(lineStart + newLine.length, lineStart + newLine.length);
    }, 10);
  };

  // Direct Cloudinary image upload and inline Markdown insertion
  const handleInlineImageUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setUploadingImage(true);

    try {
      const token = localStorage.getItem('solonomous_admin_token');
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'solonomous-labs/blog');
      formData.append('altText', file.name.replace(/\.[^/.]+$/, ''));

      const res = await fetch('/api/v1/admin/media/upload', {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: formData
      }).then(r => r.json());

      if (res.success && res.data) {
        const imageUrl = res.data.secureUrl || res.data.url;
        const altText = file.name.replace(/\.[^/.]+$/, '');
        insertFormatting(`\n![${altText}](${imageUrl})\n`, '', '');
      }
    } catch (err) {
      console.error('Failed to upload inline image:', err);
    } finally {
      setUploadingImage(false);
    }
  };

  // Insert Table template
  const insertTable = () => {
    const tableTemplate = `\n| Column 1 | Column 2 | Column 3 |\n| :--- | :--- | :--- |\n| Data A | Data B | Data C |\n| Data D | Data E | Data F |\n\n`;
    insertFormatting(tableTemplate, '', '');
  };

  // Insert Link
  const insertLink = () => {
    const url = prompt('Enter link URL (e.g., https://example.com):', 'https://');
    if (url) {
      insertFormatting('[', `](${url})`, 'Link Text');
    }
  };

  // Quick word & character counts
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const charCount = value.length;

  return (
    <div className="border border-white/10 rounded-2xl bg-[#0F0E17] overflow-hidden shadow-xl">
      {/* Hidden file input for image upload toolbar button */}
      <input
        ref={imageUploadInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleInlineImageUpload(e.target.files[0]);
          }
        }}
      />

      {/* Main Toolbar */}
      <div className="flex flex-wrap items-center justify-between p-2.5 bg-black/40 border-b border-white/10 gap-2">
        {/* Formatting Group */}
        <div className="flex flex-wrap items-center gap-1">
          {/* Undo / Redo */}
          <button
            type="button"
            onClick={handleUndo}
            disabled={historyIdx <= 0}
            title="Undo (Ctrl+Z)"
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer transition-colors"
          >
            <Undo className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleRedo}
            disabled={historyIdx >= history.length - 1}
            title="Redo"
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer transition-colors"
          >
            <Redo className="w-3.5 h-3.5" />
          </button>

          <div className="w-[1px] h-4 bg-white/10 mx-1" />

          {/* Text Style: Bold, Italic, Underline, Strikethrough */}
          <button
            type="button"
            onClick={() => insertFormatting('**', '**', 'bold text')}
            title="Bold (**text**)"
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer transition-colors"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('*', '*', 'italic text')}
            title="Italic (*text*)"
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer transition-colors"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('<u>', '</u>', 'underlined text')}
            title="Underline (<u>text</u>)"
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer transition-colors"
          >
            <Underline className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('~~', '~~', 'strikethrough')}
            title="Strikethrough (~~text~~)"
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer transition-colors"
          >
            <Strikethrough className="w-3.5 h-3.5" />
          </button>

          <div className="w-[1px] h-4 bg-white/10 mx-1" />

          {/* Headings */}
          <button
            type="button"
            onClick={() => insertLinePrefix('# ')}
            title="Heading 1"
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer transition-colors"
          >
            <Heading1 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertLinePrefix('## ')}
            title="Heading 2"
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer transition-colors"
          >
            <Heading2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertLinePrefix('### ')}
            title="Heading 3"
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer transition-colors"
          >
            <Heading3 className="w-3.5 h-3.5" />
          </button>

          <div className="w-[1px] h-4 bg-white/10 mx-1" />

          {/* Lists & Quotes */}
          <button
            type="button"
            onClick={() => insertLinePrefix('- ')}
            title="Bulleted List"
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer transition-colors"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertLinePrefix('1. ')}
            title="Numbered List"
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer transition-colors"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertLinePrefix('> ')}
            title="Blockquote"
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer transition-colors"
          >
            <Quote className="w-3.5 h-3.5" />
          </button>

          <div className="w-[1px] h-4 bg-white/10 mx-1" />

          {/* Code, Table, Divider */}
          <button
            type="button"
            onClick={() => insertFormatting('```typescript\n', '\n```', '// code here')}
            title="Code Block"
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer transition-colors"
          >
            <Code className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={insertTable}
            title="Insert Table"
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer transition-colors"
          >
            <TableIcon className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('\n---\n', '', '')}
            title="Horizontal Divider"
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          <div className="w-[1px] h-4 bg-white/10 mx-1" />

          {/* Link & Cloudinary Upload */}
          <button
            type="button"
            onClick={insertLink}
            title="Insert Link"
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer transition-colors"
          >
            <LinkIcon className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            disabled={uploadingImage}
            onClick={() => imageUploadInputRef.current?.click()}
            title="Upload Image to Cloudinary & Insert"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 text-xs font-semibold cursor-pointer transition-colors"
          >
            {uploadingImage ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" /> Uploading...
              </>
            ) : (
              <>
                <ImageIcon className="w-3 h-3" /> Insert Cloudinary Image
              </>
            )}
          </button>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/5 text-xs">
          <button
            type="button"
            onClick={() => setViewMode('edit')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1 ${
              viewMode === 'edit'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Edit3 className="w-3 h-3" /> Write
          </button>
          <button
            type="button"
            onClick={() => setViewMode('split')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all hidden md:flex items-center gap-1 ${
              viewMode === 'split'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Columns className="w-3 h-3" /> Split
          </button>
          <button
            type="button"
            onClick={() => setViewMode('preview')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1 ${
              viewMode === 'preview'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3 h-3" /> Preview
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div
        className={`grid ${
          viewMode === 'split' ? 'grid-cols-1 md:grid-cols-2 divide-x divide-white/10' : 'grid-cols-1'
        }`}
        style={{ minHeight }}
      >
        {/* Write Textarea */}
        {(viewMode === 'edit' || viewMode === 'split') && (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => updateContent(e.target.value)}
            placeholder={placeholder}
            className="w-full h-full p-4 bg-transparent text-white font-mono text-xs leading-relaxed focus:outline-hidden resize-y"
            style={{ minHeight }}
          />
        )}

        {/* Live Preview */}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <div
            className="p-5 overflow-y-auto bg-black/20 text-slate-200 text-xs leading-relaxed space-y-3 prose prose-invert max-w-none"
            style={{ minHeight }}
          >
            {value.trim() ? (
              <div className="space-y-3">
                {value.split('\n\n').map((block, idx) => {
                  if (block.startsWith('# ')) {
                    return <h1 key={idx} className="text-xl font-bold font-display text-white">{block.replace('# ', '')}</h1>;
                  }
                  if (block.startsWith('## ')) {
                    return <h2 key={idx} className="text-lg font-bold font-display text-white mt-4">{block.replace('## ', '')}</h2>;
                  }
                  if (block.startsWith('### ')) {
                    return <h3 key={idx} className="text-base font-bold font-display text-white mt-2">{block.replace('### ', '')}</h3>;
                  }
                  if (block.startsWith('> ')) {
                    return (
                      <blockquote key={idx} className="border-l-2 border-purple-500 pl-3 italic text-slate-400 my-2">
                        {block.replace('> ', '')}
                      </blockquote>
                    );
                  }
                  if (block.startsWith('```')) {
                    return (
                      <pre key={idx} className="bg-black/60 border border-white/10 p-3 rounded-xl font-mono text-[11px] overflow-x-auto text-purple-300">
                        <code>{block.replace(/```[a-z]*\n?/g, '')}</code>
                      </pre>
                    );
                  }
                  if (block.startsWith('![')) {
                    const match = block.match(/!\[(.*?)\]\((.*?)\)/);
                    if (match) {
                      return (
                        <div key={idx} className="my-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={match[2]} alt={match[1]} className="rounded-xl max-h-72 object-contain border border-white/10" />
                          {match[1] && <div className="text-[10px] text-slate-500 italic mt-1">{match[1]}</div>}
                        </div>
                      );
                    }
                  }
                  if (block.startsWith('- ')) {
                    const items = block.split('\n').map(i => i.replace(/^- /, ''));
                    return (
                      <ul key={idx} className="list-disc pl-5 space-y-1">
                        {items.map((it, i) => <li key={i}>{it}</li>)}
                      </ul>
                    );
                  }
                  if (block.startsWith('1. ')) {
                    const items = block.split('\n').map(i => i.replace(/^\d+\.\s*/, ''));
                    return (
                      <ol key={idx} className="list-decimal pl-5 space-y-1">
                        {items.map((it, i) => <li key={i}>{it}</li>)}
                      </ol>
                    );
                  }
                  return <p key={idx} className="text-slate-300 leading-relaxed whitespace-pre-line">{block}</p>;
                })}
              </div>
            ) : (
              <div className="text-slate-500 italic text-center py-12">
                Live formatted preview will render here as you type...
              </div>
            )}
          </div>
        )}
      </div>

      {/* Editor Footer / Stats */}
      <div className="flex items-center justify-between px-4 py-2 bg-black/40 border-t border-white/5 text-[11px] text-slate-400">
        <div className="flex items-center gap-4">
          <span>{wordCount} words</span>
          <span>•</span>
          <span>{charCount} characters</span>
          <span>•</span>
          <span>~{Math.max(1, Math.ceil(wordCount / 200))} min read</span>
        </div>
        <div className="text-[10px] text-purple-400 font-mono">
          Markdown + Word Toolbar Enabled
        </div>
      </div>
    </div>
  );
};
