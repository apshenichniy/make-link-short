"use client";

import { useCreateShortlink } from "@/lib/use-shortlinks";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { nanoid } from "nanoid";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { LinkViewPopup } from "./link-view-popup";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";

const FormSchema = z.object({
  url: z.string().url({ message: "Valid URL is required" }).min(1),
});
type FormSchemaData = z.infer<typeof FormSchema>;

const CreateLinkForm = () => {
  const form = useForm<FormSchemaData>({
    resolver: zodResolver(FormSchema),
  });
  const [isPending, startTransition] = useTransition();
  const [isLinkPopupOpen, setLinkPopupOpen] = useState(false);
  const [isSettingsCollapsed, setSettingsCollapsed] = useState(true);
  const { mutate } = useCreateShortlink();
  const [link, setLink] = useState<string | undefined>();

  const onSubmit = (data: FormSchemaData) => {
    startTransition(() => {
      const id = nanoid(5);
      mutate({
        id,
        ...data,
      });
      setLink(id);
    });
  };

  return (
    <Form {...form}>
      <LinkViewPopup link={link} />
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-8">
        <FormField
          name="url"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-2xl font-semibold tracking-tight">
                URL to shorten
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="https://www.github.com/apshenichniy"
                  autoFocus
                  required
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="w-full text-lg font-semibold tracking-wide"
          size="lg"
          disabled={isPending}
          aria-disabled={isPending}
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Make it short!
        </Button>
      </form>
    </Form>
  );
};

export { CreateLinkForm };
