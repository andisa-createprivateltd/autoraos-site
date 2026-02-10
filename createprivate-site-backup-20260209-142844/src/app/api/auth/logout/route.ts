import { NextResponse } from "next/server";
import { cookieOptions, SESSION_COOKIE_NAME } from "@/lib/dealer-auth";

export async function POST() {
  const response = NextResponse.json({ success: true });

  response.cookies.set({
    ...cookieOptions(),
    name: SESSION_COOKIE_NAME,
    value: "",
    expires: new Date(0),
    maxAge: 0,
    path: "/"
  });

  return response;
}
