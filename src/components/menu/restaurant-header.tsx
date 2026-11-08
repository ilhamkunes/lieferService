import { RESTAURANT_NAME } from "@/lib/config";
import { AccountLink } from "@/components/account/account-link";
import { FoodPlaceholderIcon } from "@/components/ui/food-placeholder-icon";

export function RestaurantHeader({
  kapakFotoUrl,
  logoUrl,
}: {
  kapakFotoUrl: string | null;
  logoUrl: string | null;
}) {
  return (
    <div>
      <div className="relative h-36 w-full overflow-hidden bg-gradient-to-br from-orange-50 to-orange-100">
        {kapakFotoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={kapakFotoUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <FoodPlaceholderIcon className="h-12 w-12 text-orange-200" />
          </div>
        )}

        <div className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium shadow">
          <AccountLink />
        </div>
      </div>

      <div className="-mt-8 flex items-end gap-3 px-4">
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border-4 border-white bg-orange-50 shadow-sm">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-lg font-bold text-orange-300">
              {RESTAURANT_NAME.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <h1 className="pb-1 text-lg font-bold text-neutral-900">
          {RESTAURANT_NAME}
        </h1>
      </div>

      <div className="h-3" />
    </div>
  );
}
