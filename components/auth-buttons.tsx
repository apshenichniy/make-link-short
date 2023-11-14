import { signIn, signOut } from "@/lib/auth";
import { Github } from "lucide-react";
import { SubmitButton } from "./submit-button";

const SignIn = () => {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("github");
      }}
    >
      <SubmitButton>
        <Github className="mr-2 h-5 w-5" strokeWidth={1.5} />
        Sign in with GitHub
      </SubmitButton>
    </form>
  );
};

const SignOut = () => {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <SubmitButton>Sign out</SubmitButton>
    </form>
  );
};

export { SignIn, SignOut };
