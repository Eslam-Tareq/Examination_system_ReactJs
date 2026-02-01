import { ApiResponse } from "@/services/api.types";
import { UserRoles } from "@/types/userRoles";
type LoginData = {
  user: {
    id: number;
    username: string;
    role: UserRoles;
    isActive: boolean;
    createdAt: string;
  };
  token: {
    accessToken: string;
    expiresIn: number;
  };
};

const MOCK_USERS = [
  {
    id: 1,
    username: "student",
    password: "123",
    role: { id: 2, name: UserRoles.STUDENT },
  },
  {
    id: 2,
    username: "instructor",
    password: "123",
    role: { id: 1, name: UserRoles.INSTRUCTOR },
  },
];

export const mockLogin = async (
  username: string,
  password: string,
): Promise<ApiResponse<LoginData>> => {
  const user = MOCK_USERS.find(
    (u) => u.username === username && u.password === password,
  );

  if (!user) {
    console.log("user", user);
    return {
      success: false,
      message: "Invalid username or password",
      data: null,
    };
  }

  return {
    success: true,
    message: "Login successful",
    data: {
      user: {
        id: user.id,
        username: user.username,
        role: user.role.name,
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      token: {
        accessToken: "MOCK_JWT_TOKEN",
        expiresIn: 3600,
      },
    },
  };
};
