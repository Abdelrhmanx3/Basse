import { cookies } from "next/headers";
import type { Language } from "../context/LangContext";

export async function getServerLanguage(): Promise<Language> {
  const cookieStore = await cookies();
  return cookieStore.get("store-language")?.value === "ar" ? "ar" : "en";
}
