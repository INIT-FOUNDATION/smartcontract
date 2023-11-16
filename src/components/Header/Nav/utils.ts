export const IMGIX_URL = "https://smartcontract.imgix.net"

type DPR = 1 | 2 | 3 | 4 | 5

type SearchParams = {
  border?: string
  "border-radius"?: number
  txt?: string
  w?: number
  h?: number
  dpr?: DPR
  bg?: string
  auto?: string
  pad?: number
  txt64?: string
  "txt-font"?: string
  "txt-color"?: string
  "txt-align"?: string
  "txt-size"?: string
  "txt-fit"?: string
  fit?: "fillmax"
  fill?: "solid"
  trim?: string
}

export function buildUrl(baseUrl: string, params: SearchParams = {}) {
  const url = new URL(baseUrl)

  Object.entries(params).forEach(([key, val]) => {
    if (val) {
      url.searchParams.set(key, val.toString())
    }
  })

  return url.toString()
}

export function getImageUrl(imagePath: string, params?: SearchParams) {
  return buildUrl(`${IMGIX_URL}${imagePath}`, {
    auto: "compress,format",
    ...params,
  })
}

export function getIconUrl(iconName: string) {
  return getImageUrl(`/icons/${iconName}.svg`)
}

/**
 * This is a copy from "shared" library.
 * A tiny utility for constructing className strings conditionally.
 * https://github.com/lukeed/clsx/blob/master/src/index.js
 */

type ClassValue = ClassValue[] | Record<string, boolean> | string | number | null | boolean | undefined

function toVal(mix: ClassValue) {
  let k
  let y
  let str = ""

  if (typeof mix === "string" || typeof mix === "number") {
    str += mix
  } else if (typeof mix === "object") {
    if (Array.isArray(mix)) {
      for (k = 0; k < mix.length; k++) {
        if (mix[k]) {
          if ((y = toVal(mix[k]))) {
            str && (str += " ")
            str += y
          }
        }
      }
    } else {
      for (k in mix) {
        if (mix && mix[k]) {
          str && (str += " ")
          str += k
        }
      }
    }
  }

  return str
}

export function clsx(...classes: ClassValue[]) {
  let i = 0
  let tmp
  let x
  let str = ""

  while (i < classes.length) {
    if ((tmp = classes[i++])) {
      if ((x = toVal(tmp))) {
        str && (str += " ")
        str += x
      }
    }
  }
  return str
}
