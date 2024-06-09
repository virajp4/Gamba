import useAuthStore from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const AuthProtectedRoute = (WrappedComponent) => {
  const WithAuthProtection = (props) => {
    const router = useRouter();
    const user = useAuthStore((state) => state.user);

    useEffect(() => {
      if (!user) {
        router.push("/");
      }
    }, [user]);

    return <WrappedComponent {...props} />;
  };
  return WithAuthProtection;
};

export default AuthProtectedRoute;
