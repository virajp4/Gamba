"use client";

import AuthProtectedRoute from "@/components/auth/AuthProtectedRoute";

function CasinoLayout({ children }) {
  return <div>{children}</div>;
}

export default AuthProtectedRoute(CasinoLayout);
