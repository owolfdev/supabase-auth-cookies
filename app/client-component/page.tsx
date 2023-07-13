"use client";

// TODO: Duplicate or move this file outside the `_examples` folder to make it a route
import { Client } from "@notionhq/client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { log } from "console";
import { useEffect, useState } from "react";

export default function ClientComponent() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [notionData, setNotionData] = useState<any[]>([]);

  // Create a Supabase client configured to use cookies
  const supabase = createClientComponentClient();

  useEffect(() => {
    const getCustomers = async () => {
      const { data } = await supabase.from("customers").select();
      if (data) {
        console.log(data);

        setCustomers(data);
      }
    };

    getCustomers();

    const fetchNotionData = async () => {
      const res = await fetch("/api/notion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          databaseId: process.env.NEXT_PUBLIC_NOTION_DATABASE_ID,
        }),
      });

      console.log("res", res);

      if (res.ok) {
        const data = await res.json();

        // Do something with the database
        console.log("database", data.results);
        setNotionData(data.results);
      } else {
        console.error("Error fetching Notion data:", await res.text());
      }
    };

    fetchNotionData();

    // Fetch Notion data every 4 minutes
    const intervalId = setInterval(fetchNotionData, 240000);

    // Return cleanup function
    return () => clearInterval(intervalId);
  }, [supabase, setCustomers]);

  return (
    <div>
      <pre>{JSON.stringify(customers, null, 2)}</pre>
      <div>{JSON.stringify(notionData)}</div>
    </div>
  );
}
