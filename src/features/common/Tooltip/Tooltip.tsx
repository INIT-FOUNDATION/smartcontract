import { Tooltip as ChainlinkToolTip } from "@chainlink/components"

export const Tooltip = ({ label, tip, imgURL, width = 12, height = 12 }) => {
  // setting default width and height
  const containerStyle = {
    display: "flex",
    alignItems: "center",
  }

  const textStyle = {
    marginRight: "0.25em", // using viewport width units for responsive margin
  }

  return (
    <div>
      <span style={containerStyle}>
        <span style={textStyle}>{label}</span>
        <ChainlinkToolTip tip={tip}>
          <img src={imgURL} width={width} height={height} alt="info" />
        </ChainlinkToolTip>
      </span>
    </div>
  )
}
