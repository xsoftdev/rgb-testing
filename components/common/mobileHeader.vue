<script setup lang="ts">
import { FilePenLine, Package, PanelLeft } from "lucide-vue-next";
import Cropper from "vue-cropperjs";
import "cropperjs/dist/cropper.css";
import { Button } from "@/components/ui/button";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
const cropperRef = ref<any | null>(null);
const croppedImage = ref<string | null>(null);
const imageData = ref<any>(null);
const isImageSelected = ref(false);
const password = ref("");
const newpassword = ref("");
const onFileChange = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imageData.value = e.target?.result;
      isImageSelected.value = true;
    };
    reader.readAsDataURL(file);
  }
};

const cropImage = () => {
  if (cropperRef.value) {
    croppedImage.value = cropperRef.value
      .getCroppedCanvas({
        width: 200,
        height: 200,
      })
      .toDataURL();
    imageData.value = null;
  }
};

const cancelCrop = () => {
  imageData.value = null;
  isImageSelected.value = false;
  croppedImage.value = null;
};
const removeImage = () => {
  imageData.value = null;
  isImageSelected.value = false;
  croppedImage.value = null;
};
const userData = ref();
let session;

const loadUserData = async () => {
  session = localStorage.getItem("session");

  await fetch(`/api/users/${session}`).then((res) => {
    res.json().then((data) => {
      userData.value = data.message;
    });
  });
};
const savePassword = async () => {
  session = localStorage.getItem("session");

  await fetch("/api/users/passChange", {
    method: "POST",
    body: JSON.stringify({
      password: password.value,
      newpassword: newpassword.value,
      session,
    }),
  }).then((res) => {
    res.json().then((data) => {
      if (data.status === 200) {
        localStorage.removeItem("session");
        location.reload();
      }
    });
  });
};
const savePhoto = async () => {
  session = localStorage.getItem("session");

  await fetch("/api/users/imgChange", {
    method: "POST",
    body: JSON.stringify({
      avatar: croppedImage.value,
      session: session,
    }),
  }).then((res) => {
    res.json().then((data) => {
      console.log(data);
    });
  });
};
onMounted(async () => {
  await nextTick();

  loadUserData();
});
</script>
<template>
  <header
    class="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6"
  >
    <Sheet>
      <SheetTrigger as-child>
        <Button size="icon" variant="outline" class="sm:hidden">
          <PanelLeft class="h-5 w-5" />
          <span class="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" class="sm:max-w-xs">
        <nav class="text-lg font-medium h-full">
          <NuxtLink to="/" class="flex flex-row items-center mb-2">
            <ParticlesLogo class="text-black" />
          </NuxtLink>
          <div class="h-full flex flex-col justify-between pb-16">
            <NuxtLink
              to="/dashboard/my_files"
              href="#"
              class="flex items-center gap-4 text-muted-foreground hover:text-foreground lg:text-lg text-md pt-4"
            >
              <Package class="h-5 w-5" />
              My files
            </NuxtLink>
            <template v-if="userData">
              <div class="flex flex-col space-y-4 max-w-[320px]">
                <div class="flex flex-row items-center">
                  <div class="mr-2">
                    <img
                      :src="userData.avatar"
                      class="rounded-full sm:max-w-16 max-w-12"
                    />
                  </div>
                  <div class="flex flex-col space-y-1">
                    <p class="underline font-bold sm:text-lg text-sm">
                      {{ userData.email }}
                    </p>
                    <p class="sm:text-lg text-sm">
                      Count files: {{ userData.files.length }}
                    </p>
                  </div>
                </div>
                <div>
                  <Dialog>
                    <DialogTrigger as-child>
                      <Button variant="outline" class="w-full">
                        Edit Profile
                      </Button>
                    </DialogTrigger>
                    <DialogContent class="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Edit profile</DialogTitle>
                        <DialogDescription>
                          Make changes to your profile here. Click save when
                          you're done.
                        </DialogDescription>
                      </DialogHeader>
                      <Tabs default-value="photo" class="w-full">
                        <TabsList>
                          <TabsTrigger value="photo">Photo</TabsTrigger>
                          <TabsTrigger value="password"> Password </TabsTrigger>
                        </TabsList>
                        <TabsContent value="photo">
                          <div
                            class="grid w-full max-w-sm items-center gap-2 py-4"
                          >
                            <Label for="picture">{{
                              !croppedImage ? "Your image" : "Your profile"
                            }}</Label>
                            <Input
                              v-if="!isImageSelected"
                              id="picture"
                              type="file"
                              @change="onFileChange"
                            />
                            <div v-if="imageData" class="cropper-container">
                              <cropper
                                ref="cropperRef"
                                :src="imageData"
                                :aspect-ratio="1"
                                guides
                                class="rounded-full w-full"
                              />

                              <div
                                class="cropper-buttons w-full space-x-2 flex flex-row pt-2"
                              >
                                <Button @click="cropImage" class="w-full"
                                  >Apply image</Button
                                >
                                <Button @click="cancelCrop" class="w-full"
                                  >Cancel</Button
                                >
                              </div>
                            </div>
                            <template v-if="croppedImage">
                              <div
                                class="flex flex-row items-start pt-2 relative"
                              >
                                <NuxtImg
                                  :src="croppedImage"
                                  class="max-w-[60px] rounded-full mr-4"
                                />
                                <div class="data flex flex-col">
                                  <p class="underline">
                                    {{
                                      !userData.email
                                        ? "m@example.com"
                                        : userData.email
                                    }}
                                  </p>
                                </div>
                                <Toggle
                                  @click="removeImage"
                                  class="absolute bottom-0 right-0"
                                >
                                  <FilePenLine class="w-6 h-6" />
                                </Toggle>
                              </div>
                            </template>
                          </div>
                          <Button
                            type="submit"
                            class="mx-auto"
                            @click="savePhoto()"
                          >
                            Save photo
                          </Button>
                        </TabsContent>
                        <TabsContent value="password">
                          <div class="flex flex-col space-y-4 py-4">
                            <div class="grid gap-2">
                              <Label for="password">Your password</Label>
                              <Input
                                id="password"
                                type="password"
                                placeholder="Type your password"
                                v-model="password"
                              />
                            </div>
                            <div class="grid gap-2">
                              <Label for="password">New password</Label>
                              <Input
                                id="new_password"
                                type="password"
                                placeholder="New password"
                                v-model="newpassword"
                              />
                            </div>
                          </div>
                          <Button
                            type="submit"
                            class="mx-auto"
                            @click="savePassword()"
                          >
                            Save password
                          </Button>
                        </TabsContent>
                      </Tabs>
                      <DialogFooter> </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </template>
            <template v-else>Loading data...</template>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
    <Breadcrumb class="hidden md:flex">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink as-child>
            <NuxtLink to="/dashboard">Dashboard</NuxtLink>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink as-child>
            <NuxtLink to="/dashboard/my_files">My files</NuxtLink>
          </BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  </header>
</template>

<style></style>
