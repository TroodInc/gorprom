/* eslint-disable max-len */
import React from 'react'


const Draggable = () => (
  <svg viewBox="0 0 16 14" >
    <defs>
      <path id="a" d="M0 4h12v10H0z" />
      <path id="b" d="M4 0h12v10H4z" />
    </defs>
    <g fill="none" fillRule="evenodd">
      <use fill="#FFFFFF" />
      <path stroke="#999999" d="M.5 4.5h11v9H.5z" />
      <use fill="#FFFFFF" />
      <path stroke="#999999" d="M4.5.5h11v9h-11z" />
    </g>
  </svg >
)

export default Draggable
