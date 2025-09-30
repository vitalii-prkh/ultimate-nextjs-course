import React from "react";
import {redirect} from "next/navigation";
import {auth} from "@/auth";
import {ROUTES} from "@/refs/routes";
import {getUser} from "@/lib/actions/user.actions";
import {FormProfile} from "@/components/forms/FormProfile";

async function PageProfileEdit() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect(ROUTES.SIGN_IN);
  }

  const {success, data} = await getUser({userId: session.user.id});

  if (!success) {
    redirect(ROUTES.SIGN_IN);
  }

  return (
    <React.Fragment>
      <h1 className="h1-bold text-dark100_light900">Edit Profile</h1>
      <FormProfile user={data?.user} />
    </React.Fragment>
  );
}

export default PageProfileEdit;
