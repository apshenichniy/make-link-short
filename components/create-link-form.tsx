"use client";

import { createShortLink } from "@/lib/actions";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, set, sub } from "date-fns";
import { CalendarIcon, ChevronDown, Loader2 } from "lucide-react";
import { nanoid } from "nanoid";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { LinkViewPopup } from "./link-view-popup";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

const FormSchema = z
  .object({
    url: z.string().url({ message: "Valid URL is required" }).min(1),
    title: z.string().optional(),
    password: z.string().optional(),
    confirm: z.string().optional(),
    expirationDate: z.date().optional(),
    expirationTime: z
      .object({
        hours: z
          .string()
          .optional()
          .refine(
            (hours) => !hours || (+hours >= 0 && +hours <= 23),
            "Invalid hours"
          ),
        minutes: z
          .string()
          .optional()
          .refine(
            (minutes) => !minutes || (+minutes >= 0 && +minutes <= 59),
            "Invalid minutes"
          ),
      })
      .default({}),
  })
  .refine(({ password, confirm }) => password === confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
  });
type FormSchemaData = z.infer<typeof FormSchema>;

const CreateLinkForm = () => {
  const form = useForm<FormSchemaData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {},
  });
  const [isPending, startTransition] = useTransition();
  const [isSettingsOpened, setSettingsOpened] = useState(false);
  const [link, setLink] = useState<string | undefined>();

  const { errors } = form.formState;

  const onSubmit = (data: FormSchemaData) => {
    const {
      expirationDate,
      expirationTime: { hours, minutes },
    } = data;

    let expires: Date;
    if (expirationDate) {
      expires = set(expirationDate, {
        hours: hours ? +hours : 0,
        minutes: minutes ? +minutes : 0,
      });
    }

    startTransition(async () => {
      const id = nanoid(5);
      await createShortLink({
        id,
        expires,
        ...data,
      });
      form.reset({
        url: "",
        title: "",
        password: "",
        confirm: "",
        expirationDate: undefined,
        expirationTime: {
          hours: "",
          minutes: "",
        },
      });

      setLink(id);
    });
  };

  useEffect(() => {
    if (Object.keys(errors).length > 0 && !isSettingsOpened) {
      setSettingsOpened(true);
    }
  }, [errors, isSettingsOpened]);

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
        <Collapsible open={isSettingsOpened} onOpenChange={setSettingsOpened}>
          <div className="w-full flex justify-end">
            <CollapsibleTrigger className="flex items-center group">
              <div className="text-sm font-medium">Advanced settings</div>
              <ChevronDown className="ml-2 h-5 w-5 group-data-[state=open]:rotate-180 duration-150" />
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="space-y-4">
            <FormField
              name="title"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Very long URL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Password" {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="confirm"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password confirmation</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Re-enter password"
                      {...field}
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex space-x-3">
              <FormField
                control={form.control}
                name="expirationDate"
                render={({ field }) => (
                  <FormItem className="basis-1/2 flex-col flex">
                    <FormLabel>Expiration date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < sub(new Date(), { days: 1 })
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="expirationTime.hours"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="basis-1/4 flex-col flex">
                    <FormLabel>Hours</FormLabel>
                    <FormControl>
                      <Input placeholder="Hours" {...field} type="number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="expirationTime.minutes"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="basis-1/4 flex-col flex">
                    <FormLabel>Minutes</FormLabel>
                    <FormControl>
                      <Input placeholder="Minutes" {...field} type="number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>
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
