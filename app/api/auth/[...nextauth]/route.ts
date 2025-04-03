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
    role: "Teacher",
    hashedPassword: bcrypt.hashSync("teacher123", 10), // Pre-hashed password
    subjects: ["Mathematics", "Physics"], // Subjects the teacher handles
    profilePicture: "/images/teacher-profile.jpg", // Optional profile picture
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "student@example.com",
    role: "Student",
    hashedPassword: bcrypt.hashSync("student123", 10), // Pre-hashed password
    enrolledCourses: ["Mathematics", "Physics"], // Courses the student is enrolled in
    profilePicture: "/images/student-profile.jpg", // Optional profile picture
    gradeLevel: "10th Grade", // Grade level of the student
  },
];

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

        // Find the user by email
        const user = users.find((user) => user.email === credentials.email);
        if (!user) {
          throw new Error("Invalid credentials");
        }

        // Validate the password
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );
        if (!isPasswordValid) {
          throw new Error("Invalid credentials");
        }

        // Return the user object (excluding sensitive data like hashedPassword)
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
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
