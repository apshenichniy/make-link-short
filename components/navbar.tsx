import { auth } from "@/lib/auth";
import { SignIn, SignOut } from "./auth-buttons";
import { ThemeToggler } from "./theme-toggler";
import { Avatar, AvatarImage } from "./ui/avatar";

const Navbar = async () => {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  return (
    <header className="sticky top-0 z-50 p-6 bg-background/50 backdrop-blur flex items-center justify-end space-x-4">
      {isLoggedIn ? (
        <div className="flex items-center">
          <Avatar className="mr-2 h-8 w-8">
            <AvatarImage
              src={session?.user?.image ?? "https://github.com/github.png"}
            />
          </Avatar>
          <div className="mr-4 font-medium">{session?.user?.name}</div>
          <SignOut />
        </div>
      ) : (
        <SignIn />
      )}
      <ThemeToggler />
    </header>
  );
};

export { Navbar };
