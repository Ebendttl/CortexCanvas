import { prisma } from "../prisma";

export interface MockCookieStore {
  get(name: string): string | undefined;
  set(name: string, value: string, options?: any): void;
  delete(name: string): void;
}

const COOKIE_NAME = "cortex-session";

interface MockUser {
  id: string;
  email: string;
  passwordHash: string;
}

export function createMockClient(cookieStore: MockCookieStore) {
  const getMockUsersPath = async () => {
    const path = await import("path");
    return path.join(process.cwd(), "src", "lib", "supabase", "users.json");
  };

  const readMockUsers = async (): Promise<MockUser[]> => {
    const fs = await import("fs/promises");
    const filePath = await getMockUsersPath();
    try {
      const data = await fs.readFile(filePath, "utf-8");
      return JSON.parse(data);
    } catch (e) {
      return [];
    }
  };

  const writeMockUsers = async (users: MockUser[]) => {
    const fs = await import("fs/promises");
    const filePath = await getMockUsersPath();
    await fs.writeFile(filePath, JSON.stringify(users, null, 2), "utf-8");
  };

  return {
    auth: {
      async signUp(data: { email: string; password?: string }) {
        try {
          const email = data.email.toLowerCase().trim();
          const password = data.password || "";

          if (password.length < 6) {
            return {
              data: { user: null },
              error: { message: "Password must be at least 6 characters long." },
            };
          }

          const users = await readMockUsers();
          const existingUser = users.find((u) => u.email === email);
          if (existingUser) {
            return {
              data: { user: null },
              error: { message: "User already registered." },
            };
          }

          const crypto = await import("crypto");
          const userId = "usr_" + Math.random().toString(36).substring(2, 15);
          const passwordHash = crypto.createHash("sha256").update(password).digest("hex");

          const newUser: MockUser = {
            id: userId,
            email,
            passwordHash,
          };

          users.push(newUser);
          await writeMockUsers(users);

          // Auto-create in local SQLite DB for Prisma relations to work
          await prisma.user.upsert({
            where: { email },
            update: {},
            create: {
              id: userId,
              email,
              name: email.split("@")[0],
              image: `https://api.dicebear.com/7.x/bottts/svg?seed=${userId}`,
            },
          });

          // Set session cookie
          const sessionUser = { id: userId, email, role: "authenticated" };
          cookieStore.set(COOKIE_NAME, encodeURIComponent(JSON.stringify(sessionUser)), {
            path: "/",
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7, // 1 week
          });

          return {
            data: { user: sessionUser },
            error: null,
          };
        } catch (err: any) {
          console.error("Mock signUp failed:", err);
          return {
            data: { user: null },
            error: { message: err.message || "Failed to sign up." },
          };
        }
      },

      async signInWithPassword(data: { email: string; password?: string }) {
        try {
          const email = data.email.toLowerCase().trim();
          const password = data.password || "";

          const users = await readMockUsers();
          const user = users.find((u) => u.email === email);
          if (!user) {
            return {
              data: { user: null },
              error: { message: "Invalid login credentials." },
            };
          }

          const crypto = await import("crypto");
          const passwordHash = crypto.createHash("sha256").update(password).digest("hex");
          if (user.passwordHash !== passwordHash) {
            return {
              data: { user: null },
              error: { message: "Invalid login credentials." },
            };
          }

          // Ensure user exists in SQLite DB as well
          await prisma.user.upsert({
            where: { email },
            update: {},
            create: {
              id: user.id,
              email,
              name: email.split("@")[0],
              image: `https://api.dicebear.com/7.x/bottts/svg?seed=${user.id}`,
            },
          });

          // Set session cookie
          const sessionUser = { id: user.id, email, role: "authenticated" };
          cookieStore.set(COOKIE_NAME, encodeURIComponent(JSON.stringify(sessionUser)), {
            path: "/",
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7, // 1 week
          });

          return {
            data: { user: sessionUser },
            error: null,
          };
        } catch (err: any) {
          console.error("Mock signIn failed:", err);
          return {
            data: { user: null },
            error: { message: err.message || "Failed to sign in." },
          };
        }
      },

      async signOut() {
        cookieStore.delete(COOKIE_NAME);
        return { error: null };
      },

      async getUser() {
        try {
          const cookieVal = cookieStore.get(COOKIE_NAME);
          if (!cookieVal) {
            return { data: { user: null }, error: null };
          }
          const user = JSON.parse(decodeURIComponent(cookieVal));
          return { data: { user }, error: null };
        } catch (err) {
          return { data: { user: null }, error: null };
        }
      },
    },
  };
}
