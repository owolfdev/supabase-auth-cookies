import { NextResponse, NextRequest } from "next/server";
import { Client } from "@notionhq/client";
const notion = new Client({
  auth: process.env.NEXT_PUBLIC_NOTION_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { databaseId } = await req.json();

    // console.log("email", email);
    console.log("databaseId", databaseId);

    const database = await notion.databases.query({
      database_id: databaseId as string,
    });

    // Filter the data based on the email
    // const filteredData = filterData(notionData, email);

    return NextResponse.json(database);
  } catch (error) {
    // handle error
    console.error(error);
    return NextResponse.error();
  }
}

const filterData = (notionData: any, email: string) => {
  return notionData.results.filter((item: any) => {
    // Check if the 'assigned to' property exists and has the 'people' property
    if (
      item.properties["assigned to"] &&
      item.properties["assigned to"].people
    ) {
      // Filter the data based on the email
      return item.properties["assigned to"].people.some(
        (person: any) => person.person && person.person.email === email
      );
    }
    return false; // Return false if the necessary properties are missing
  });
};
