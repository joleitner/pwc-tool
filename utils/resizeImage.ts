export const resizeImage = async (
  file: File,
  {
    maxSize = 1920,
    type = file.type,
    quality = 1,
  }: { maxSize?: number; type?: string; quality?: number }
) => {
  const imageBitmap = await createImageBitmap(file);

  // Calculate new size
  const { width, height } = imageBitmap;
  const aspectRatio = width / height;
  const isLandScape = width > height;
  const newWidth = isLandScape ? maxSize : maxSize * aspectRatio;
  const newHeight = isLandScape ? maxSize / aspectRatio : maxSize;

  // Set canvas size and draw image
  const canvas = document.createElement("canvas");
  canvas.width = newWidth;
  canvas.height = newHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not resize image");
  ctx.drawImage(imageBitmap, 0, 0, newWidth, newHeight);

  // convert canvas to blob
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject("Failed to convert canvas to blob"),
      type,
      quality
    );
  });

  // turn blob into file
  const filename = `${file.name.split(".")[0]}.${type.split("/")[1]}`;
  return new File([blob], filename, { type });
};
