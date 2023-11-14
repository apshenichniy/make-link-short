import { CreateLinkForm } from "@/components/create-link-form";
import { LinksStat } from "@/components/links-stat";
import { Navbar } from "@/components/navbar";
import { ShortlinksList } from "@/components/shortlinks-list";
import { auth } from "@/lib/auth";
import { Loader2 } from "lucide-react";
import { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Links Shortener",
};

export default async function Home() {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <div className="container relative max-w-3xl flex flex-col min-h-screen">
        <Navbar />
        <main className="flex flex-col grow">
          <LinksStat />
          <CreateLinkForm />
          {session?.user && (
            <Suspense
              fallback={
                <Loader2 className="self-center m-6 h-8 w-8 animate-spin" />
              }
            >
              <ShortlinksList />
            </Suspense>
          )}
        </main>
        <footer className="flex items-center py-4 text-sm text-muted-foreground">
          Created with:
          <span className="ml-2 text-primary-foreground">
            Next.js, Drizzle ORM, NeonTech PosgreSQL, Upstash Redis, Shadcn UI
          </span>
        </footer>
      </div>
    </SessionProvider>
  );
}
