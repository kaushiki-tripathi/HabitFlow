import { useState } from "react";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import ProfileField from "./ProfileField";
import ProfileSection from "./ProfileSection";
import {
  PROFILE_INPUT_CLASS,
  PROFILE_PRIMARY_BUTTON_CLASS,
} from "./profileStyles";

export default function SecuritySection({ isGoogleUser, updatePassword, loading, onNotify }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [saving, setSaving] = useState(false);

  const savePassword = async (event) => {
    event.preventDefault();
    if (isGoogleUser || saving) return;
    if (!currentPassword || !newPassword || !confirmPassword) {
      onNotify("Complete all password fields first.", "error");
      return;
    }
    if (newPassword.length < 6) {
      onNotify("New password must be at least 6 characters.", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      onNotify("The new passwords do not match.", "error");
      return;
    }

    setSaving(true);
    const result = await updatePassword(currentPassword, newPassword);
    setSaving(false);
    if (result.success) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
    onNotify(
      result.success ? result.message || "Password updated." : result.error || "Could not update password.",
      result.success ? "success" : "error"
    );
  };

  const passwordField = (id, label, value, onChange, autoComplete) => (
    <ProfileField id={id} label={label}>
      <div className="relative">
        <input
          id={id}
          type={showPasswords ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete={autoComplete}
          className={`${PROFILE_INPUT_CLASS} pr-12`}
        />
        <button
          type="button"
          onClick={() => setShowPasswords((visible) => !visible)}
          aria-label={showPasswords ? "Hide passwords" : "Show passwords"}
          className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-[var(--text-muted)] transition hover:bg-[var(--bg-card)] hover:text-[var(--text-main)]"
        >
          {showPasswords ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </ProfileField>
  );

  return (
    <ProfileSection
      icon={KeyRound}
      title="Security"
      description={isGoogleUser ? "Your account uses Google sign-in." : "Change your HabitFlow password."}
    >
      {isGoogleUser ? (
        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-subtle)] p-4 dark:border-[#2F2A25] dark:bg-[#27231F]">
          <p className="text-sm leading-relaxed text-[var(--text-muted)]">
            Password changes are managed by Google for this account. Visit your Google account settings to update your password.
          </p>
        </div>
      ) : (
        <form onSubmit={savePassword} className="space-y-4">
          {passwordField("current-password", "Current password", currentPassword, setCurrentPassword, "current-password")}
          {passwordField("new-password", "New password", newPassword, setNewPassword, "new-password")}
          {passwordField("confirm-password", "Confirm new password", confirmPassword, setConfirmPassword, "new-password")}
          <p className="text-xs text-[var(--text-muted)]">Use at least 6 characters. Your password is never included in data exports.</p>
          <button type="submit" disabled={saving || loading} className={PROFILE_PRIMARY_BUTTON_CLASS}>
            <KeyRound size={16} aria-hidden="true" />
            {saving ? "Updating password..." : "Update password"}
          </button>
        </form>
      )}
    </ProfileSection>
  );
}
