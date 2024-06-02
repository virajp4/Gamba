import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import useAuthStore from "@/stores/useAuthStore";
import { getEmail } from "@/lib/db";
import { supabase } from "@/lib/supabase";

const formSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});

export default function LoginDialog() {
  const form = useForm({ resolver: zodResolver(formSchema), defaultValues: { username: "", password: "" } });
  const setSession = useAuthStore((state) => state.setSession);

  async function handleOnSubmit(values) {
    const { username, password } = values;

    const email = await getEmail(username);

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.error("Login error:", error);
    } else {
      const session = data.session;
      setSession(session);
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className={"mb-2"}>Login</DialogTitle>
        <div className="text-sm text-zinc-400">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleOnSubmit)} className="space-y-4">
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
                <Button type="submit">Login</Button>
                <div>
                  <Button variant="link">Forgot Password?</Button>
                  <Button variant="link" className={"pr-0"}>
                    Create Account
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </DialogHeader>
    </DialogContent>
  );
}
