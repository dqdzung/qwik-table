import { component$, Slot, type QRL } from "@builder.io/qwik";

export default component$(
  ({
    title,
    handleDelete,
  }: {
    title?: string;
    handleDelete?: QRL<() => void>;
  }) => {
    return (
      <div class="relative min-h-[150px] max-w-sm rounded-lg border border-gray-200 bg-white p-4 shadow dark:border-gray-700 dark:bg-gray-800">
        {title && (
          <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {title}
          </h5>
        )}
        <div class="flex h-full items-center justify-center">
          <Slot />
        </div>

        {handleDelete && (
          <button
            type="button"
            class="hover:text-red font-mediumfocus:outline-none me-2 inline-flex items-center text-center text-sm"
            onClick$={handleDelete}
          >
            <svg
              class="absolute right-2 top-2 h-6 w-6 text-white hover:text-red-600"
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
        )}
      </div>
    );
  },
);
