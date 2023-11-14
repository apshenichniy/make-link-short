import { auth } from "@/lib/auth";
import { ShortlinksList } from "./shortlinks-list";

const UsersShortlinks = async () => {
  const session = await auth();
  if (!session?.user) return null;

  return <ShortlinksList />;
};

export { UsersShortlinks };
