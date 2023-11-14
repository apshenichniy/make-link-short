"use client";

import { ShortlinkData, processProtectedLink } from "@/lib/actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";

interface CheckPasswordFormProps {
  shortLink: ShortlinkData;
}

const FormSchema = z.object({
  password: z.string().min(1),
});
type FormSchemaData = z.infer<typeof FormSchema>;

const CheckPasswordForm = ({ shortLink }: CheckPasswordFormProps) => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormSchemaData>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = ({ password }: FormSchemaData) => {
    startTransition(async () => {
      const { error } = await processProtectedLink(password, shortLink);
      if (error) {
        form.setError("password", { message: error });
      }
    });
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col space-y-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Password"
                  {...field}
                  type="password"
                  className="text-lg font-medium h-10"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* {isError && (
          <div className="text-sm text-destructive">
            Password is wrong. Try again.
          </div>
        )} */}
        <input name="link" type="hidden" value={JSON.stringify(shortLink)} />
        <Button
          className="text-base font-semibold"
          disabled={isPending}
          aria-disabled={isPending}
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Submit
        </Button>
      </form>
    </Form>
  );
};

export { CheckPasswordForm };
