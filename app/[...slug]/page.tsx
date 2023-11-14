import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { findShortlink, updateShortlinkVisits } from "@/lib/actions";
import { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Access to the short link",
};

interface SlugPageProps {
  params: {
    slug: string[];
  };
}

export default async function SlugPage({ params: { slug } }: SlugPageProps) {
  const shortLink = await findShortlink(slug[0]);
  if (!shortLink) notFound();

  const { id, url, password, visits } = shortLink;

  if (!password) {
    updateShortlinkVisits(id, visits + 1);
    permanentRedirect(url);
  }

  return (
    <div className="container max-w-xl flex flex-col justify-center h-screen space-y-4">
      <div className="text-center text-3xl font-semibold tracking-tight mb-4">
        Short link is protected
      </div>
      <form className="flex flex-col space-y-4">
        <Input placeholder="Enter password" className="text-lg h-12" />
        <SubmitButton>Submit</SubmitButton>
      </form>
    </div>
  );
}
