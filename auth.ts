import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import {api} from "@/lib/api";
import {schemaSignIn} from "@/lib/validations";

export const {handlers, signIn, signOut, auth} = NextAuth({
  providers: [
    GitHub,
    Credentials({
      async authorize(credentials) {
        const validatedFields = schemaSignIn.safeParse(credentials);

        if (validatedFields.success) {
          const {email, password} = validatedFields.data;
          const {data: account} = await api.accounts.getByProvider(email);

          if (!account) {
            return null;
          }

          const {data: user} = await api.users.getById(
            account.userId.toString(),
          );

          if (!user) {
            return null;
          }

          const isValidPassword = await bcrypt.compare(
            password,
            account.password!,
          );

          if (isValidPassword) {
            return {
              id: user._id.toString(),
              name: user.name,
              email: user.email,
              image: user.image,
            };
          }

          return null;
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async session({session, token}) {
      session.user.id = token.sub as string;

      return session;
    },
    async jwt({token, account}) {
      if (account) {
        const providerId =
          account.type === "credentials"
            ? token.email!
            : account.providerAccountId;
        const {success, data} = await api.accounts.getByProvider(providerId);

        if (!success || !data) {
          return token;
        }

        const {userId} = data;

        if (userId) {
          token.sub = userId.toString();
        }
      }

      return token;
    },
    async signIn({user, account, profile}) {
      if (account?.type === "credentials") {
        return true;
      }

      if (!account || !user) {
        return false;
      }

      const payload = {
        provider: account.provider,
        providerAccountId: account.providerAccountId,
        user: {
          name: user.name!,
          email: user.email!,
          image: user.image!,
          username:
            account.provider === "github"
              ? (profile?.login as string)
              : (user.name?.toLowerCase() as string),
        },
      };

      const {success} = await api.auth.signInOAuth(payload);

      return Boolean(success);
    },
  },
});
