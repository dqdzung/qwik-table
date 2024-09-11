import type { Signal } from "@builder.io/qwik";
import {
  $,
  component$,
  useSignal,
  useTask$,
  useVisibleTask$,
} from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";
import Card from "~/components/card";
import ConfirmModal from "~/components/confirmModal";
import LoadingIndicator from "~/components/loadingIndicator";
import { supabase } from "~/lib/db";
import { TODAY } from "~/lib/helper";
import type { Table } from "~/types/table";

const fetchTables = async (loading?: Signal<boolean>) => {
  if (loading) {
    loading.value = true;
  }
  const { data: tables } = await supabase
    .from("tables")
    .select("id, code, date")
    .eq("date", TODAY.format("YYYY/MM/DD"));
  if (loading) {
    loading.value = false;
  }
  return tables || [];
};

export default component$(() => {
  const tables = useSignal<Table[]>([]);
  const loading = useSignal<boolean>(false);
  const deleting = useSignal<boolean>(false);
  const deleteCode = useSignal<number>(0);

  const handleAdd = $(async () => {
    let id = genId();
    while (tables.value.map((t) => t.code).includes(id)) {
      id = genId();
    }
    const newTable = {
      code: id,
      date: TODAY.format("YYYY/MM/DD"),
    };

    await supabase.from("tables").insert(newTable);
  });

  const handleDelete = $(async () => {
    if (deleteCode.value === 0) return;
    deleting.value = true;
    await supabase.from("tables").delete().eq("code", deleteCode.value);
    deleteCode.value = 0;
    deleting.value = false;
  });

  useTask$(async () => {
    const res = await fetchTables(loading);
    tables.value = res;
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
          table: "tables",
        },
        async (payload) => {
          let signal;
          if (payload.eventType !== "DELETE") {
            signal = loading;
          }
          const res = await fetchTables(signal);
          tables.value = res;
        },
      )
      .subscribe();
    cleanup(() => {
      supabase.removeChannel(channel);
    });
  });

  return (
    <div class="flex flex-col gap-4">
      <h1>Today - {TODAY.format("DD/MM/YYYY")}</h1>
      <div class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        <Card>
          <button
            type="button"
            class="me-2 inline-flex items-center rounded-full bg-blue-700 p-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none dark:bg-blue-600 dark:hover:bg-blue-700"
            onClick$={handleAdd}
          >
            <svg
              class="h-6 w-6 text-gray-800 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 12h14m-7 7V5"
              />
            </svg>
            <span class="sr-only">Icon description</span>
          </button>
        </Card>
        {tables.value.map(({ id, code }) => (
          <Card
            key={id}
            handleDelete={$(() => {
              deleteCode.value = code;
            })}
          >
            <a href={`/table/${code}`}>{code}</a>
          </Card>
        ))}

        {loading.value && (
          <Card>
            <LoadingIndicator />
          </Card>
        )}
      </div>

      {deleteCode.value > 0 && (
        <ConfirmModal
          handleConfirm={handleDelete}
          handleClose={$(() => {
            deleteCode.value = 0;
          })}
          loading={deleting.value}
        />
      )}
    </div>
  );
});

export const head: DocumentHead = {
  title: "Home",
  meta: [
    {
      name: "Home page",
      content: "Home page description",
    },
  ],
};

const genId = () => Math.floor(1000 + Math.random() * 9000);
