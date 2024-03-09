import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const abbrAddress = (address: string) => address.substring(0, 7) + '...' + address.substring(address.length - 5)

export const numberFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 3,
  maximumFractionDigits: 3
})

export const getRandomInt = (max: number) => Math.floor(Math.random() * max)