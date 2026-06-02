import apiClient from "@/api/axios";
import type { AuthResponse, LoginPayload, RegisterPayload, User } from "@/types/auth.types";
import { USE_MOCK_API } from "@/utils/constants";

type StoredUser = User & { password: string };

const USERS_KEY = "smart_leads_users";

const seedUsers: StoredUser[] = [
  {
    _id: "admin-1",
    name: "Aayushi Admin",
    email: "admin@smartleads.dev",
    password: "123456",
    role: "admin",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "sales-1",
    name: "Rahul Sales",
    email: "sales@smartleads.dev",
    password: "123456",
    role: "sales",
    createdAt: new Date().toISOString(),
  },
];

const wait = () => new Promise((resolve) => setTimeout(resolve, 350));

function readUsers(): StoredUser[] {
  if (typeof window === "undefined") {
    return seedUsers;
  }

  const saved = localStorage.getItem(USERS_KEY);

  if (!saved) {
    localStorage.setItem(USERS_KEY, JSON.stringify(seedUsers));
    return seedUsers;
  }

  try {
    return JSON.parse(saved) as StoredUser[];
  } catch {
    localStorage.setItem(USERS_KEY, JSON.stringify(seedUsers));
    return seedUsers;
  }
}

function writeUsers(users: StoredUser[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
}

function publicUser(user: StoredUser): User {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
}

function createToken(user: User) {
  const payload = JSON.stringify({ sub: user._id, email: user.email, role: user.role, iat: Date.now() });
  return typeof window === "undefined" ? payload : window.btoa(payload);
}

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `user-${Date.now()}`;
}

export async function loginUser(payload: LoginPayload): Promise<AuthResponse> {
  if (!USE_MOCK_API) {
    const { data } = await apiClient.post<AuthResponse>("/auth/login", payload);
    return data;
  }

  await wait();

  const users = readUsers();
  const user = users.find(
    (item) => item.email.toLowerCase() === payload.email.toLowerCase() && item.password === payload.password,
  );

  if (!user) {
    throw new Error("Invalid email or password.");
  }

  const safeUser = publicUser(user);
  return { user: safeUser, token: createToken(safeUser) };
}

export async function registerUser(payload: RegisterPayload): Promise<AuthResponse> {
  if (!USE_MOCK_API) {
    const { data } = await apiClient.post<AuthResponse>("/auth/register", payload);
    return data;
  }

  await wait();

  const users = readUsers();
  const exists = users.some((item) => item.email.toLowerCase() === payload.email.toLowerCase());

  if (exists) {
    throw new Error("An account with this email already exists.");
  }

  const newUser: StoredUser = {
    _id: createId(),
    name: payload.name,
    email: payload.email,
    password: payload.password,
    role: payload.role ?? "sales",
    createdAt: new Date().toISOString(),
  };

  writeUsers([...users, newUser]);

  const safeUser = publicUser(newUser);
  return { user: safeUser, token: createToken(safeUser) };
}