import { defineStore } from 'pinia'
import { useDark, useToggle } from '@vueuse/core'

export const useThemeStore = defineStore('theme', () => {
  const isDark = useDark({
    storageKey: 'vueuse-color-scheme',
    selector: 'html',
    attribute: 'class',
    valueDark: 'dark',
    valueLight: '', // Remove class for light mode
  })

  const toggleTheme = useToggle(isDark)

  return { isDark, toggleTheme }
})
