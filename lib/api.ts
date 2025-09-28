import {fetchHandler as fetch} from "@/lib/handlers/fetch";
import {TAccountData, TAccountType} from "@/db/account.model";
import {TUserJSON} from "@/db/user.model";

type PayloadSignInOAuth = Pick<
  TAccountType,
  "provider" | "providerAccountId"
> & {
  user: Pick<TUserJSON, "name" | "username" | "email" | "image">;
};

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export const api = {
  auth: {
    signInOAuth(payload: PayloadSignInOAuth) {
      return fetch(`${baseUrl}/auth/signin-with-oauth`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
    },
  },
  users: {
    getAll() {
      return fetch<TUserJSON[]>(`${baseUrl}/users`);
    },
    getById(userId: string) {
      return fetch<TUserJSON>(`${baseUrl}/users/${userId}`);
    },
    getByEmail(userEmail: string) {
      return fetch<TUserJSON>(`${baseUrl}/users/email`, {
        method: "POST",
        body: JSON.stringify({email: userEmail}),
      });
    },
    create(userData: Partial<TUserJSON>) {
      return fetch<TUserJSON>(`${baseUrl}/users`, {
        method: "POST",
        body: JSON.stringify(userData),
      });
    },
    update(userId: string, userData: Partial<TUserJSON>) {
      return fetch<TUserJSON>(`${baseUrl}/users/${userId}`, {
        method: "PUT",
        body: JSON.stringify(userData),
      });
    },
    delete(userId: string) {
      return fetch<TUserJSON>(`${baseUrl}/users/${userId}`, {method: "DELETE"});
    },
  },
  accounts: {
    getAll() {
      return fetch<TAccountData[]>(`${baseUrl}/accounts`);
    },
    getById(accountId: string) {
      return fetch<TAccountData>(`${baseUrl}/accounts/${accountId}`);
    },
    getByProvider(providerAccountId: string) {
      return fetch<TAccountData>(`${baseUrl}/accounts/provider`, {
        method: "POST",
        body: JSON.stringify({providerAccountId}),
      });
    },
    create(accountData: TAccountType) {
      return fetch<TAccountData>(`${baseUrl}/accounts`, {
        method: "POST",
        body: JSON.stringify(accountData),
      });
    },
    update(accountId: string, accountData: Partial<TAccountType>) {
      return fetch<TAccountData>(`${baseUrl}/accounts/${accountId}`, {
        method: "PUT",
        body: JSON.stringify(accountData),
      });
    },
    delete(accountId: string) {
      return fetch<TAccountData>(`${baseUrl}/accounts/${accountId}`, {
        method: "DELETE",
      });
    },
  },
  ai: {
    getAnswer(question: string, content: string) {
      return fetch<string>(`${baseUrl}/ai/answers`, {
        method: "POST",
        body: JSON.stringify({question, content}),
        timeout: 100000,
      });
    },
  },
};
