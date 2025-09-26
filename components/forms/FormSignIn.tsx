"use client";

import Link from "next/link";
import {useRouter} from "next/navigation";
import {z} from "zod";
import {useForm, SubmitHandler} from "react-hook-form";
import {standardSchemaResolver} from "@hookform/resolvers/standard-schema";
import {toast} from "sonner";
import {ROUTES} from "@/refs/routes";
import {signInWithCredentials} from "@/lib/actions/auth.actions";
import {schemaSignIn} from "@/lib/validations";
import {Form, FormField} from "@/components/ui/form";
import {FormLayout} from "@/components/FormLayout";
import {InputText} from "@/components/InputText";
import {InputPassword} from "@/components/InputPassword";
import {FormSubmit} from "@/components/FormSubmit";

type FormSignInValues = z.infer<typeof schemaSignIn>;

export function FormSignIn() {
  const router = useRouter();
  const form = useForm<FormSignInValues>({
    resolver: standardSchemaResolver(schemaSignIn),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const handleSubmit: SubmitHandler<FormSignInValues> = async (values) => {
    const result = await signInWithCredentials(values);

    if (result.success) {
      toast.success("Success", {
        description: "Signed in successfully",
      });

      router.push(ROUTES.HOME);
    } else {
      toast.error(`Error ${result?.status}`, {
        description: result?.error?.message,
      });
    }
  };

  return (
    <Form {...form}>
      <FormLayout onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({field}) => (
            <InputText
              {...field}
              label="Email"
              placeholder="example@email.com"
            />
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({field}) => (
            <InputPassword
              {...field}
              label="Password"
              placeholder="Enter a password"
            />
          )}
        />
        <FormSubmit
          fullWidth
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Signing In..." : "Sign In"}
        </FormSubmit>
        <p>
          Don&#39;t have an account?{" "}
          <Link
            href={ROUTES.SIGN_UP}
            className="paragraph-semibold primary-text-gradient"
          >
            Sign Up
          </Link>
        </p>
      </FormLayout>
    </Form>
  );
}
