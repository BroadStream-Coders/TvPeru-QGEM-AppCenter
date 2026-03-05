"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface UseImagePickerOptions {
  onImageSelect?: (file: File, previewUrl: string) => void;
  initialPreview?: string | null;
}

export function useImagePicker(options: UseImagePickerOptions = {}) {
  const { onImageSelect, initialPreview } = options;
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialPreview || null,
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const ownedUrls = useRef<Set<string>>(new Set());

  const triggerUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Revoke previous URL only if we own it
      if (previewUrl && ownedUrls.current.has(previewUrl)) {
        console.log(`[useImagePicker] Revoking owned URL: ${previewUrl}`);
        URL.revokeObjectURL(previewUrl);
        ownedUrls.current.delete(previewUrl);
      }

      const url = URL.createObjectURL(file);
      ownedUrls.current.add(url);
      console.log(`[useImagePicker] Created new owned URL: ${url}`);

      setPreviewUrl(url);
      setSelectedFile(file);
      onImageSelect?.(file, url);

      // Reset input value to allow selecting same file again
      if (e.target) e.target.value = "";
    },
    [previewUrl, onImageSelect],
  );

  const clearImage = useCallback(() => {
    if (previewUrl && ownedUrls.current.has(previewUrl)) {
      console.log(
        `[useImagePicker] Clearing & Revoking owned URL: ${previewUrl}`,
      );
      URL.revokeObjectURL(previewUrl);
      ownedUrls.current.delete(previewUrl);
    }
    setPreviewUrl(null);
    setSelectedFile(null);
  }, [previewUrl]);

  // Cleanup on unmount
  useEffect(() => {
    const urlsToCleanup = ownedUrls.current;
    return () => {
      urlsToCleanup.forEach((url) => {
        console.log(`[useImagePicker] Unmount Cleanup: Revoking ${url}`);
        URL.revokeObjectURL(url);
      });
      urlsToCleanup.clear();
    };
  }, []);

  return {
    previewUrl,
    selectedFile,
    fileInputRef,
    triggerUpload,
    handleFileChange,
    clearImage,
    setPreviewUrl, // For manual updates when loading external data
  };
}
