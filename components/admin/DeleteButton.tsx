"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import type { ActionResult } from "@/app/adminsangwon/actions";

export function DeleteButton({
  id,
  label,
  action,
}: {
  id: string;
  label: string;
  action: (id: string) => Promise<ActionResult>;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const router = useRouter();

  const onClick = () => {
    if (!window.confirm(label)) return;
    startTransition(async () => {
      const result = await action(id);
      if (result.ok) router.refresh();
      else setError(result.message);
    });
  };

  return (
    <span className="shrink-0 inline-flex items-center gap-2">
      {error && <span className="text-[10px] font-bold text-red-500 max-w-40 truncate" title={error}>{error}</span>}
      <button
        type="button"
        onClick={onClick}
        disabled={pending}
        aria-label="삭제"
        className="p-2 rounded-full text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-40"
      >
        <Trash2 size={15} />
      </button>
    </span>
  );
}
