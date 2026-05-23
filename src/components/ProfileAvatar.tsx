"use client";

import { useRef, useState } from "react";
import { useProfileStore } from "@/lib/profileStore";
import { useToastStore } from "@/lib/toastStore";
import { Camera, Loader2 } from "lucide-react";
import Image from "next/image";

export function ProfileAvatar() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { avatarUrl, setAvatarUrl } = useProfileStore();
  const toast = useToastStore((s) => s.toast);
  const [isUploading, setIsUploading] = useState(false);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const res = await fetch("/api/profile/avatar", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        toast({
          title: "Upload Failed",
          message: data.error ?? "Something went wrong during upload.",
          type: "error",
          duration: 4000,
        });
        return;
      }

      setAvatarUrl(data.url);
      toast({
        title: "Avatar Updated",
        message: "Your new profile picture has been saved successfully.",
        type: "success",
        duration: 3500,
      });
    } catch {
      toast({
        title: "Upload Failed",
        message: "Could not connect to the server. Please try again.",
        type: "error",
        duration: 4000,
      });
    } finally {
      setIsUploading(false);
      // Reset so re-selecting the same file works
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        className="hidden"
        onChange={handleFileChange}
        aria-label="Upload profile picture"
      />

      {/* Avatar button */}
      <button
        id="profile-avatar-btn"
        onClick={handleClick}
        disabled={isUploading}
        title="Click to change profile picture"
        className="relative group w-10 h-10 rounded-full flex-shrink-0 overflow-hidden border-2 border-black shadow-neobrutalist transition-all duration-200 hover:scale-105 hover:border-[#00f7ff] focus:outline-none focus:border-[#00f7ff] disabled:cursor-not-allowed"
      >
        {/* Avatar image or gradient fallback */}
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt="Profile picture"
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#00f7ff] to-[#6b00ff]" />
        )}

        {/* Upload loading overlay */}
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10">
            <Loader2 className="w-4 h-4 text-white animate-spin" />
          </div>
        )}

        {/* Camera icon hover overlay */}
        {!isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <Camera className="w-4 h-4 text-white" />
          </div>
        )}
      </button>
    </>
  );
}
