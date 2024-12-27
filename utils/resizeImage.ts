export const resizeImage = async (
  file: File,
  {
    maxSize = 1920,
    type = file.type,
    quality = 1,
  }: { maxSize?: number; type?: string; quality?: number }
) => {
  // Detect Safari (both desktop and iOS)
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  const outputType = isSafari && type === "image/webp" ? "image/jpeg" : type;

  // Load the image as a Data URL
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  // Create an image element
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = dataUrl;
  });

  // Determine new dimensions based on the aspect ratio
  const { width, height } = image;
  const aspectRatio = width / height;
  const newWidth = width > height ? maxSize : maxSize * aspectRatio;
  const newHeight = width > height ? maxSize / aspectRatio : maxSize;

  // Create a canvas and resize the image
  const canvas = document.createElement("canvas");
  canvas.width = newWidth;
  canvas.height = newHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to create canvas context");

  // Draw the resized image on the canvas
  ctx.drawImage(image, 0, 0, newWidth, newHeight);

  // Convert the canvas to a blob
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject("Failed to convert canvas to blob"),
      outputType,
      quality
    );
  });

  // Return the resized image as a File
  const filename = `${file.name.split(".")[0]}.${outputType.split("/")[1]}`;
  return new File([blob], filename, { type: outputType });
};
