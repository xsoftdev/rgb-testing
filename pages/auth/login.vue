<script lang="ts" setup>
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { useToast } from "@/components/ui/toast/use-toast";
import {useRouter} from 'vue-router';

const { toast } = useToast();
const router = useRouter();

definePageMeta({
  layout: "authentificate",
});

interface Error {
  message?: string;
  status?: boolean;
}

const email = ref<string | number | undefined>("");
const pass = ref<string | number | undefined>("");
const error = ref<Error>({
  message: "",
  status: false,
});

const loginAccount = async () => {
  if (!email.value || !pass.value) {
    error.value = {
      message: "Email and password are required",
      status: true,
    };
    return;
  }
  if (!String(email.value).includes("@")) {
    error.value = {
      message: "Type a correct email",
      status: true,
    };
    return;
  }
  try {
    await fetch("/api/users/login", {
      method: "POST",
      body: JSON.stringify({
        email: email.value,
        password: pass.value,
      }),
    }).then((res) => {
      console.log(
        res.json().then((data) => {
          let response = data.message;
          if (data.status === 200) {
            localStorage.removeItem('session');
            localStorage.setItem("session", response.session);
            router.push('/dashboard')
          } else {
            return;
          }
        })
      );
    });
  } catch (error) {
    console.error("An error occurred:", error);
  }
};
watch(error, (newValue, oldValue) => {
  toast({
    description: error.value.message,
  });
});
</script>

<template>
  <div class="relative h-dvh backdrop-filter backdrop-blur-2xl">
    <div
      class="h-dvh text-white flex flex-col justify-center items-center space-y-6 relative z-20 lg:px-0 px-4"
    >
      <ParticlesLogo />

      <Card class="mx-auto max-w-sm w-full">
        <CardHeader>
          <CardTitle class="text-xl"> Sign In </CardTitle>
          <CardDescription> Enter your information to sign in </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="grid gap-4">
            <div class="grid gap-2">
              <Label for="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                v-model="email"
              />
            </div>
            <div class="grid gap-2">
              <Label for="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Type your password"
                v-model="pass"
              />
            </div>
            <Button class="w-full" @click="loginAccount()"> Sign in </Button>
            <Button variant="outline" class="w-full" :disabled="true">
              Sign in with GitHub
            </Button>
          </div>
          <div class="mt-4 text-center text-sm">
            Don't you have an account?
            <NuxtLink to="/auth/create" class="underline"> Sign up </NuxtLink>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<style>
@import "cropperjs/dist/cropper.css";

.cropper-container {
  position: relative;
}

.cropper-container .cropper-view-box,
.cropper-container .cropper-face {
  border-radius: 50%;
}

img.rounded-full {
  border-radius: 50%;
}
</style>
