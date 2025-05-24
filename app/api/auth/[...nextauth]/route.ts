import bcrypt from "bcrypt";
import NextAuth from "next-auth/next";
import { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

// Mock user data
const users = [
  {
    id: "1",
    name: "John Doe",
    email: "teacher@example.com",
    role: "teacher",
    hashedPassword: bcrypt.hashSync("teacher123", 10),
    subjects: ["Mathematics", "Physics"],
    profilePicture: "/images/teacher-profile.jpg",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "student@example.com",
    role: "student",
    hashedPassword: bcrypt.hashSync("student123", 10),
    enrolledCourses: ["Mathematics", "Physics"],
    profilePicture: "/images/student-profile.jpg",
    gradeLevel: "10th Grade",
  },
];
declare module "next-auth" {
  interface User {
    role?: string; // Add the role property
  }

  interface Session {
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string | null; // Add role to the session user
    };
  }
}
const authOptions: AuthOptions = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const user = users.find((user) => user.email === credentials.email);
        if (!user) {
          throw new Error("Invalid credentials");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );
        if (!isPasswordValid) {
          throw new Error("Invalid credentials");
        }

        const { ...userWithoutPassword } = user;
        return userWithoutPassword;
      },
    }),
  ],
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "default_secret",
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        if (session.user) {
          session.user.role = token?.role as string;
        }
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
