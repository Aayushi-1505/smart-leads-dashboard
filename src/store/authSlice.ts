import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginUser, registerUser } from "@/api/authApi";
import type { AuthResponse, AuthState, LoginPayload, RegisterPayload, User } from "@/types/auth.types";

function readUser(): User | null {
  if (typeof window === "undefined") {
    return null;
  }

  const saved = localStorage.getItem("smart_leads_user");

  if (!saved) {
    return null;
  }

  try {
    return JSON.parse(saved) as User;
  } catch {
    return null;
  }
}

function readToken() {
  return typeof window === "undefined" ? null : localStorage.getItem("smart_leads_token");
}

function saveSession(response: AuthResponse) {
  if (typeof window !== "undefined") {
    localStorage.setItem("smart_leads_user", JSON.stringify(response.user));
    localStorage.setItem("smart_leads_token", response.token);
  }
}

function clearSession() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("smart_leads_user");
    localStorage.removeItem("smart_leads_token");
  }
}

function getMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong.";
}

export const login = createAsyncThunk<AuthResponse, LoginPayload, { rejectValue: string }>(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await loginUser(payload);
      saveSession(response);
      return response;
    } catch (error) {
      return rejectWithValue(getMessage(error));
    }
  },
);

export const register = createAsyncThunk<AuthResponse, RegisterPayload, { rejectValue: string }>(
  "auth/register",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await registerUser(payload);
      saveSession(response);
      return response;
    } catch (error) {
      return rejectWithValue(getMessage(error));
    }
  },
);

const initialState: AuthState = {
  user: readUser(),
  token: readToken(),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      clearSession();
      state.user = null;
      state.token = null;
      state.error = null;
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Login failed.";
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Registration failed.";
      });
  },
});

export const { clearAuthError, logout } = authSlice.actions;
export default authSlice.reducer;