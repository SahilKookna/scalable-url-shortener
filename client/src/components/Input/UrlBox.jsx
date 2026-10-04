import React, { useState } from 'react'
import './Input.scss'

function UrlBox({ class: className, result, link }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (link) {
      navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!result || result === 'url') {
    return null
  }

  return (
    <div className={`url-box-container ${className || ''}`}>
      <a href={link} className="url" target="_blank" rel="noreferrer">
        {link}
      </a>
      <button className="copy-btn" onClick={handleCopy}>
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  )
}

export default UrlBox
