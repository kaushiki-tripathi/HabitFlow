import { useEffect, useState } from "react";
import { CalendarDays, Camera, Save, ShieldCheck, UserRound, X } from "lucide-react";
import ProfileField from "./ProfileField";
import ProfileSection from "./ProfileSection";
import UserAvatar from "../layout/UserAvatar";
import {
  PROFILE_INPUT_CLASS,
  PROFILE_LABEL_CLASS,
  PROFILE_PRIMARY_BUTTON_CLASS,
  PROFILE_SECONDARY_BUTTON_CLASS,
} from "./profileStyles";

function compressPhoto(file) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Choose an image file."));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      reject(new Error("Image must be smaller than 5 MB."));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read this image."));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error("This image could not be opened."));
      image.onload = () => {
        const scale = Math.min(1, 400 / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.72));
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function formatMemberSince(value) {
  if (!value || Number.isNaN(new Date(value).getTime())) return "—";
  return new Date(value).toLocaleDateString("en", {
    month: "long",
    year: "numeric",
  });
}

export default function IdentitySection({ user, updateProfile, loading, onNotify }) {
  const [name, setName] = useState(user?.name || "");
  const [about, setAbout] = useState(user?.about || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [photoBusy, setPhotoBusy] = useState(false);

  useEffect(() => {
    setName(user?.name || "");
    setAbout(user?.about || "");
    setAvatar(user?.avatar || "");
  }, [user?.name, user?.about, user?.avatar]);

  const dirty =
    name.trim() !== (user?.name || "").trim() ||
    about.trim() !== (user?.about || "").trim();

  const saveIdentity = async (event) => {
    event.preventDefault();
    if (!name.trim()) {
      onNotify("Display name cannot be empty.", "error");
      return;
    }
    setSaving(true);
    const result = await updateProfile({ name: name.trim(), about: about.trim() });
    setSaving(false);
    onNotify(
      result.success ? "Identity details saved." : result.error || "Could not save profile.",
      result.success ? "success" : "error"
    );
  };

  const changePhoto = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setUploading(true);
    try {
      const imageData = await compressPhoto(file);
      const result = await updateProfile({ avatar: imageData });
      if (result.success) {
        setAvatar(imageData);
        onNotify("Profile photo updated.");
      } else {
        onNotify(result.error || "Could not update profile photo.", "error");
      }
    } catch (error) {
      onNotify(error.message || "Could not process this image.", "error");
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = async () => {
    setPhotoBusy(true);
    const result = await updateProfile({ avatar: "" });
    setPhotoBusy(false);
    if (result.success) {
      setAvatar("");
      onNotify("Profile photo removed.");
    } else {
      onNotify(result.error || "Could not remove profile photo.", "error");
    }
  };

  return (
    <ProfileSection
      icon={UserRound}
      title="Identity"
      description="Your profile details and how your account appears in HabitFlow."
    >
      <div className="mb-6 flex flex-col gap-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-subtle)]/60 p-4 dark:border-[#2F2A25] dark:bg-[#27231F]/60 sm:flex-row sm:items-center">
        <UserAvatar name={name || "User"} avatar={avatar} size="xl" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-serif text-xl font-semibold text-[var(--text-main)]">
            {name || "Your name"}
          </p>
          <p className="mt-0.5 truncate text-sm text-[var(--text-muted)]">
            {user?.email || "—"}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-color)] bg-[var(--bg-card)] px-2.5 py-1 text-[11px] font-semibold text-[var(--text-muted)] dark:border-[#3A322A] dark:bg-[#1E1B18]">
              <ShieldCheck size={13} aria-hidden="true" />
              {user?.authProvider === "google" ? "Google account" : "Email account"}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-color)] bg-[var(--bg-card)] px-2.5 py-1 text-[11px] font-semibold text-[var(--text-muted)] dark:border-[#3A322A] dark:bg-[#1E1B18]">
              <CalendarDays size={13} aria-hidden="true" />
              Member since {formatMemberSince(user?.createdAt)}
            </span>
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <label className={`${PROFILE_SECONDARY_BUTTON_CLASS} cursor-pointer`}>
            <Camera size={16} aria-hidden="true" />
            {uploading ? "Uploading..." : avatar ? "Change photo" : "Upload photo"}
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              disabled={uploading || photoBusy || loading}
              onChange={changePhoto}
            />
          </label>
          {avatar && (
            <button
              type="button"
              onClick={removePhoto}
              disabled={uploading || photoBusy || loading}
              className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-[var(--text-muted)] transition hover:bg-red-500/10 hover:text-red-600 disabled:opacity-50 dark:hover:text-red-300"
            >
              <X size={16} aria-hidden="true" />
              Remove
            </button>
          )}
        </div>
      </div>

      <form onSubmit={saveIdentity} className="space-y-4">
        <ProfileField id="profile-name" label="Display name">
          <input
            id="profile-name"
            required
            maxLength={80}
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={PROFILE_INPUT_CLASS}
            placeholder="Your name"
          />
        </ProfileField>
        <ProfileField id="profile-about" label="About" hint={`${about.length}/240 characters`}>
          <textarea
            id="profile-about"
            rows={3}
            maxLength={240}
            value={about}
            onChange={(event) => setAbout(event.target.value)}
            className={`${PROFILE_INPUT_CLASS} resize-y`}
            placeholder="A short introduction about you"
          />
        </ProfileField>
        <button
          type="submit"
          disabled={!dirty || saving || loading}
          className={PROFILE_PRIMARY_BUTTON_CLASS}
        >
          <Save size={16} aria-hidden="true" />
          {saving ? "Saving..." : "Save identity"}
        </button>
      </form>
    </ProfileSection>
  );
}
