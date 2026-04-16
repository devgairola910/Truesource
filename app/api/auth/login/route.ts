import { NextResponse } from "next/server";
import { loginUser } from "@/lib/auth-store";

type LoginPayload = {
  email?: string;
  password?: string;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  let body: LoginPayload;

  try {
    body = (await request.json()) as LoginPayload;
  } catch {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }

  const email = body.email?.trim() ?? "";
  const password = body.password ?? "";

  if (!email || !password) {
    return NextResponse.json(
      { message: "Email and password are required." },
      { status: 400 },
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ message: "Please enter a valid email." }, { status: 400 });
  }

  const loginResult = loginUser({ email, password });

  if (!loginResult.ok) {
    return NextResponse.json(
      { message: "Invalid email or password." },
      { status: 401 },
    );
  }

  return NextResponse.json(
    {
      message: "Login successful.",
      user: loginResult.user,
    },
    { status: 200 },
  );
}
