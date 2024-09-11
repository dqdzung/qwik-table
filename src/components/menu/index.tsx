import {
  component$,
  useComputed$,
  useSignal,
  useTask$,
} from "@builder.io/qwik";
import { supabase } from "~/lib/db";
import type { Category, Item } from "~/types/item";

const fetchCategory = async () => {
  const { data } = await supabase.from("categories").select("*");
  return data || [];
};

const fetchItems = async () => {
  const { data } = await supabase.from("items").select("*");
  return data || [];
};

export const Menu = component$(() => {
  const categories = useSignal<Category[]>([]);
  const selected = useSignal<string>("all");
  const items = useSignal<Item[]>([]);

  useTask$(async () => {
    categories.value = await fetchCategory();
  });
  useTask$(async () => {
    items.value = await fetchItems();
  });

  const filtered = useComputed$(() => {
    if (selected.value === "all") {
      return items.value;
    }
    return items.value.filter(({ categoryId }) => {
      const category = categories.value.find(
        ({ code }) => code === selected.value,
      );
      return category?.id === categoryId;
    });
  });

  const getActiveClass = (key: string) => {
    return key === selected.value
      ? "dark:text-white dark:bg-blue-500"
      : "dark:text-blue-500 dark:hover:border-blue-500";
  };

  return (
    <div>
      <div class="flex flex-row gap-5">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white">Menu</h3>

        <div class="flex flex-wrap items-center justify-center">
          <button
            type="button"
            class={`${getActiveClass("all")} mb-3 me-3 min-w-[70px] rounded-full border bg-white px-4 py-1 text-center text-sm font-medium text-blue-700 dark:border-gray-800 dark:bg-gray-900`}
            onClick$={() => (selected.value = "all")}
          >
            All
          </button>
          {categories.value.map((category) => (
            <button
              key={category.id}
              type="button"
              class={`${getActiveClass(category.code)} mb-3 me-3 min-w-[70px] rounded-full border bg-white px-4 py-1 text-center text-sm font-medium text-blue-700 dark:border-gray-800 dark:bg-gray-900`}
              onClick$={() => (selected.value = category.code)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});
