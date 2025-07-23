import { createContext, useState, useEffect } from "react";
import axios from "../../service/axios";

const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(undefined); // `undefined` means not checked yet
  const [isLoaded, setIsLoaded] = useState(false); // track when auth check is done

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken) {
      getUserInfo(storedToken).finally(() => setIsLoaded(true));
    } else {
      setUser(null);
      setIsLoaded(true);
    }
  }, []);

  const getUserInfo = async (accessToken) => {
    try {
      const response = await axios.get("/v1/users/current-user", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setUser(response.data.data);
    } catch (error) {
      console.error("Error fetching user info:", error.message);
      setUser(null);
    }
  };

  // Register user
  const signup = async (credentials) => {
    console.log(credentials);
    try {
      const response = await axios.post("/v1/users/register", credentials, {});
      return response.data;
    } catch (error) {
      throw error.response?.status || "Error registering user";
    }
  };

  const singin = async (credentials) => {
    try {
      const response = await axios.post("/v1/users/login", credentials);
      const { accessToken, refreshToken, user } = response.data.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      setUser(null);
      setUser(user);
      return response.data;
    } catch (error) {
      throw error.response?.status || "Error with login";
    }
  };

  const googleSignIn = async (idToken) => {
    try {
      const response = await axios.post(
        "/v1/users/google",
        { idToken },
        { withCredentials: true }
      );
      const { accessToken, refreshToken, user } = response.data.data;

      console.log(response.data.data)
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      setUser(user);
      setIsLoaded(true);
      return response.data;
    } catch (error) {
      console.error("Google sign-in failed:", error.message);
      throw error.response?.status || "Google sign-in failed";
    }
  };

  const logout = async () => {
    try {
      await axios.post("/v1/users/logout");
    } catch (error) {
      console.error("Logout failed:", error.message);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUser(null);
    }
  };

  const changePassword = async (data) => {
    try {
      await axios.post("/auth/change-password", data);
    } catch (error) {
      console.error("Change password failed:", error.message);
    }
  };

  const updateAccount = async (data) => {
    try {
      await axios.put("/auth/update-account", data);
    } catch (error) {
      console.error("Update account failed:", error.message);
    }
  };

  const refreshToken = async () => {
    try {
      const response = await axios.post("/auth/refresh-token", {
        refreshToken: localStorage.getItem("refreshToken"),
      });
      const { accessToken } = response.data;
      localStorage.setItem("accessToken", accessToken);
      getUserInfo(accessToken);
    } catch (error) {
      console.error("Refresh token failed:", error.message);
    }
  };

  // Compute `isSignedIn` safely
  const isSignedIn = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoaded,
        isSignedIn,
        singin,
        signup,
        googleSignIn,
        logout,
        changePassword,
        updateAccount,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
