import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  return <div>About</div>;
});

export const head: DocumentHead = {
  title: "About",
  meta: [
    {
      name: "About page",
      content: "About page description",
    },
  ],
};
