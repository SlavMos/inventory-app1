import { useStore } from "../store/useStore";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export function useAuth() {
  const { user, logout } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    // если не авторизован — кидаем на логин
    if (!user) navigate("/login");
  }, [user, navigate]);

  return { user, logout };
}
