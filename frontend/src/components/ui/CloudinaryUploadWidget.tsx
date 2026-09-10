'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, Loader2, CheckCircle2, Image as ImageIcon, AlertCircle, X } from 'lucide-react';

interface CloudinaryUploadWidgetProps {
  onUploadSuccess: (url: string) => void;
  folder?: string;
  currentUrl?: string;
  label?: string;
  compact?: boolean;
  aspectRatio?: 'square' | 'wide' | 'any';
}

export const CloudinaryUploadWidget: React.FC<CloudinaryUploadWidgetProps> = ({
  onUploadSuccess,
  folder = 'solonomous-labs',
  currentUrl = '',
  label = 'Upload Image to Cloudinary',
  compact = false,
  aspectRatio = 'any'
}) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string>(currentUrl);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG, WEBP, SVG).');
      return;
    }

    // 10MB limit
    if (file.size > 10 * 1024 * 1024) {
      setError('Image file must be less than 10MB.');
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const token = localStorage.getItem('solonomous_admin_token');
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);
      formData.append('altText', file.name.replace(/\.[^/.]+$/, ''));

      const res = await fetch('/api/v1/admin/media/upload', {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: formData
      }).then(r => r.json());

      if (!res.success) {
        throw new Error(res.message || 'Image upload failed');
      }

      const uploadedUrl = res.data.secureUrl || res.data.url;
      setPreview(uploadedUrl);
      onUploadSuccess(uploadedUrl);
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Upload failed. Please check network connection.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview('');
    onUploadSuccess('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-2">
      {label && <label className="block text-xs font-semibold text-slate-300">{label}</label>}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
      />

      {compact ? (
        <div className="flex items-center gap-3">
          {preview ? (
            <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-white/10 bg-black/40 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={handleClear}
                className="absolute top-0.5 right-0.5 p-0.5 bg-black/70 hover:bg-red-500 rounded-full text-white text-[9px]"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </div>
          ) : (
            <div className="w-12 h-12 rounded-xl border border-dashed border-white/15 bg-white/[0.02] flex items-center justify-center text-slate-500 shrink-0">
              <ImageIcon className="w-5 h-5" />
            </div>
          )}

          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
          >
            {uploading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading to Cloudinary...
              </>
            ) : (
              <>
                <UploadCloud className="w-3.5 h-3.5" /> Select Image
              </>
            )}
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-5 text-center transition-all cursor-pointer ${
            dragOver
              ? 'border-purple-500 bg-purple-500/10'
              : 'border-white/15 hover:border-purple-500/40 bg-white/[0.02] hover:bg-white/[0.04]'
          }`}
        >
          {preview ? (
            <div className="space-y-3">
              <div className="relative inline-block max-w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preview}
                  alt="Uploaded preview"
                  className={`mx-auto rounded-xl object-contain max-h-48 border border-white/10 ${
                    aspectRatio === 'square' ? 'w-32 h-32 object-cover' : 'w-auto'
                  }`}
                />
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute -top-2 -right-2 p-1 bg-red-600 hover:bg-red-500 rounded-full text-white shadow-md cursor-pointer"
                  title="Remove image"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Cloudinary Hosted & Optimized
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="text-[11px] text-purple-400 hover:text-purple-300 underline"
              >
                Click to replace image
              </button>
            </div>
          ) : (
            <div className="space-y-2 py-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-600/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mx-auto">
                {uploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <UploadCloud className="w-6 h-6" />}
              </div>
              <div className="text-xs font-semibold text-slate-200">
                {uploading ? 'Processing & uploading to Cloudinary...' : 'Click to upload or drag & drop'}
              </div>
              <p className="text-[11px] text-slate-400">
                PNG, JPG, WEBP, or SVG (Up to 10MB)
              </p>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
