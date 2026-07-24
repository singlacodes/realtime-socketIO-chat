import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import getCurrentUser from "./customHooks/getCurrentUser";
import { useDispatch, useSelector } from "react-redux";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import getOtherUsers from "./customHooks/getOtherUsers";
import { io } from "socket.io-client";
import { serverUrl } from "./main";
import { setOnlineUsers, setSocket } from "./redux/userSlice";

function App() {
  getCurrentUser();
  getOtherUsers();
  const { userData, socket } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (userData) {
      const socketio = io(`${serverUrl}`, {
        query: { userId: userData?._id },
        withCredentials: true,
      });
      dispatch(setSocket(socketio));

      socketio.on("getOnlineUsers", (users) => {
        dispatch(setOnlineUsers(users));
      });

      return () => {
        socketio.close();
      };
    }

    if (socket) {
      socket.close();
      dispatch(setSocket(null));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  return (
    <div className="h-full min-h-dvh">
      <Routes>
        <Route
          path="/login"
          element={!userData ? <Login /> : <Navigate to="/" replace />}
        />
        <Route
          path="/signup"
          element={!userData ? <SignUp /> : <Navigate to="/profile" replace />}
        />
        <Route
          path="/"
          element={userData ? <Home /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/profile"
          element={userData ? <Profile /> : <Navigate to="/signup" replace />}
        />
      </Routes>
    </div>
  );
}

export default App;
