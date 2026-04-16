import { NextResponse } from "next/server";
import { registerUser } from "@/lib/auth-store";

type SignupPayload = {
  name?: string;
  email?: string;
  company?: string;
  password?: string;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  let body: SignupPayload;

  try {
    body = (await request.json()) as SignupPayload;
  } catch {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const company = body.company?.trim() ?? "";
  const password = body.password ?? "";

  if (!name || !email || !company || !password) {
    return NextResponse.json({ message: "All fields are required." }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { message: "Please enter a valid work email address." },
      { status: 400 },
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { message: "Password must be at least 8 characters long." },
      { status: 400 },
    );
  }

  const registration = registerUser({ name, email, company, password });

  if (!registration.ok) {
    return NextResponse.json(
      {
        message:
          "An account with this email already exists. Please log in or use another email.",
      },
      { status: 409 },
    );
  }

  return NextResponse.json(
    {
      message: "Account created successfully. Welcome to TrueSource.",
      user: registration.user,
    },
    { status: 201 },
  );
}
