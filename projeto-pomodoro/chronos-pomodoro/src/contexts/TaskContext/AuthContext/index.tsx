import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export function useAuthContext() {
    const ctx = useContext(AuthContext);
    if (!ctx) { throw new Error("useAuthContext must be used within an AuthContextProvider");
    }
    return ctx;
}
export { AuthContextProvider } from "./AuthContextProvider";
