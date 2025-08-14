"use client";

import { useUser, useReverification } from "@clerk/nextjs";
import type { TOTPResource } from "@clerk/types";
import Link from "next/link";
import * as React from "react";
import { QRCodeSVG } from "qrcode.react";
import { GenerateBackupCodes } from "@/components/GenerateBackupCodes";
import QRCode from "react-qr-code";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

type AddTotpSteps = "add" | "verify" | "backupcodes" | "success";
type DisplayFormat = "qr" | "uri";

// ========== Add Step ==========
function AddTotpScreen({
  setStep,
}: {
  setStep: React.Dispatch<React.SetStateAction<AddTotpSteps>>;
}) {
  const { user } = useUser();
  const [totp, setTOTP] = React.useState<TOTPResource | undefined>(undefined);
  const [displayFormat, setDisplayFormat] = React.useState<"qr" | "uri">("qr");

  const createTOTP = useReverification(() => user?.createTOTP());

  React.useEffect(() => {
    void createTOTP()
      .then((totpResource) => setTOTP(totpResource))
      .catch((err) => console.error("Error creating TOTP:", err));
  }, [createTOTP]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Set up TOTP Authentication</h2>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Scan the QR code with your authenticator app or view the URI instead.
      </p>
      <div className="p-6 dark:bg-gray-900 rounded-xl shadow-lg">
        {totp && displayFormat === "qr" && (
          <div className="flex flex-col items-center gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <QRCode
                title="Multi-Factor-Auth"
                value={totp.uri || ""}
                bgColor="#ffffff"
                fgColor="#000000"
                level="H"
                size={200}
              />
            </div>
            <button
              className="text-blue-500 hover:underline text-sm"
              onClick={() => setDisplayFormat("uri")}
            >
              Use URI instead
            </button>
          </div>
        )}
      </div>

      {totp && displayFormat === "uri" && (
        <div className="space-y-2">
          <p className="break-all bg-zinc-100 dark:bg-zinc-800 p-2 rounded">
            {totp.uri}
          </p>
          <button
            className="text-blue-500 hover:underline text-sm"
            onClick={() => setDisplayFormat("qr")}
          >
            Use QR Code instead
          </button>
        </div>
      )}

      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        After setting it up in your app, click verify to continue.
      </p>

      <div className="flex gap-3">
        <button
          onClick={() => setStep("verify")}
          disabled={!totp}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Verify
        </button>
        <button
          onClick={() => setStep("add")}
          className="px-4 py-2 border rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

// ========== Verify Step ==========
function VerifyTotpScreen({
  setStep,
}: {
  setStep: React.Dispatch<React.SetStateAction<AddTotpSteps>>;
}) {
  const { user } = useUser();
  const [code, setCode] = React.useState("");

  const verifyTotp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await user?.verifyTOTP({ code });
      setStep("backupcodes");
    } catch (err) {
      console.error("Error verifying TOTP:", err);
      alert("Invalid code. Try again.");
    }
  };

  return (
    <form onSubmit={verifyTotp} className="space-y-6">
      <h2 className="text-2xl font-semibold">Verify your code</h2>
      <div>
        <label htmlFor="totp-code" className="block text-sm font-medium mb-1">
          Enter the 6-digit code from your authenticator app:
        </label>
        <input
          id="totp-code"
          value={code}
          onChange={(e) => setCode(e.currentTarget.value)}
          className="w-full px-3 py-2 border rounded dark:bg-zinc-900 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          inputMode="numeric"
          maxLength={6}
          required
        />
      </div>
      <div className="flex gap-3">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Verify Code
        </button>
        <button
          type="button"
          onClick={() => setStep("add")}
          className="px-4 py-2 border rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          Reset
        </button>
      </div>
    </form>
  );
}

// ========== Backup Step ==========
function BackupCodeScreen({
  setStep,
}: {
  setStep: React.Dispatch<React.SetStateAction<AddTotpSteps>>;
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Success! ✅</h2>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Save these backup codes somewhere safe. You'll need them if you lose
        access to your device.
      </p>
      <GenerateBackupCodes />
      <button
        onClick={() => setStep("success")}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Finish
      </button>
    </div>
  );
}

// ========== Final Step ==========
 function SuccessScreen() {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push("/dashboard");
    }, 3000); 

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">TOTP Enabled 🎉</h2>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        You’ve successfully added TOTP multi-factor authentication.
      </p>
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        Redirecting you to your dashboard...
      </p>
    </div>
  );
}


// ========== Main Container ==========
export default function AddMfaScreen() {
  const [step, setStep] = React.useState<AddTotpSteps>("add");
  const { isLoaded, user } = useUser();

  if (!isLoaded) return null;
  if (!user) return <p>You must be logged in to access this page</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 p-8 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-700 space-y-6">
        {step === "add" && <AddTotpScreen setStep={setStep} />}
        {step === "verify" && <VerifyTotpScreen setStep={setStep} />}
        {step === "backupcodes" && <BackupCodeScreen setStep={setStep} />}
        {step === "success" && <SuccessScreen />}
      </div>
      <Link
        href="/account/manage-mfa"
        className="mt-6 text-blue-500 hover:underline text-sm"
      >
        {/* ← Back to Manage MFA */}
      </Link>
    </div>
  );
}
