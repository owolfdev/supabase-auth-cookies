import { Client } from "@notionhq/client";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import NotionDataRender from "@/components/NotionDataRender";

export default async function ServerComponent() {
  // Create a Supabase client configured to use cookies
  const supabase = createServerComponentClient({ cookies });

  // const {user, error} = await supabase.auth.api.getUserByCookie(cookies);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div className="dark:text-white">Not logged in</div>;
  }

  console.log("user", user);

  const { data: customers } = await supabase.from("customers").select();

  // Initialize Notion client
  const notion = new Client({
    auth: process.env.NEXT_PUBLIC_NOTION_API_KEY,
  });

  const database = await notion.databases.query({
    database_id: process.env.NEXT_PUBLIC_NOTION_DATABASE_ID as string,
  });

  return (
    <div className="dark:text-white">
      <div>{user.email}</div>
      <pre>{JSON.stringify(customers, null, 2)}</pre>
      <div>
        <NotionDataRender data={database} />
      </div>
    </div>
  );
}
