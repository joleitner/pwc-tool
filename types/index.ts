import { Tables } from "./supabase";

export interface NextPageProps<SlugType = string> {
  params: { slug: SlugType };
  searchParams?: any; // [key: string]: string | string[] | undefined;
}

export type User = Tables<"users"> & {
  email: string;
};

export type Participant = Tables<"participants">;

export type Survey = Tables<"surveys">;

export type PairwiseComparison = {
  id: number;
  image_1: { id: number; path: string };
  image_2: { id: number; path: string };
};
