import React, { useState } from 'react'
import UrlBox from './UrlBox'
import apis from '../../api/api'
import './Input.scss'

function Input() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState('url')
  const [link, setLink] = useState('')
  const [url, setUrl] = useState(null)
  const [loading, setLoading] = useState(false)

  const validateUrl = (value) => {
    return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
      value
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input.length > 0 && validateUrl(input)) {
      setLoading(true)
      apis
        .postURL(input)
        .then((res) => {
          const data = res.data
          setResult(data)
          setLink(`http://localhost:4000/url/${data}`)
          setUrl(true)
        })
        .catch((err) => {
          console.error('[Input] API error:', err)
          alert('Failed to generate short URL. Please ensure server is running.')
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setUrl(false)
      alert('Please enter a valid URL (e.g. https://example.com).')
      setResult('url')
    }
  }

  return (
    <div className="input-wrapper">
      <div className="container">
        <form className="input-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Paste your long URL here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="input-field"
          />
          <button type="submit" className="submit" disabled={loading}>
            {loading ? 'Shortening...' : 'Shorten'}
          </button>
        </form>

        {url === null ? (
          <UrlBox class="res" result={result} link={link} />
        ) : (
          <UrlBox class={url ? 'res-true' : 'res-false'} result={result} link={link} />
        )}
      </div>
    </div>
  )
}

export default Input
