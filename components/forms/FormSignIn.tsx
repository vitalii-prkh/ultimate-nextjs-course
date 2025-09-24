"use client";

import Link from "next/link";
import {z} from "zod";
import {useForm, SubmitHandler} from "react-hook-form";
import {standardSchemaResolver} from "@hookform/resolvers/standard-schema";
import {ROUTES} from "@/refs/routes";
import {schemaSignIn} from "@/lib/validations";
import {Form, FormField} from "@/components/ui/form";
import {FormLayout} from "@/components/FormLayout";
import {InputText} from "@/components/InputText";
import {InputPassword} from "@/components/InputPassword";
import {FormSubmit} from "@/components/FormSubmit";

type FormSignInValues = z.infer<typeof schemaSignIn>;

export function FormSignIn() {
  const form = useForm<FormSignInValues>({
    resolver: standardSchemaResolver(schemaSignIn),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const handleSubmit: SubmitHandler<FormSignInValues> = (values) => {};

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
