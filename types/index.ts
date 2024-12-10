import { Tables } from "./supabase";

export type NextPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

export type User = Tables<"users"> & {
  email: string;
};

export type Registrations = Tables<"registrations">;

export type Survey = Tables<"surveys">;

export type PairwiseComparison = {
  id: number;
  image_1: number;
  image_2: number;
};

export type Participation = Tables<"participations"> & {
  survey: {
    id: number;
    image_count: number;
  };
};
