import { component$, useSignal } from "@builder.io/qwik";
import { type DocumentHead, useLocation } from "@builder.io/qwik-city";
import { routeLoader$ } from "@builder.io/qwik-city";
import dayjs from "dayjs";
import { Menu } from "~/components/menu";
import { TableBill } from "~/components/tableBill";
import { supabase } from "~/lib/db";

export const useTableDetail = routeLoader$(async (requestEvent) => {
  const { data } = await supabase
    .from("tables")
    .select("id, code, date")
    .eq("code", requestEvent.params.code);
  return data?.[0] || null;
});

export default component$(() => {
  const location = useLocation();
  const table = useTableDetail();
  const active = useSignal("menu");

  const getActiveClasses = (key: string) => {
    return key === active.value
      ? "bg-blue-700 px-4 py-3 text-white dark:bg-blue-600"
      : "bg-gray-50 hover:bg-gray-100 hover:text-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white";
  };

  return (
    <div class="md:flex">
      <ul class="flex-column space-y mb-4 space-y-4 text-sm font-medium text-gray-500 dark:text-gray-400 md:mb-0 md:me-4">
        <li>
          <button
            class={`${getActiveClasses("bill")} inline-flex w-full items-center rounded-lg px-4 py-3`}
            onClick$={() => (active.value = "bill")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-circle-dollar-sign me-2 h-4 w-4 text-white"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
              <path d="M12 18V6" />
            </svg>
            Bill
          </button>
        </li>
        <li>
          <button
            class={`${getActiveClasses("menu")} inline-flex w-full items-center rounded-lg px-4 py-3`}
            onClick$={() => (active.value = "menu")}
          >
            <svg
              class="lucide lucide-scroll-text me-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M15 12h-5" />
              <path d="M15 8h-5" />
              <path d="M19 17V5a2 2 0 0 0-2-2H4" />
              <path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3" />
            </svg>
            Menu
          </button>
        </li>
      </ul>

      <div class="text-medium w-full rounded-lg bg-gray-50 p-4 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
        {active.value === "bill" && <TableBill />}
        {active.value === "menu" && <Menu />}
      </div>
    </div>
  );
});

export const head: DocumentHead = ({ resolveValue }) => {
  const table = resolveValue(useTableDetail);
  return {
    title: `Table | ${table?.code}`,
    meta: [
      {
        name: "Table detail",
        content: dayjs(table?.date).format("DD/MM/YYYY"),
      },
    ],
  };
};
