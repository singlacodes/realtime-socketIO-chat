import React, { useRef, useState } from "react";
import { IoCameraOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../main";
import { setUserData } from "../redux/userSlice";
import { mediaUrl } from "../utils/mediaUrl";
import dp from "../assets/dp.webp";

function Profile() {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [name, setName] = useState(userData?.name || "");
  const [frontendImage, setFrontendImage] = useState(
    mediaUrl(userData?.image) || dp
  );
  const [backendImage, setBackendImage] = useState(null);
  const image = useRef();
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const handleProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErr("");
    try {
      const formData = new FormData();
      formData.append("name", name);
      if (backendImage) {
        formData.append("image", backendImage);
      }
      const result = await axios.put(`${serverUrl}/api/user/profile`, formData, {
        withCredentials: true,
      });
      dispatch(setUserData(result.data));
      navigate("/");
    } catch (error) {
      setErr(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to save profile"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="relative flex min-h-full flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-brand-100 via-ink-50 to-brand-200 px-4 py-12">
      <button
        type="button"
        onClick={() => navigate("/")}
        className="absolute left-4 top-4 z-20 flex items-center gap-1 rounded-full bg-white/80 px-3 py-2 text-ink-700 shadow-card backdrop-blur transition hover:bg-white"
      >
        <IoIosArrowRoundBack className="h-6 w-6" />
        <span className="text-sm font-medium">Back</span>
      </button>

      <div className="card-shell animate-slide-up max-w-lg p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-ink-900">Edit profile</h1>
          <p className="mt-1 text-sm text-ink-500">
            Update your display name and photo
          </p>
        </div>

        <div className="flex flex-col items-center">
          <button
            type="button"
            onClick={() => image.current?.click()}
            className="group relative rounded-full p-1"
          >
            <div className="h-36 w-36 overflow-hidden rounded-full border-4 border-brand-400 bg-white shadow-soft">
              <img
                src={frontendImage}
                alt="Profile"
                className="h-full w-full object-cover transition group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.src = dp;
                }}
              />
            </div>
            <span className="absolute bottom-2 right-2 flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 text-white shadow-lg ring-4 ring-white transition group-hover:bg-brand-600">
              <IoCameraOutline className="h-5 w-5" />
            </span>
          </button>
          <p className="mt-3 text-xs font-medium text-ink-500">
            Tap photo to change
          </p>
        </div>

        <form className="mt-6 flex flex-col gap-4" onSubmit={handleProfile}>
          <input
            type="file"
            accept="image/*"
            ref={image}
            hidden
            onChange={handleImage}
          />

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500">
              Display name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              className="input-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500">
              Username
            </label>
            <input
              type="text"
              readOnly
              className="input-field cursor-not-allowed bg-ink-50 text-ink-500"
              value={userData?.userName || ""}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500">
              Email
            </label>
            <input
              type="email"
              readOnly
              className="input-field cursor-not-allowed bg-ink-50 text-ink-500"
              value={userData?.email || ""}
            />
          </div>

          {err && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {err}
            </p>
          )}

          <button type="submit" className="btn-primary mt-2 w-full" disabled={saving}>
            {saving ? "Saving…" : "Save profile"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;
