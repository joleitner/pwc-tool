import { createClientSupabase } from "./supabase/supabase.client";

export const useFileUtils = () => {
  const supabase = createClientSupabase();

  // function to upload files
  const uploadFile = async (filePath: string, file: File) => {
    if (!file) return;
    const { data, error } = await supabase.storage
      .from("group-images")
      .upload(filePath, file, {
        cacheControl: "1",
        upsert: true,
      });
    if (error) throw error;

    return data;
  };

  const deleteFile = async (filePath: string) => {
    const { error } = await supabase.storage
      .from("goup-images")
      .remove([filePath]);
    if (error) throw error;
  };

  const getSignedFileUrl = async (filePath: string, valid: number = 3600) => {
    const { data, error } = await supabase.storage
      .from("group-images")
      .createSignedUrl(filePath, valid, {
        transform: {
          width: 700,
          height: 700,
          resize: "contain",
        },
      });
    if (error) throw error;

    return data?.signedUrl;
  };

  return { uploadFile, deleteFile, getSignedFileUrl };
};
