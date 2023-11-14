"use client";

import { env } from "@/env.mjs";
import { signInAndSaveLink } from "@/lib/actions";
import copy from "copy-to-clipboard";
import { Copy, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState, useTransition } from "react";
import QRCode from "react-qr-code";
import { Button } from "./ui/button";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "./ui/dialog";
import { useToast } from "./ui/use-toast";

interface LinkViewPopupProps {
  link?: string;
}

const LinkViewPopup: React.FC<LinkViewPopupProps> = ({ link }) => {
  const [open, setOpen] = useState(!!link);
  const { status } = useSession();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    setOpen(!!link);
  }, [link]);

  const handleCopy = () => {
    if (!link) return;
    const copied = copy(fullShortLink);
    if (copied) {
      toast({ title: "Short link copied!" });
    }
  };

  const fullShortLink = `${env.NEXT_PUBLIC_APP_URL}/${link}`;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="flex flex-col w-fit"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogTitle className="text-2xl font-semibold tracking-tight">
          Your short link
        </DialogTitle>
        <div className="flex items-center">
          <code className="grow relative rounded bg-muted px-3 py-1 font-mono text-sm font-semibold">
            {fullShortLink}
          </code>
          <Button
            size="icon"
            variant="ghost"
            className="hover:bg-transparent"
            onClick={handleCopy}
          >
            <Copy className="w-5 h-5" />
          </Button>
        </div>
        <div className="justify-center flex py-3">
          <QRCode value={fullShortLink} />
        </div>
        {status === "unauthenticated" && (
          <div className="flex flex-col space-y-3">
            <p className="text-center text-sm font-medium px-4">
              You are not signed in. To keep links sign in and save link to your
              account.
            </p>
            <Button
              disabled={isPending}
              aria-disabled={isPending}
              onClick={() => {
                if (!link) return;
                startTransition(async () => {
                  await signInAndSaveLink(link);
                });
              }}
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign in and save
            </Button>
          </div>
        )}
        {status === "authenticated" && (
          <DialogClose>
            <Button className="w-full">Close</Button>
          </DialogClose>
        )}
      </DialogContent>
    </Dialog>
  );
};

export { LinkViewPopup };
