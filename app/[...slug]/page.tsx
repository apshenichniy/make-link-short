import { visitShortlink } from "@/lib/actions";
import { permanentRedirect } from "next/navigation";

interface SlugPageProps {
  params: {
    slug: string[];
  };
}

export default async function SlugPage({ params: { slug } }: SlugPageProps) {
  const linkId = slug[0];
  const url = await visitShortlink(linkId);

  permanentRedirect(url);
}
