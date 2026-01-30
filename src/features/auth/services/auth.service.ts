import { UserRole } from "@/store/auth.store";

const USERS = [
  {
    id: 1,
    username: "student",
    password: "123",
    role: "student" as UserRole,
  },
  {
    id: 2,
    username: "instructor",
    password: "123",
    role: "instructor" as UserRole,
  },
];

export const loginService = async (username: string, password: string) => {
  const user = USERS.find(
    (u) => u.username === username && u.password === password,
  );

  if (!user) {
    throw new Error("Invalid credentials");
  }

  return {
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
    },
    token: "DUMMY_TOKEN",
  };
};
