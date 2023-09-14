// theme.js

const THEME_KEY = "theme";

export const toggleTheme = () => {
  const currentTheme = localStorage.getItem(THEME_KEY);
  const newTheme = currentTheme === "light" ? "dark" : "light";
  setTheme(newTheme);
};

export const setTheme = (theme: string) => {
  localStorage.setItem(THEME_KEY, theme);
  document.documentElement.setAttribute("data-theme", theme);
};

export const getInitialTheme = () => {
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme) {
    return savedTheme;
  } else {
    const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDarkMode ? "dark" : "light";
  }
};
