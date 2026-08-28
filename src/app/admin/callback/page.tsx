import { Suspense } from "react";
import CallbackHandler from "./CallbackHandler";

export default function AdminCallback() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-muted">Signing you in...</p></div>}>
      <CallbackHandler />
    </Suspense>
  );
}
