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
import { toId } from "./utils/online";

function App() {
  getCurrentUser();
  getOtherUsers();
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const userId = toId(userData?._id);
    if (!userId) {
      dispatch(setSocket(null));
      dispatch(setOnlineUsers([]));
      return;
    }

    const socketio = io(serverUrl, {
      query: { userId },
      withCredentials: true,
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 10,
    });

    const onOnlineUsers = (users) => {
      const list = (Array.isArray(users) ? users : []).map(toId).filter(Boolean);
      dispatch(setOnlineUsers(list));
    };

    // Register listeners BEFORE relying on first server push
    socketio.on("getOnlineUsers", onOnlineUsers);

    socketio.on("connect", () => {
      // Re-fetch in case the initial broadcast was missed (race)
      socketio.emit("requestOnlineUsers");
    });

    socketio.on("disconnect", () => {
      // Keep last known list; server will re-broadcast on others' events
    });

    dispatch(setSocket(socketio));

    return () => {
      socketio.off("getOnlineUsers", onOnlineUsers);
      socketio.disconnect();
      dispatch(setSocket(null));
    };
  }, [userData?._id, dispatch]);

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
