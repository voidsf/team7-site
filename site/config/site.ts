export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "EcoSort",
  description: "",
  navItems: [
    {
      label: "Mission",
      href: "/",
    },
    {
      label: "Login",
      href: "/login",
    },
    {
      label: "Sign Up",
      href: "/signup",
    },
  ],
  navItemsLoggedIn: [
    {
      label: "Mission",
      href: "/",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Logout",
      href: "/logout",
    },
  ],
};
