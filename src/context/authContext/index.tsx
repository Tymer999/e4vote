import { createContext, useState, useEffect, useContext } from "react";
import { type User } from "firebase/auth";
import { auth } from "../../firebase/firebase.config";
import { onAuthStateChanged } from "firebase/auth";
import { getDocumentById } from "../../firebase/firestore"; // Make sure this path is correct

// Define the auth context type
interface AuthContextType {
  user: User | null;
  loggedIn: boolean;
  loading: boolean;
  userDetails: any | null; // Adjust type as needed
}

// Create context with explicit type
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userDetails, setUserDetails] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, initializeUser);

    return unsubscribe;
  }, []);

  const initializeUser = async (user: User | null) => {
    if (user) {
      setUser(user); // No need to spread, Firebase User is already serializable
      setLoggedIn(true);

      // Fetch user details from Firestore using UID
      try {
        const details = await getDocumentById("users", user.uid);
        setUserDetails(details);
      } catch (err) {
        setUserDetails(null);
      }
    } else {
      setUser(null);
      setLoggedIn(false);
    }
    setLoading(false);
  };

  const value: AuthContextType = {
    loggedIn,
    user,
    loading,
    userDetails
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
