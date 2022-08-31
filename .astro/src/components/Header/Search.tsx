/* jsxImportSource: react */
import { useState, useCallback, useRef } from "react"
import * as CONFIG from "../../config"
import "@docsearch/css/dist/style.css"
import "./Search.css"

// @ts-ignore
import * as docSearchReact from "@docsearch/react"
// @ts-ignore
import { createPortal } from "react-dom"

export default function Search() {
  const DocSearchModal =
    docSearchReact.DocSearchModal || docSearchReact.default.DocSearchModal

  const useDocSearchKeyboardEvents =
    docSearchReact.useDocSearchKeyboardEvents ||
    docSearchReact.default.useDocSearchKeyboardEvents

  const [isOpen, setIsOpen] = useState(false)
  const searchButtonRef = useRef()
  const [initialQuery, setInitialQuery] = useState(null)

  const onOpen = useCallback(() => {
    setIsOpen(true)
  }, [setIsOpen])

  const onClose = useCallback(() => {
    setIsOpen(false)
  }, [setIsOpen])

  const onInput = useCallback(
    (e) => {
      setIsOpen(true)
      setInitialQuery(e.key)
    },
    [setIsOpen, setInitialQuery]
  )

  useDocSearchKeyboardEvents({
    isOpen,
    onOpen,
    onClose,
    onInput,
    searchButtonRef,
  })

  return (
    <>
      <button
        type="button"
        ref={searchButtonRef}
        onClick={onOpen}
        className="search-input"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <g>
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M12 23.25C18.2132 23.25 23.25 18.2132 23.25 12C23.25 5.7868 18.2132 0.75 12 0.75C5.7868 0.75 0.75 5.7868 0.75 12C0.75 18.2132 5.7868 23.25 12 23.25Z"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M11.125 15.5C13.5412 15.5 15.5 13.5412 15.5 11.125C15.5 8.70875 13.5412 6.75 11.125 6.75C8.70875 6.75 6.75 8.70875 6.75 11.125C6.75 13.5412 8.70875 15.5 11.125 15.5Z"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M14.219 14.218L17.25 17.25"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </g>
          <defs>
            <clipPath id="clip0_514_6208">
              <rect width="24" height="24" fill="white" />
            </clipPath>
          </defs>
        </svg>

        <span>Search</span>

        <span className="search-hint">
          <span className="sr-only">Press </span>

          <kbd>/</kbd>

          <span className="sr-only"> to search</span>
        </span>
      </button>

      {isOpen &&
        createPortal(
          <DocSearchModal
            initialQuery={initialQuery}
            initialScrollY={window.scrollY}
            onClose={onClose}
            indexName={(CONFIG as any).ALGOLIA.indexName}
            appId={(CONFIG as any).ALGOLIA.appId}
            apiKey={(CONFIG as any).ALGOLIA.apiKey}
            transformItems={(items) => {
              return items.map((item) => {
                // We transform the absolute URL into a relative URL to
                // work better on localhost, preview URLS.
                const a = document.createElement("a")
                a.href = item.url
                const hash = a.hash === "#overview" ? "" : a.hash
                return {
                  ...item,
                  url: `${a.pathname}${hash}`,
                }
              })
            }}
          />,
          document.body
        )}
    </>
  )
}
