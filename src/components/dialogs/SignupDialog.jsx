"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { supabase } from "@/lib/supabase";
import useAuthStore from "@/stores/useAuthStore";
import { createUser } from "@/lib/db";

const formSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3),
  password: z.string().min(6),
});

export default function SignupDialog() {
  const form = useForm({ resolver: zodResolver(formSchema), defaultValues: { email: "", username: "", password: "", dateOfBirth: "" } });
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);

  async function handleOnSubmit(values) {
    const { email, username, password } = values;
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { username } } });

    if (error) {
      console.error(error);
    } else {
      const session = data.session;
      setSession(session);
      const { id, email } = data.user;
      const { username } = data.user.user_metadata;
      await createUser(id, email, username);
      router.push("/");
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className={"mb-2"}>Register</DialogTitle>
        <div className="text-sm text-zinc-400">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleOnSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-between items-center px-1">
                <Button type="submit">Register</Button>
                <Button variant="link" className={"pr-0"}>
                  Already have an account?
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogHeader>
    </DialogContent>
  );
}
