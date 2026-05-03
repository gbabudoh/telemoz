import { redirect } from "next/navigation";

export default function ClientBriefRedirect() {
  redirect("/client/projects");
}
