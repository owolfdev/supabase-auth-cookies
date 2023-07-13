"use client";
import React from "react";

function NotionDataRender(data: any) {
  return <div>{JSON.stringify(data)}</div>;
}

export default NotionDataRender;
