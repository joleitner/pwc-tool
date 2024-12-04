import { Database, Tables } from "./supabase";

export type User = Tables<"users"> & {
    email: string;
};

export type Participant = Tables<"participants">

export type Survey = Tables<"surveys">