"use client";

import Link from "next/link";
import {useRouter} from "next/navigation";
import {z} from "zod";
import {useForm, SubmitHandler} from "react-hook-form";
import {standardSchemaResolver} from "@hookform/resolvers/standard-schema";
import {toast} from "sonner";
import {ROUTES} from "@/refs/routes";
import {signUpWithCredentials} from "@/lib/actions/auth.actions";
import {schemaSignUp} from "@/lib/validations";
import {Form, FormField} from "@/components/ui/form";
import {FormLayout} from "@/components/FormLayout";
import {InputText} from "@/components/InputText";
import {InputPassword} from "@/components/InputPassword";
import {FormSubmit} from "@/components/FormSubmit";

type FormSignInValues = z.infer<typeof schemaSignUp>;

export function FormSignUp() {
  const router = useRouter();
  const form = useForm<FormSignInValues>({
    resolver: standardSchemaResolver(schemaSignUp),
    defaultValues: {
      username: "",
      name: "",
      email: "",
      password: "",
    },
  });
  const handleSubmit: SubmitHandler<FormSignInValues> = async (values) => {
    const result = await signUpWithCredentials(values);

    if (result.success) {
      toast.success("Success", {
        description: "Signed up successfully",
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
        <FormField
          control={form.control}
          name="name"
          render={({field}) => (
            <InputText
              {...field}
              label="Name"
              placeholder="Enter a name"
            />
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({field}) => (
            <InputText
              {...field}
              label="Username"
              placeholder="Enter a username"
            />
          )}
        />
        <FormSubmit
          fullWidth
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Signing Up..." : "Sign Up"}
        </FormSubmit>
        <p>
          Already have an account?{" "}
          <Link
            href={ROUTES.SIGN_IN}
            className="paragraph-semibold primary-text-gradient"
          >
            Sign In
          </Link>
        </p>
      </FormLayout>
    </Form>
  );
}
