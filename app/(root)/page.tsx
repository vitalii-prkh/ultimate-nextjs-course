import {auth, signOut} from "@/auth";
import {ROUTES} from "@/refs/routes";
import {Button} from "@/components/ui/button";

async function PageHome() {
  const session = await auth();

  console.log(session);

  return (
    <>
      <h1 className="h1-bold">Welcome</h1>
      <form
        action={async () => {
          "use server";

          await signOut({redirectTo: ROUTES.SIGN_IN});
        }}
        className="px-10 pt-[100px]"
      >
        <Button type="submit">Log out</Button>
      </form>
    </>
  );
}

export default PageHome;
