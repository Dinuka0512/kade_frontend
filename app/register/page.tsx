import type { Metadata } from "next";
import { RegisterView } from "@/components/register-view";

export const metadata: Metadata = {
  title: "Create account",
};

export default function RegisterPage() {
  return <RegisterView />;
}
