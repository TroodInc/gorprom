import React from 'react'


const CustomSvg = ({
  svgNodes,
  svgViewBox = [512, 512],
  ...other
}) => {
  return (
    <svg viewBox={`0 0 ${svgViewBox[0]} ${svgViewBox[1] || svgViewBox[0]}`} {...other}>
      {svgNodes}
    </svg>
  )
}

export default CustomSvg
