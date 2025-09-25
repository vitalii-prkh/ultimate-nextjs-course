import {fetchHandler as fetch} from "@/lib/fetch";
import {TAccountType} from "@/db/account.model";
import {TUserType} from "@/db/user.model";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export const api = {
  users: {
    getAll() {
      return fetch(`${baseUrl}/users`);
    },
    getById(userId: string) {
      return fetch(`${baseUrl}/users/${userId}`);
    },
    getByEmail(userEmail: string) {
      return fetch(`${baseUrl}/users/email`, {
        method: "POST",
        body: JSON.stringify({email: userEmail}),
      });
    },
    create(userData: TUserType) {
      return fetch(`${baseUrl}/users`, {
        method: "POST",
        body: JSON.stringify(userData),
      });
    },
    update(userId: string, userData: Partial<TUserType>) {
      return fetch(`${baseUrl}/users/${userId}`, {
        method: "PUT",
        body: JSON.stringify(userData),
      });
    },
    delete(userId: string) {
      return fetch(`${baseUrl}/users/${userId}`, {method: "DELETE"});
    },
  },
  accounts: {
    getAll() {
      return fetch(`${baseUrl}/accounts`);
    },
    getById(accountId: string) {
      return fetch(`${baseUrl}/accounts/${accountId}`);
    },
    getByProvider(providerAccountId: string) {
      return fetch(`${baseUrl}/accounts/email`, {
        method: "POST",
        body: JSON.stringify({providerAccountId}),
      });
    },
    create(accountData: TAccountType) {
      return fetch(`${baseUrl}/accounts`, {
        method: "POST",
        body: JSON.stringify(accountData),
      });
    },
    update(accountId: string, accountData: Partial<TAccountType>) {
      return fetch(`${baseUrl}/accounts/${accountId}`, {
        method: "PUT",
        body: JSON.stringify(accountData),
      });
    },
    delete(accountId: string) {
      return fetch(`${baseUrl}/accounts/${accountId}`, {method: "DELETE"});
    },
  },
};
