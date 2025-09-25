import {fetchHandler as fetch} from "@/lib/fetch";
import {TAccountData, TAccountType} from "@/db/account.model";
import {TUserData, TUserType} from "@/db/user.model";

type PayloadSignInOAuth = Pick<
  TAccountType,
  "provider" | "providerAccountId"
> & {
  user: Pick<TUserType, "name" | "username" | "email" | "image">;
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
      return fetch<TUserData[]>(`${baseUrl}/users`);
    },
    getById(userId: string) {
      return fetch<TUserData>(`${baseUrl}/users/${userId}`);
    },
    getByEmail(userEmail: string) {
      return fetch<TUserData>(`${baseUrl}/users/email`, {
        method: "POST",
        body: JSON.stringify({email: userEmail}),
      });
    },
    create(userData: TUserType) {
      return fetch<TUserData>(`${baseUrl}/users`, {
        method: "POST",
        body: JSON.stringify(userData),
      });
    },
    update(userId: string, userData: Partial<TUserType>) {
      return fetch<TUserData>(`${baseUrl}/users/${userId}`, {
        method: "PUT",
        body: JSON.stringify(userData),
      });
    },
    delete(userId: string) {
      return fetch<TUserData>(`${baseUrl}/users/${userId}`, {method: "DELETE"});
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
};
