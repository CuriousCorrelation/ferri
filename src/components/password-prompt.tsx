import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export function PasswordPrompt({
  onSetPassword,
}: {
  onSetPassword: (password: string) => void;
}) {
  const form = useForm({
    defaultValues: {
      password: "",
    },
  });

  function onSubmit(data: { password: string }) {
    onSetPassword(data.password);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormDescription>
                This file is password protected, enter password to continue
              </FormDescription>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Unlock</Button>
      </form>
    </Form>
  );
}
