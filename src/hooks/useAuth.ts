import { logout } from "@/store/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";

export function useAuth() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  return {
    ...auth,
    signOut: () => dispatch(logout()),
  };
}