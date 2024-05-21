<script setup lang="ts">
import { Trash } from "lucide-vue-next";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

definePageMeta({
  layout: "dashboard",
});

import { useSession } from '~/mixins/useSession';
useSession();
</script>

<template>
  <div class="flex min-h-screen w-full flex-col bg-muted/40">
    <div class="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
      <CommonMobileHeader />
      <main
        class="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3"
      >
        <div
          class="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-4"
        >
          <div
            class="sm:grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4"
          >
            <CommonDraganddrop class="col-span-4"/>
          </div>

          <Card>
            <CardHeader class="px-7">
              <CardTitle>My files</CardTitle>
              <CardDescription> Uploaded files </CardDescription>
            </CardHeader>
            <CardContent>
              <CommonFilesTable />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  </div>
</template>
