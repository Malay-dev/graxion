"use client";

import type React from "react";
import { useState, useCallback } from "react";
import { FileInput } from "../components/ui/file-input";

interface ImageUploaderProps {
  onImageUploaded: (url: string) => void;
  previewUrl: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageUploaded,
  previewUrl,
}) => {
  const [, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          onImageUploaded(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    [onImageUploaded]
  );

  return (
    <div>
      {previewUrl ? (
        <div className="relative aspect-video w-full max-h-[150px] overflow-hidden rounded-lg bg-muted/50 mb-2">
          <img
            src={previewUrl || "/placeholder.svg"}
            alt="Uploaded image"
            className="object-contain w-full h-full"
          />
        </div>
      ) : null}
      <FileInput onFileChange={handleFileChange} />
    </div>
  );
};

export default ImageUploader;
