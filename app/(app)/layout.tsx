"use client";

import { BeaconProvider } from "@/lib/store";
import { BeaconShell } from "@/components/shell";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <BeaconProvider>
      <BeaconShell>{children}</BeaconShell>
    </BeaconProvider>
  );
}