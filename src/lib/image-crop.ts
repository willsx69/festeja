export type CropSize = {
  width: number;
  height: number;
};

export type CropOffset = {
  x: number;
  y: number;
};

export type CropRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function coverScale(image: CropSize, frame: CropSize): number {
  if (image.width <= 0 || image.height <= 0 || frame.width <= 0 || frame.height <= 0) {
    return 1;
  }
  return Math.max(frame.width / image.width, frame.height / image.height);
}

export function displayedImageSize(
  image: CropSize,
  frame: CropSize,
  zoom: number,
): CropSize {
  const scale = coverScale(image, frame) * Math.max(1, zoom);
  return {
    width: image.width * scale,
    height: image.height * scale,
  };
}

export function offsetBounds(
  image: CropSize,
  frame: CropSize,
  zoom: number,
): CropOffset {
  const displayed = displayedImageSize(image, frame, zoom);
  return {
    x: Math.max(0, (displayed.width - frame.width) / 2),
    y: Math.max(0, (displayed.height - frame.height) / 2),
  };
}

export function clampOffset(
  image: CropSize,
  frame: CropSize,
  zoom: number,
  offset: CropOffset,
): CropOffset {
  const bounds = offsetBounds(image, frame, zoom);
  return {
    x: clamp(offset.x, -bounds.x, bounds.x),
    y: clamp(offset.y, -bounds.y, bounds.y),
  };
}

export function cropRect(
  image: CropSize,
  frame: CropSize,
  zoom: number,
  offset: CropOffset,
): CropRect {
  const displayed = displayedImageSize(image, frame, zoom);
  const safeOffset = clampOffset(image, frame, zoom, offset);
  return {
    left: frame.width / 2 + safeOffset.x - displayed.width / 2,
    top: frame.height / 2 + safeOffset.y - displayed.height / 2,
    width: displayed.width,
    height: displayed.height,
  };
}

export function outputSizeForFrame(frame: CropSize, outputWidth: number): CropSize {
  if (frame.width <= 0 || outputWidth <= 0) {
    return { width: 0, height: 0 };
  }
  return {
    width: Math.round(outputWidth),
    height: Math.round((frame.height / frame.width) * outputWidth),
  };
}
