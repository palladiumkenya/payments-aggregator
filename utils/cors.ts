import { NextResponse } from "next/server";

//TODO find the URL used in production and add it here

export const allowedOrigins = [
  "https://dev.kenyahmis.org",
  "http://localhost:8700",
];

export const corsOptions = {
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export const setCorsHeaders = (response: NextResponse, origin: string) => {
  const isAllowedOrigin = allowedOrigins.includes(origin);

  if (isAllowedOrigin) {
    response.headers.set("Access-Control-Allow-Origin", origin);
  }
  Object.entries(corsOptions).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
};
