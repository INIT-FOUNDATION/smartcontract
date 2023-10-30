import { useState, useCallback } from "react"
import "./Search.css"

import { SearchModal } from "~/components/Header/AlgoSearch/SearchModal"

export function SearchCTA() {
  const [isOpen, setIsOpen] = useState(false)

  const onOpen = useCallback(() => {
    setIsOpen(true)
  }, [setIsOpen])

  const onClose = useCallback(() => {
    setIsOpen(false)
  }, [setIsOpen])

  return (
    <>
      <button type="button" onClick={onOpen} className="search-cta-input">
        <img src="/assets/search.svg" alt="search" aria-label="Search" width={16} height={16} />

        <span style={{ fontSize: "1rem" }}>Search Chainlink Documentation...</span>
      </button>
      <SearchModal showModal={isOpen} onClose={() => onClose()} />
    </>
  )
}
