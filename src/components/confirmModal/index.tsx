import { component$, type QRL } from "@builder.io/qwik";
import LoadingIndicator from "../loadingIndicator";

export default component$(
  ({
    handleConfirm,
    handleClose,
    loading,
  }: {
    handleConfirm: QRL<() => void>;
    handleClose: QRL<() => void>;
    loading?: boolean;
  }) => {
    return (
      <div class="fixed left-0 right-0 top-0 z-50 h-[100%] max-h-full w-full items-center justify-center overflow-y-auto overflow-x-hidden bg-gray-900 bg-opacity-70 backdrop-blur-sm md:inset-0">
        <div class="relative max-h-full w-full">
          <div class="relative rounded-lg bg-white shadow dark:bg-gray-700">
            <button
              type="button"
              class="absolute end-2.5 top-3 ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
              onClick$={handleClose}
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
            <div class="p-4 text-center md:p-5">
              {!loading ? (
                <svg
                  class="mx-auto mb-4 h-8 w-8 text-gray-400 dark:text-gray-200"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              ) : (
                <div class="mb-4 flex justify-center">
                  <LoadingIndicator />
                </div>
              )}
              <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Are you sure you want to do this?
              </h3>
              <button
                type="button"
                class="inline-flex items-center rounded-lg bg-red-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800"
                onClick$={handleConfirm}
                disabled={loading}
              >
                Yes, I'm sure
              </button>
              <button
                type="button"
                class="ms-3 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
                onClick$={handleClose}
                disabled={loading}
              >
                No, cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  },
);
