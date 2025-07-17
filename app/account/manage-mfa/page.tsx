"use client";

import * as React from "react";
import { useUser, useReverification } from "@clerk/nextjs";
import Link from "next/link";
import { GenerateBackupCodes } from "@/components/GenerateBackupCodes";

const TotpEnabled = () => {
  const { user } = useUser();
  const disableTOTP = useReverification(() => user?.disableTOTP());

  return (
    <div className="flex flex-col gap-2 mt-4">
      <p className="text-green-600 font-medium">TOTP is currently enabled.</p>
      <button
        onClick={() => disableTOTP()}
        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
      >
        Disable TOTP
      </button>
    </div>
  );
};

const TotpDisabled = () => (
  <div className="flex flex-col gap-2 mt-4">
    <p className="text-yellow-600 font-medium">TOTP is not enabled.</p>
    <Link href="/account/manage-mfa/add">
      <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
        Add TOTP
      </button>
    </Link>
  </div>
);

export default function ManageMFA() {
  const { isLoaded, user } = useUser();
  const [showNewCodes, setShowNewCodes] = React.useState(false);

  if (!isLoaded) return null;
  if (!user)
    return (
      <p className="text-center">You must be logged in to access this page.</p>
    );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-center">
        Multi-Factor Authentication
      </h1>

      <div className="space-y-4">
        {user.totpEnabled ? <TotpEnabled /> : <TotpDisabled />}
      </div>

      {user.backupCodeEnabled && user.twoFactorEnabled && (
        <div className="space-y-2">
          <p className="text-sm">Need new backup codes?</p>
          <button
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition"
            onClick={() => setShowNewCodes(true)}
          >
            Generate Backup Codes
          </button>
        </div>
      )}

      {showNewCodes && (
        <div className="space-y-3">
          <GenerateBackupCodes />
          <button
            className="text-sm text-muted-foreground hover:underline"
            onClick={() => setShowNewCodes(false)}
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}
