import { CreateLinkForm } from "@/components/create-link-form";
import { LinksStat } from "@/components/links-stat";
import { Navbar } from "@/components/navbar";
import { UsersShortlinks } from "@/components/user-shortlinks";
import { auth } from "@/lib/auth";
import { Metadata } from "next";
import { SessionProvider } from "next-auth/react";

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
          <UsersShortlinks />
        </main>
        <footer>FOOTER</footer>
      </div>
    </SessionProvider>
  );
}
