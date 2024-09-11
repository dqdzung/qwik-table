import {
  $,
  component$,
  type Signal,
  useSignal,
  useTask$,
  useVisibleTask$,
} from "@builder.io/qwik";
import { supabase } from "~/lib/db";
import type { DocumentHead } from "@builder.io/qwik-city";
import type { Item } from "~/types/item";
import ItemModal, { ITEM_MODAL_ID } from "~/components/itemModal";
import ConfirmModal from "~/components/confirmModal";

const fetchItems = async (loading?: Signal<boolean>) => {
  if (loading) {
    loading.value = true;
  }
  const { data: items } = await supabase.from("items").select(`
    *,
    categories (
      name, 
      code
    )
  `);
  if (loading) {
    loading.value = false;
  }
  return items || [];
};

export const tableHeaders = ["name", "category", "code", "price"];
export const DELETE_CONFIRM_MODAL_ID = "item-delete-confirm-modal";

export default component$(() => {
  const items = useSignal<Item[]>([]);
  const loading = useSignal<boolean>(false);
  const deleteId = useSignal<number>(0);
  const editItem = useSignal<Item | null>(null);
  const addBtnRef = useSignal<HTMLButtonElement>();

  const handleDelete = $(async () => {
    if (!deleteId.value) return;
    loading.value = true;
    await supabase.from("items").delete().eq("id", deleteId.value);
    loading.value = false;
    deleteId.value = 0;
  });

  const handleEdit = $((item: Item) => {
    editItem.value = item;
    if (addBtnRef.value) {
      addBtnRef.value.click();
    }
  });

  useTask$(async () => {
    const res = await fetchItems();
    items.value = res;
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ cleanup }) => {
    const channel = supabase
      .channel("table")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "items",
        },
        async (payload) => {
          let signal;
          if (payload.eventType !== "DELETE") {
            signal = loading;
          }
          const res = await fetchItems(signal);
          items.value = res;
        },
      )
      .subscribe();
    cleanup(() => {
      supabase.removeChannel(channel);
    });
  });

  return (
    <div class="relative overflow-x-auto">
      <button
        data-modal-target={ITEM_MODAL_ID}
        data-modal-toggle={ITEM_MODAL_ID}
        class="focus:outline-non mb-2 inline-flex items-center justify-center bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        ref={addBtnRef}
      >
        <svg
          class="-ms-1 me-1 h-5 w-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
            clip-rule="evenodd"
          ></path>
        </svg>
        Add
      </button>
      <table class="w-full text-left text-sm text-white">
        <thead class="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {tableHeaders.map((header) => (
              <th key={header} scope="col" class="px-6 py-3">
                {header}
              </th>
            ))}
            <th scope="col" class="flex justify-center px-6 py-3">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {items.value.map((item) => (
            <tr
              class="border-b bg-white dark:border-gray-700 dark:bg-gray-800"
              key={item.id}
            >
              <td class="px-6 py-3">
                {/* <input
                  type="text"
                  value={item.name}
                  class="focus:ring-primary-600 focus:border-primary-600 dark:focus:ring-primary-500 dark:focus:border-primary-500 block rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
                /> */}
                {item.name}
              </td>
              <td class="w-[15%] px-6 py-3">{item.categories?.name}</td>
              <td class="w-[15%] px-6 py-3">{item.code}</td>
              <td class="w-[15%] px-6 py-3">{item.price}</td>
              <td class="w-[10%] px-6 py-3">
                <div class="flex justify-center">
                  <button
                    type="button"
                    class="hover:text-red me-2 inline-flex items-center text-center text-sm font-medium focus:outline-none"
                    onClick$={() => {
                      if (!item.id) return;
                      handleEdit(item);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      class="lucide lucide-pencil h-5 w-5 text-white hover:text-blue-600"
                    >
                      <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
                      <path d="m15 5 4 4" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    class="hover:text-red me-2 inline-flex items-center text-center text-sm font-medium focus:outline-none"
                    onClick$={() => {
                      deleteId.value = item.id || 0;
                    }}
                  >
                    <svg
                      class="h-5 w-5 text-white hover:text-red-600"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
                      />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ItemModal data={editItem} />
      {deleteId.value > 0 && (
        <ConfirmModal
          handleConfirm={handleDelete}
          handleClose={$(() => {
            deleteId.value = 0;
          })}
          loading={loading.value}
        />
      )}
    </div>
  );
});

export const head: DocumentHead = {
  title: "Items",
  meta: [
    {
      name: "Items page",
      content: "Items page description",
    },
  ],
};
