import { Tables } from "./supabase";

export type NextPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

export type User = Tables<"users">;

export type Registrations = Tables<"registrations">;

export type Survey = Tables<"surveys">;

export type Suggestion = Tables<"suggestions"> & {
  user: {
    name: string;
  };
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
  participations: {
    user: { id: string; name: string };
    started: string | null;
    finished: string | null;
    comparison_count: number;
    initial: boolean;
  }[];
  comparison_count: number;
  images: { id: number; path: string }[];
};
