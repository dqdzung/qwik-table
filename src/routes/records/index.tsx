import { component$, useSignal, useTask$ } from "@builder.io/qwik";
import Card from "~/components/card";
import { supabase } from "~/lib/db";
import type { DocumentHead } from "@builder.io/qwik-city";
import type { Table } from "~/types/table";
import { YESTERDAY } from "~/lib/helper";

const fetchTables = async () => {
  const { data: tables } = await supabase
    .from("tables")
    .select("id, code, date")
    .eq("date", YESTERDAY.format("YYYY/MM/DD"));
  return tables || [];
};

export default component$(() => {
  const tables = useSignal<Table[]>([]);

  useTask$(async () => {
    const res = await fetchTables();
    tables.value = res;
  });

  return (
    <div class="flex flex-col gap-4">
      <h1 class="p-0">Yesterday - {YESTERDAY.format("DD/MM/YYYY")}</h1>
      <div class="grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {tables.value.map(({ id, code }) => (
          <Card key={id}>
            <a href={`/tables/${code}`}>{code}</a>
          </Card>
        ))}
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Records",
  meta: [
    {
      name: "Records page",
      content: "Records page description",
    },
  ],
};
