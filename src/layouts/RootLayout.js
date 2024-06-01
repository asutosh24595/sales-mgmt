import { Outlet } from "react-router-dom";
import MainLayout from "./MainLayout";
import {useState,useEffect} from "react";

export default function RootLayout() {
  const [isDarkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setDarkMode(storedTheme === "dark");
    }
  }, []);

  const handleToggleTheme = () => {
    const newTheme = !isDarkMode ? "dark" : "light";
    setDarkMode(!isDarkMode);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <div>
      <MainLayout setTheme={handleToggleTheme} isDarkMode={isDarkMode} />
      <Outlet />
    </div>
  );
}
