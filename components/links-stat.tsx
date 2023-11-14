import { getStats } from "@/lib/actions";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const LinksStat = async () => {
  const { users, links, visits } = await getStats();

  return (
    <div className="grid grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Users</CardTitle>
        </CardHeader>
        <CardContent>
          <h3 className="text-2xl font-semibold tracking-tight">{users}</h3>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Links</CardTitle>
        </CardHeader>
        <CardContent>
          <h3 className="text-2xl font-semibold tracking-tight">{links}</h3>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Visits</CardTitle>
        </CardHeader>
        <CardContent>
          <h3 className="text-2xl font-semibold tracking-tight">{visits}</h3>
        </CardContent>
      </Card>
    </div>
  );
};

export { LinksStat };
