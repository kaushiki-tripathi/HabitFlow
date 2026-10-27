import { useEffect, useState } from "react";
import { Mail, Phone, Save, UserRound } from "lucide-react";
import ProfileField from "./ProfileField";
import ProfileSection from "./ProfileSection";
import {
  PROFILE_INPUT_CLASS,
  PROFILE_PRIMARY_BUTTON_CLASS,
} from "./profileStyles";

const GENDER_OPTIONS = ["", "Female", "Male", "Non-binary", "Prefer not to say", "Other"];

export default function PersonalInfoSection({ user, updateProfile, loading, onNotify }) {
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [gender, setGender] = useState(user?.gender || "");
  const [country, setCountry] = useState(user?.country || "");
  const [saving, setSaving] = useState(false);
  const isGoogleUser = user?.authProvider === "google";

  useEffect(() => {
    setEmail(user?.email || "");
    setPhone(user?.phone || "");
    setGender(user?.gender || "");
    setCountry(user?.country || "");
  }, [user?.email, user?.phone, user?.gender, user?.country]);

  const dirty =
    email.trim().toLowerCase() !== (user?.email || "").toLowerCase() ||
    phone.trim() !== (user?.phone || "") ||
    gender !== (user?.gender || "") ||
    country.trim() !== (user?.country || "");

  const saveDetails = async (event) => {
    event.preventDefault();
    if (!isGoogleUser && !email.trim()) {
      onNotify("Email cannot be empty.", "error");
      return;
    }
    setSaving(true);
    const result = await updateProfile({
      email: isGoogleUser ? user?.email : email.trim(),
      phone: phone.trim(),
      gender,
      country: country.trim(),
    });
    setSaving(false);
    onNotify(
      result.success ? "Personal information saved." : result.error || "Could not save details.",
      result.success ? "success" : "error"
    );
  };

  return (
    <ProfileSection
      icon={UserRound}
      title="Personal information"
      description="Contact and profile details kept with your account."
    >
      <form onSubmit={saveDetails} className="space-y-4">
        <ProfileField
          id="profile-email"
          label="Email address"
          hint={isGoogleUser ? "Managed by Google and cannot be changed here." : "Used for account sign-in."}
        >
          <div className="relative">
            <Mail size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" aria-hidden="true" />
            <input
              id="profile-email"
              type="email"
              autoComplete="email"
              value={email}
              disabled={isGoogleUser}
              onChange={(event) => setEmail(event.target.value)}
              className={`${PROFILE_INPUT_CLASS} pl-10 disabled:cursor-not-allowed disabled:opacity-60`}
              placeholder="you@example.com"
            />
          </div>
        </ProfileField>
        <ProfileField id="profile-phone" label="Phone number">
          <div className="relative">
            <Phone size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" aria-hidden="true" />
            <input
              id="profile-phone"
              type="tel"
              autoComplete="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className={`${PROFILE_INPUT_CLASS} pl-10`}
              placeholder="Add a phone number"
            />
          </div>
        </ProfileField>
        <div className="grid gap-4 sm:grid-cols-2">
          <ProfileField id="profile-gender" label="Gender">
            <select
              id="profile-gender"
              value={gender}
              onChange={(event) => setGender(event.target.value)}
              className={`${PROFILE_INPUT_CLASS} cursor-pointer`}
            >
              {GENDER_OPTIONS.map((option) => (
                <option key={option || "empty"} value={option}>
                  {option || "Select an option"}
                </option>
              ))}
            </select>
          </ProfileField>
          <ProfileField id="profile-country" label="Country">
            <input
              id="profile-country"
              autoComplete="country-name"
              value={country}
              onChange={(event) => setCountry(event.target.value)}
              className={PROFILE_INPUT_CLASS}
              placeholder="Add your country"
            />
          </ProfileField>
        </div>
        <button
          type="submit"
          disabled={!dirty || saving || loading}
          className={PROFILE_PRIMARY_BUTTON_CLASS}
        >
          <Save size={16} aria-hidden="true" />
          {saving ? "Saving..." : "Save personal info"}
        </button>
      </form>
    </ProfileSection>
  );
}
