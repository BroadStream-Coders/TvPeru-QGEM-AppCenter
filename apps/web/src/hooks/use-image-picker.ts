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

  const triggerUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Revoke previous URL to avoid memory leaks
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }

      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setSelectedFile(file);
      onImageSelect?.(file, url);

      // Reset input value to allow selecting same file again
      if (e.target) e.target.value = "";
    },
    [previewUrl, onImageSelect],
  );

  const clearImage = useCallback(() => {
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setSelectedFile(null);
  }, [previewUrl]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

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
