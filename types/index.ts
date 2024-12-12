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

export type PWCResult = Tables<"pwc_results">;
export type Questionnaire = Tables<"questionnaires">;

export type DetailedSurvey = Survey & {
  participations: { user: string; finished: boolean }[];
  comparison_count: number;
  pwc_results: PWCResult[];
  questionnaires: Questionnaire[];
};
