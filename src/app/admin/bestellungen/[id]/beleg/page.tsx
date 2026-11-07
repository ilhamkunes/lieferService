import { Suspense } from "react";
import { BelegContent } from "@/components/admin/beleg-content";

export const instant = false;

export default function BelegPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={<p className="p-4 text-sm text-neutral-400">Wird geladen…</p>}
    >
      <BelegPageInner params={params} />
    </Suspense>
  );
}

async function BelegPageInner({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <BelegContent orderId={id} />;
}
