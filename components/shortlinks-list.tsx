import { getShortlinks } from "@/lib/data";
import { Shortlink } from "./shortlink";

const ShortlinksList = async () => {
  const shortLinks = await getShortlinks();

  if (shortLinks.length === 0) return null;

  return (
    <div className="flex flex-col mt-8">
      <h2 className="text-2xl font-semibold tracking-tight">Your shortlinks</h2>
      <div className="flex flex-col space-y-4 mt-2">
        {shortLinks?.map((link) => (
          <Shortlink link={link} key={link.id} />
        ))}
      </div>
    </div>
  );
};

export { ShortlinksList };
