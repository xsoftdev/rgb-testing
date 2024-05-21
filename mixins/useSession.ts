import { onMounted, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";

export function useSession() {
  const router = useRouter();
  const route = useRoute();

  onMounted(async () => {
    const session = localStorage.getItem("session");

    await nextTick();

    if (!session) {
      router.push("/auth/create");
    } else {
      await fetch("/api/users/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ session }),
      }).then(async (res) => {
        const data = await res.json();
        if (data.status === 200) {
          localStorage.setItem("session", data.message.session);
          if (!route.path.startsWith("/dashboard")) {
            router.push("/dashboard");
          }
        } else {
          router.push("/auth/login");
        }
      });
    }
  });
}