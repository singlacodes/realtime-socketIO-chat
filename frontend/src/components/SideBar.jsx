import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoIosSearch } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { BiLogOutCircle } from "react-icons/bi";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";
import { serverUrl } from "../main";
import axios from "axios";
import {
  setOtherUsers,
  setSearchData,
  setSelectedUser,
  setUserData,
} from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import Avatar from "./Avatar";
import { formatListSubtitle } from "../utils/formatTime";
import { isUserOnline } from "../utils/online";

function SideBar() {
  const { userData, otherUsers, selectedUser, onlineUsers, searchData } =
    useSelector((state) => state.user);
  const [search, setSearch] = useState(false);
  const [input, setInput] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onlineCount = useMemo(
    () =>
      (otherUsers || []).filter((u) => isUserOnline(onlineUsers, u._id)).length,
    [otherUsers, onlineUsers]
  );

  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      dispatch(setUserData(null));
      dispatch(setOtherUsers(null));
      dispatch(setSelectedUser(null));
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!input.trim()) {
      dispatch(setSearchData([]));
      return;
    }
    const t = setTimeout(async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/user/search?query=${encodeURIComponent(input.trim())}`,
          { withCredentials: true }
        );
        dispatch(setSearchData(result.data));
      } catch (error) {
        console.log(error);
      }
    }, 250);
    return () => clearTimeout(t);
  }, [input, dispatch]);

  const pickUser = (user) => {
    dispatch(setSelectedUser(user));
    setInput("");
    setSearch(false);
  };

  return (
    <aside
      className={`relative flex h-full w-full flex-col border-r border-ink-200 bg-ink-50 lg:w-[32%] xl:w-[30%] ${
        selectedUser ? "hidden lg:flex" : "flex"
      }`}
    >
      {/* Header */}
      <div className="bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 px-5 pb-5 pt-6 text-white shadow-soft">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
              <HiOutlineChatBubbleLeftRight className="h-5 w-5" />
            </span>
            <h1 className="text-xl font-extrabold tracking-tight">chatly</h1>
          </div>
          <button
            type="button"
            onClick={handleLogOut}
            className="rounded-full bg-white/15 p-2.5 transition hover:bg-white/25"
            title="Log out"
          >
            <BiLogOutCircle className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wider text-brand-100">
              Signed in
            </p>
            <h2 className="truncate text-lg font-bold">
              Hi, {userData?.name || userData?.userName || "there"}
            </h2>
            <p className="text-xs text-brand-100">
              {onlineCount} online · {(otherUsers || []).length} contacts
            </p>
          </div>
          <button type="button" onClick={() => navigate("/profile")} title="Profile">
            <Avatar src={userData?.image} size={56} />
          </button>
        </div>

        {/* Online strip / search */}
        <div className="mt-4">
          {!search ? (
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              <button
                type="button"
                onClick={() => setSearch(true)}
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white text-brand-700 shadow-md transition hover:scale-105"
                title="Search"
              >
                <IoIosSearch className="h-6 w-6" />
              </button>
              {(otherUsers || [])
                .filter((u) => isUserOnline(onlineUsers, u._id))
                .map((user) => (
                  <button
                    type="button"
                    key={user._id}
                    onClick={() => pickUser(user)}
                    className="shrink-0 transition hover:scale-105"
                    title={user.name || user.userName}
                  >
                    <Avatar src={user.image} size={56} online />
                  </button>
                ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-ink-800 shadow-md">
              <IoIosSearch className="h-5 w-5 shrink-0 text-ink-500" />
              <input
                type="text"
                autoFocus
                placeholder="Search users…"
                className="w-full bg-transparent text-[15px] outline-none placeholder:text-ink-500"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button
                type="button"
                onClick={() => {
                  setSearch(false);
                  setInput("");
                }}
              >
                <RxCross2 className="h-5 w-5 text-ink-500" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Search results overlay list */}
      {input.trim().length > 0 && (
        <div className="absolute inset-x-0 top-[250px] bottom-0 z-20 overflow-y-auto border-t border-ink-200 bg-white shadow-card">
          <p className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-ink-500">
            Search results
          </p>
          {(searchData || []).length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-ink-500">
              No users found
            </p>
          ) : (
            searchData.map((user) => (
              <button
                type="button"
                key={user._id}
                onClick={() => pickUser(user)}
                className="flex w-full items-center gap-3 border-b border-ink-100 px-4 py-3 text-left transition hover:bg-brand-50"
              >
                <Avatar
                  src={user.image}
                  size={48}
                  online={isUserOnline(onlineUsers, user._id)}
                />
                <div className="min-w-0">
                  <p className="truncate font-semibold text-ink-800">
                    {user.name || user.userName}
                  </p>
                  <p className="text-xs text-ink-500">@{user.userName}</p>
                </div>
              </button>
            ))
          )}
        </div>
      )}

      {/* Contacts */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-ink-500">
          Conversations
        </p>
        <div className="flex flex-col gap-2">
          {(otherUsers || []).length === 0 ? (
            <div className="rounded-2xl bg-white p-6 text-center text-sm text-ink-500 shadow-card">
              No other users yet. Invite friends to Chatly!
            </div>
          ) : (
            otherUsers.map((user) => {
              const isOnline = isUserOnline(onlineUsers, user._id);
              const active = selectedUser?._id === user._id;
              return (
                <button
                  type="button"
                  key={user._id}
                  onClick={() => pickUser(user)}
                  className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition ${
                    active
                      ? "bg-brand-500 text-white shadow-soft"
                      : "bg-white text-ink-800 shadow-sm hover:bg-brand-50"
                  }`}
                >
                  <Avatar src={user.image} size={48} online={isOnline} />
                  <div className="min-w-0 flex-1">
                    <p
                      className={`truncate font-semibold ${
                        active ? "text-white" : "text-ink-800"
                      }`}
                    >
                      {user.name || user.userName}
                    </p>
                    <p
                      className={`text-xs ${
                        active ? "text-brand-100" : "text-ink-500"
                      }`}
                    >
                      {formatListSubtitle(isOnline)}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </aside>
  );
}

export default SideBar;
