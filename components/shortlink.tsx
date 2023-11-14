"use client";

import { ShortlinkData, deleteShortlink } from "@/lib/actions";
import { format } from "date-fns";
import { Eye, Info, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { LinkViewPopup } from "./link-view-popup";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

const Shortlink: React.FC<{ link: ShortlinkData }> = ({ link }) => {
  const [isPending, startTransition] = useTransition();
  const [openLink, setOpenLink] = useState<string | undefined>();

  return (
    <Card className="p-4 flex flex-col space-y-4">
      <LinkViewPopup link={openLink} onClose={() => setOpenLink(undefined)} />
      <div className="flex items-center justify-end text-sm font-medium">
        <Eye className="w-4 h-4 mr-2" strokeWidth={1.5} />
        {link.visits}
        {link.lastVisit && (
          <div className="inline ml-4">
            Last visit: {format(link.lastVisit, "PP")}
          </div>
        )}
        {link.createdAt && (
          <div className="inline ml-4">
            Created at: {format(link.createdAt, "PP")}
          </div>
        )}
      </div>
      <div className="flex flex-col space-y-2">
        <Link href={link.url} className="text-sm font-medium" target="_blank">
          <code className="rounded bg-muted px-3 py-1 font-mono text-sm font-semibold">
            {link.url}
          </code>
        </Link>
        {link.title && (
          <div className="text-xs px-3 font-medium text-muted-foreground">
            {link.title}
          </div>
        )}
      </div>
      <div className="flex justify-end space-x-4">
        <Button
          onClick={() => {
            setOpenLink(link.id);
          }}
        >
          <Info className="w-5 h-5 mr-2" />
          Info
        </Button>
        <Button
          variant="destructive"
          disabled={isPending}
          aria-disabled={isPending}
          onClick={() => {
            startTransition(async () => {
              await deleteShortlink(link.id);
            });
          }}
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Trash2 className="mr-2 h-5 w-5" />
          Delete
        </Button>
      </div>
    </Card>
  );
};

export { Shortlink };
