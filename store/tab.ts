import { ref } from 'vue'

export const useTabStore = () => {

  const active = ref('Active Projects');
  const changeTab = (value: string) => {
    active.value = value;
  }

  return {
    active,
    changeTab
  }
}