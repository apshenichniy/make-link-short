import { CheckPasswordForm } from "@/components/check-password-form";
import { buttonVariants } from "@/components/ui/button";
import { env } from "@/env.mjs";
import { findShortlink, updateShortlinkVisits } from "@/lib/actions";
import { isAfter, parseISO } from "date-fns";
import { Metadata } from "next";
import Link from "next/link";
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

  const { id, url, password, visits, expires } = shortLink;

  // check expiration
  if (expires && isAfter(new Date(), parseISO(expires.toString()))) {
    return <ExpiredLink />;
  }

  if (!password) {
    updateShortlinkVisits(id, visits + 1);
    permanentRedirect(url);
  }

  return (
    <div className="container max-w-xl flex flex-col justify-center h-screen space-y-4">
      <div className="text-center text-3xl font-semibold tracking-tight mb-4">
        Short link is protected
      </div>
      <CheckPasswordForm shortLink={shortLink} />
    </div>
  );
}

const ExpiredLink = () => {
  return (
    <div className="container max-w-md flex flex-col justify-center h-screen space-y-4">
      <div className="text-center text-3xl font-semibold tracking-tight mb-4">
        Short link is expired
      </div>
      <Link href={env.AUTH_URL} className={buttonVariants()}>
        Home
      </Link>
    </div>
  );
};
