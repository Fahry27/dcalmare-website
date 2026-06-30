"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

type SafeImageProps = ImageProps & {
  fallbackLabel: string;
  fallbackClassName?: string;
};

export default function SafeImage({
  fallbackLabel,
  fallbackClassName,
  className,
  alt,
  ...props
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={cn(
          "flex h-full w-full items-center justify-center break-words bg-cream px-4 text-center text-sm font-medium uppercase tracking-[0.12em] text-burgundy sm:px-6 sm:tracking-[0.16em]",
          fallbackClassName
        )}
        role="img"
        aria-label={alt}
      >
        {fallbackLabel}
      </div>
    );
  }

  return (
    <Image
      {...props}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
    />
  );
}
