import {
  $,
  type Signal,
  component$,
  useSignal,
  useStore,
  useTask$,
  useVisibleTask$,
} from "@builder.io/qwik";
import { supabase } from "~/lib/db";
import type { Category, Item } from "~/types/item";

export const ITEM_MODAL_ID = "item-modal";

const DEFAULT_VALUE = {
  name: "",
  code: "",
  price: 0,
  categoryId: 0,
};

const fetchCategory = async () => {
  const { data } = await supabase.from("categories").select("*");
  return data || [];
};

export default component$(({ data }: { data: Signal<Item | null> }) => {
  const formValue = useStore<{
    name: string;
    code: string;
    price: number;
    categoryId: number;
  }>(DEFAULT_VALUE);
  const loading = useSignal(false);
  const error = useSignal("");
  const closeBtnRef = useSignal<HTMLButtonElement>();
  const categories = useSignal<Category[]>([]);

  const clearForm = $(() => {
    Object.assign(formValue, DEFAULT_VALUE);
  });

  const handleClose = $(() => {
    clearForm();
    closeBtnRef.value?.click();
  });

  const handleSubmit = $(async () => {
    loading.value = true;
    const newItem: Item = {
      ...formValue,
    };

    Object.hasOwn(newItem, "categories") && delete newItem.categories;

    if (data.value) {
      await supabase.from("items").update(newItem).eq("id", data.value.id);
      handleClose();
    } else {
      const res = await supabase.from("items").insert(newItem);
      if (res.error) {
        error.value = "Code already exists!";
      } else handleClose();
    }
    loading.value = false;
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ track }) => {
    track(() => data.value);
    Object.assign(formValue, data.value ? data.value : DEFAULT_VALUE);
    if (data.value && error.value) error.value = "";
  });

  useTask$(({ track }) => {
    track(() => error.value);
    if (error.value) setTimeout(() => (error.value = ""), 3000);
  });

  useTask$(async () => {
    categories.value = await fetchCategory();
  });

  return (
    <div
      id={ITEM_MODAL_ID}
      aria-hidden="true"
      class="fixed left-0 right-0 top-0 z-50 hidden h-[100%] max-h-full w-full items-center justify-center overflow-y-auto overflow-x-hidden bg-gray-900 bg-opacity-70 backdrop-blur-sm md:inset-0"
      data-modal-backdrop="static"
    >
      {/* Backdrop */}
      <div class="relative max-h-full w-full max-w-md p-4">
        {/* Modal */}
        <div class="relative rounded-lg bg-white shadow dark:bg-gray-700">
          {/* Error */}
          {error.value && (
            <div
              class="absolute top-[-70px] flex w-full items-center rounded-lg bg-white p-4 text-gray-500 shadow dark:bg-gray-800 dark:text-gray-400"
              role="alert"
            >
              <div class="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
                <svg
                  class="h-5 w-5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z" />
                </svg>
                <span class="sr-only">Error icon</span>
              </div>
              <div class="ms-3 text-sm font-normal">{error.value}</div>
            </div>
          )}

          <div class="flex items-center justify-between rounded-t border-b p-4 dark:border-gray-600 md:p-5">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {!data.value ? "Add New Item" : `Update ${data.value.name}`}
            </h3>

            <button
              type="button"
              class="ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-toggle={ITEM_MODAL_ID}
              ref={closeBtnRef}
              onClick$={$(() => {
                data.value = null;
              })}
            >
              <svg
                class="h-3 w-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span class="sr-only">Close modal</span>
            </button>
          </div>
          <form
            class="p-4 md:p-5"
            action=""
            preventdefault:submit
            onSubmit$={handleSubmit}
          >
            <div class="mb-4 grid grid-cols-2 gap-4">
              <div class="col-span-2">
                <label
                  for="name"
                  class="mb-1 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  class="block w-full rounded-lg border border-none bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-none dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
                  placeholder="Type product name"
                  required={true}
                  disabled={loading.value}
                  value={formValue.name}
                  onChange$={(event: any) => {
                    if (!event.target) return;
                    formValue.name = event.target?.value;
                  }}
                />
              </div>
              <div class="col-span-2">
                <label
                  for="category"
                  class="mb-1 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Category
                </label>
                <select
                  id="category"
                  class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  value={formValue.categoryId}
                  onChange$={(event: any) => {
                    if (!event.target) return;
                    formValue.categoryId = event.target?.value;
                  }}
                >
                  <option selected={!formValue.categoryId} disabled>
                    Choose a category
                  </option>
                  {categories.value.map((category) => (
                    <option
                      key={category.id}
                      value={category.id}
                      class="text-white"
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div class="col-span-2 sm:col-span-1">
                <label
                  for="category"
                  class="mb-1 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Code
                </label>
                <input
                  type="text"
                  name="code"
                  id="code"
                  class="block w-full rounded-lg border border-none bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-none dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
                  placeholder="Type product code"
                  required={true}
                  value={formValue.code}
                  disabled={loading.value}
                  onChange$={(event: any) => {
                    if (!event.target) return;
                    formValue.code = event.target?.value;
                  }}
                />
              </div>
              <div class="col-span-2 sm:col-span-1">
                <label
                  for="price"
                  class="mb-1 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  id="price"
                  class="block w-full rounded-lg border border-none bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-none dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
                  placeholder="x1000 VND"
                  required={true}
                  value={formValue.price}
                  disabled={loading.value}
                  onChange$={(event: any) => {
                    if (!event.target) return;
                    formValue.price = event.target?.value;
                  }}
                />
              </div>
            </div>
            <button
              type="submit"
              class="inline-flex w-full items-center justify-center rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              {!loading.value ? (
                <>
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
                  {!data.value ? "Add" : "Edit"}
                </>
              ) : (
                <svg
                  aria-hidden="true"
                  class="h-5 w-5 animate-spin fill-blue-600 text-gray-200"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
});
