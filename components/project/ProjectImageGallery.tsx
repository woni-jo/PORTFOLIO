"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

type Props = {
  images: string[];
  title: string;
};

export default function ProjectImageGallery({ images, title }: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (selectedIndex === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedIndex(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedIndex]);

  useEffect(() => {
    if (selectedIndex === null) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [selectedIndex]);

  return (
    <>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {images.map((src, index) => (
          <button
            key={`${title}-img-${index}`}
            type="button"
            onClick={() => setSelectedIndex(index)}
            className="overflow-hidden rounded-2xl border border-line text-left transition hover:opacity-90"
            aria-label={`Open ${title} screenshot ${index + 1}`}
          >
            <Image
              className="h-full w-full object-cover"
              src={src}
              alt={`${title} screenshot ${index + 1}`}
              width={1200}
              height={720}
            />
          </button>
        ))}
      </div>

      {selectedIndex !== null ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4 md:p-8"
          onClick={() => setSelectedIndex(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative inline-flex"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedIndex(null)}
              className="absolute right-5 top-5 inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-background/90 text-foreground"
              aria-label="Close image preview"
            >
              <X size={18} />
            </button>
            <Image
              className="max-h-[88vh] w-auto max-w-full rounded-xl object-contain"
              src={images[selectedIndex]}
              alt={`${title} screenshot ${selectedIndex + 1}`}
              width={1800}
              height={1200}
              priority
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
