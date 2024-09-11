import { component$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";

export const TableBill = component$(() => {
  const location = useLocation();

  return (
    <div>
      <h3 class="mb-2 text-lg font-bold text-gray-900 dark:text-white">
        Bill for {location.params.code}
      </h3>
    </div>
  );
});
