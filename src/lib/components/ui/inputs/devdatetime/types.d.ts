import type { HTMLInputAttributes } from "svelte/elements"

export type Props = Omit<HTMLInputAttributes, "value"> & {
  value?: string
  class?: string
}
