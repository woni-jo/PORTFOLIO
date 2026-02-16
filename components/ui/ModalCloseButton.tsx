"use client";

import { useRouter } from "next/navigation";
import { X } from "lucide-react";

export default function ModalCloseButton() {
  const router = useRouter();

  const closeModal = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }
    router.push("/");
  };

  return (
    <button
      type="button"
      onClick={closeModal}
      aria-label="Close details modal"
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-background/90 text-foreground transition hover:bg-surface"
    >
      <X size={18} />
    </button>
  );
}
