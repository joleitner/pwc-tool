import { Database } from "./supabase";

export type User = Database["public"]["Tables"]["users"]["Row"] & {
    email: string;
};

export type Participant = Database["public"]["Tables"]["participants"]["Row"]