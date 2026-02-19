import { auth } from "@/auth";

export default auth;

export const config = {
  // Захищаємо всі шляхи, крім публічних (login, about, api/auth, api/events)
  matcher: ["/((?!about|api/auth|api/events|_next/static|_next/image|favicon.ico|login).*)"],
};
