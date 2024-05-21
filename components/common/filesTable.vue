<script setup lang="ts">
const rows = ref([]);

const loading = ref(true);
const currentPage = ref(1);
const totalPages = ref(null);

import { Upload, UserCircle, Database } from "lucide-vue-next";

const loadFiles = async () => {
    session = localStorage.getItem("session");

    await fetch("/api/users/pagination", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        page: currentPage.value,
        session: session,
      }),
    }).then((res) => {
      res.json().then((data) => {
        loading.value = false;
        if (data.message.files) {
          rows.value = data.message.files;
        }
        totalPages.value = data.message.totalPages;
      });
    });
  };
let session: string | null;
onMounted(async () => {
  await nextTick();

  loadFiles();
});
const deleteItem = async (itemid: string) => {
  await fetch(`/api/file/${itemid}`).then((res) => {
    res.json().then((data) => {
      console.log(data);
    });
  });
};
import { Toggle } from "@/components/ui/toggle";
</script>

<template>
  <div class="flex flex-col">
    <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
        <div
          class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg relative"
        >
          <template v-if="loading">
            <div class="c-position">
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
                class="lucide lucide-loader-circle w-20 h-20 animate-spin"
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            </div>
          </template>
          <template v-else>
            <table
              class="min-w-full divide-y divide-gray-200 "
            >
              <thead class="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    File name
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:block hidden"
                  >
                    Page count
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:block hidden"
                  >
                    File size
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:block hidden"
                  >
                    File format
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200 relative">
                <template v-if="rows.length != 0">
                  <template v-for="(item, idx) in rows" :key="idx">
                    <tr>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900">
                          {{ item.fileName }}
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap sm:block hidden">
                        <div class="text-sm text-gray-500">
                          {{ item.countPages }}
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap sm:block hidden">
                        <span
                          class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
                        >
                          {{ (item.fileSizeBytes / 1024).toFixed(2) }}kb
                        </span>
                      </td>
                      <td
                        class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 uppercase sm:block hidden"
                      >
                        {{ item.fileFormat }}
                      </td>
                      <td
                        class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                      >
                        <a :href="`/api/users/${session}`" target="_blank">
                          <Toggle aria-label="Toggle italic py-2">
                            <UserCircle />
                          </Toggle>
                        </a>
                        <a :href="item.url">
                          <Toggle aria-label="Toggle italic py-2">
                            <Upload />
                          </Toggle>
                        </a>
                      </td>
                    </tr>
                  </template>
                </template>
                <template v-else>
                  <div class="empty flex flex-row">
                    <Database class="w-16" />
                    <p class="font-bold">Database is empty</p>
                  </div>
                </template>
              </tbody>
            </table>
            <div class="flex justify-end mr-8 space-x-3 mb-4">
              <template v-for="id in totalPages" :key="id">
                <div class="py-2 px-4 rounded-xl cursor-pointer bg-gray-300/40" @click="currentPage = id, loadFiles()">
                  {{ id }}
                </div>
              </template>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
.empty {
  position: absolute;
  top: 50%;
  left: 45.7%;
  transform: translate(-50%, -50%);
}
</style>
