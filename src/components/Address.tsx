/** @jsxImportSource preact */
import { clsx } from "../lib" // Ensure that the `clsx` function is correctly imported or implemented.

export type Props = {
  contractUrl: string
  address?: string
  endLength?: number
  urlClass?: string
  urlId?: string
}

const AddressComponent = ({ contractUrl, address, endLength, urlClass, urlId }: Props) => {
  address = address || contractUrl.split("/").pop()

  return (
    <div className={`addressContainer ${urlClass || ""}`} id={urlId}>
      <a title={address} className="addressLink" href={contractUrl}>
        {endLength ? address.slice(0, endLength + 2) + "..." + address.slice(-endLength) : address}
      </a>
      <button
        className={clsx("copyBtn", "copy-iconbutton")}
        style={{ height: "16px", width: "16px" }}
        data-clipboard-text={address}
      >
        <img src="/assets/icons/copyIcon.svg" alt="Copy to clipboard" />
      </button>

      <style jsx>{`
        .addressContainer {
          white-space: nowrap;
        }

        .addressLink {
          background: var(--color-background-secondary);
          padding: 1px 5px;
          border-radius: var(--border-radius-10);
        }

        .copyBtn {
          background: none;
          border: none;
        }

        .copyBtn:hover {
          color: var(--color-text-link);
        }
      `}</style>
    </div>
  )
}

export default AddressComponent
