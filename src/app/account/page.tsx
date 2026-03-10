"use client";

import { FormEvent, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";

interface Profile {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  province: string | null;
  organization: string | null;
  role: "USER" | "MODERATOR" | "ADMIN";
}

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileError, setProfileError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const [profileForm, setProfileForm] = useState({
    name: "",
    phone: "",
    province: "",
    organization: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signin");
      return;
    }
    loadProfile();
  }, [session, status, router]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/account/profile");
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to load profile");
      }
      const p = data.profile as Profile;
      setProfile(p);
      setProfileForm({
        name: p.name || "",
        phone: p.phone || "",
        province: p.province || "",
        organization: p.organization || "",
      });
    } catch (error) {
      setProfileError(error instanceof Error ? error.message : "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const submitProfile = async (event: FormEvent) => {
    event.preventDefault();
    setProfileError("");
    setProfileSuccess("");

    const response = await fetch("/api/account/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profileForm),
    });
    const data = await response.json();
    if (!response.ok) {
      setProfileError(data.error || "Failed to update profile");
      return;
    }
    setProfile(data.profile);
    setProfileSuccess("Cập nhật thông tin cá nhân thành công.");
  };

  const submitPassword = async (event: FormEvent) => {
    event.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    const response = await fetch("/api/account/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(passwordForm),
    });
    const data = await response.json();
    if (!response.ok) {
      setPasswordError(data.error || "Failed to update password");
      return;
    }
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setPasswordSuccess("Đổi mật khẩu thành công.");
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header currentPath="/account" />
        <div className="container mx-auto px-4 py-8">
          <div className="flex h-64 items-center justify-center">
            <div className="h-24 w-24 animate-spin rounded-full border-b-2 border-green-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPath="/account" />
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">Tài khoản cá nhân</h1>

        <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Thông tin cá nhân</h2>
          <p className="mb-4 text-sm text-gray-600">Email: {profile?.email}</p>
          <form onSubmit={submitProfile} className="space-y-4">
            <input
              value={profileForm.name}
              onChange={(e) => setProfileForm((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              placeholder="Họ và tên"
            />
            <input
              value={profileForm.phone}
              onChange={(e) => setProfileForm((prev) => ({ ...prev, phone: e.target.value }))}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              placeholder="Số điện thoại"
            />
            <input
              value={profileForm.province}
              onChange={(e) => setProfileForm((prev) => ({ ...prev, province: e.target.value }))}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              placeholder="Tỉnh/Thành phố"
            />
            <input
              value={profileForm.organization}
              onChange={(e) => setProfileForm((prev) => ({ ...prev, organization: e.target.value }))}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              placeholder="Tổ chức"
            />
            {profileError && <p className="text-sm text-red-600">{profileError}</p>}
            {profileSuccess && <p className="text-sm text-emerald-600">{profileSuccess}</p>}
            <Button type="submit">Lưu thay đổi</Button>
          </form>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Đổi mật khẩu</h2>
          <form onSubmit={submitPassword} className="space-y-4">
            <input
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              placeholder="Mật khẩu hiện tại"
            />
            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              placeholder="Mật khẩu mới (ít nhất 8 ký tự)"
            />
            <input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              placeholder="Xác nhận mật khẩu mới"
            />
            {passwordError && <p className="text-sm text-red-600">{passwordError}</p>}
            {passwordSuccess && <p className="text-sm text-emerald-600">{passwordSuccess}</p>}
            <Button type="submit">Đổi mật khẩu</Button>
          </form>
        </section>
      </div>
    </div>
  );
}
