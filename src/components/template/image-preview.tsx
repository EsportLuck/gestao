"use client";

import { FC, useState } from "react";
import { Input } from "@/components/ui";

export const ImagePreview: FC<{ src: string; alt: string }> = ({
  src,
  alt,
}) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
  };
  return (
    <div className="relative w-full h-full">
      <Input onChange={handleImageChange}></Input>
      <ImagePreview src={src} alt={alt} />
    </div>
  );
};
