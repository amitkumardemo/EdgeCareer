"use client";

import * as React from "react";
import { useUser, useReverification } from "@clerk/nextjs";
import { BackupCodeResource } from "@clerk/types";

export function GenerateBackupCodes() {
  const { user } = useUser();
  const [backupCodes, setBackupCodes] = React.useState<BackupCodeResource>();
  const [loading, setLoading] = React.useState(false);
  const createBackupCode = useReverification(() => user?.createBackupCode());

  React.useEffect(() => {
    if (backupCodes) return;
    setLoading(true);
    void createBackupCode()
      .then((codes) => setBackupCodes(codes))
      .catch((err) => {
        console.error("Error generating backup codes:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return <p className="text-gray-500">Generating backup codes...</p>;
  if (!backupCodes)
    return <p className="text-red-600">Failed to generate backup codes.</p>;

  return (
    <div className="bg-zinc-100 dark:bg-zinc-900 p-4 rounded-lg shadow-md mt-4">
      <ol className="list-decimal pl-5 text-sm space-y-1 text-zinc-800 dark:text-zinc-200">
        {backupCodes.codes.map((code, idx) => (
          <li key={idx}>{code}</li>
        ))}
      </ol>
    </div>
  );
}
