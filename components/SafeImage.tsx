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
          "flex h-full w-full items-center justify-center bg-cream px-6 text-center text-sm font-medium uppercase tracking-[0.16em] text-burgundy",
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
