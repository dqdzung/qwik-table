import { component$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";

export default component$(() => {
  const location = useLocation();

  const getActiveStyle = (key: string) => {
    return location.url.pathname.includes(key);
  };

  return (
    <nav class="fixed start-0 top-0 z-20 w-full bg-white dark:border-gray-600 dark:bg-gray-800">
      <div class="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
        <a href="/" class="flex items-center space-x-3 rtl:space-x-reverse">
          <span class="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
            Table
          </span>
        </a>
        <div class="flex space-x-3 rtl:space-x-reverse md:space-x-0">
          <button
            data-collapse-toggle="navbar-sticky"
            type="button"
            class="inline-flex h-10 w-10 items-center justify-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 md:hidden"
            aria-controls="navbar-sticky"
            aria-expanded="false"
          >
            <span class="sr-only">Open main menu</span>
            <svg
              class="h-5 w-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>
        <div
          class="hidden w-full items-center justify-between md:flex md:w-auto"
          id="navbar-sticky"
        >
          <ul class="mt-4 flex flex-col rounded-lg border border-gray-100 bg-gray-50 p-4 font-medium rtl:space-x-reverse dark:border-gray-700 dark:bg-gray-900 md:mt-0 md:flex-row md:space-x-8 md:border-0 md:p-0 md:dark:bg-inherit">
            {navItems.map((item) => (
              <li key={item}>
                <a
                  href={`/${item}`}
                  class={`capitalize md:bg-transparent ${getActiveStyle(item) ? "bg-blue-700" : ""} block rounded px-3 py-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:bg-transparent md:dark:hover:text-blue-500`}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
});

const navItems = ["records", "items", "about"];
