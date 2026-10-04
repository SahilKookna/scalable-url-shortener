import React from 'react'
import './Footer.scss'
import github from '../../assets/images/github.png'
import linkedin from '../../assets/images/linkedin.png'

function Footer() {
  return (
    <footer className="footer">
      <div className="item">
        <p>Built with ❤️ by <strong>Sahil Kookna</strong></p>
      </div>
      <div className="socials">
        <a href="https://github.com/SahilKookna" target="_blank" rel="noreferrer" title="GitHub Profile">
          <img src={github} className="github" alt="GitHub" />
        </a>
        <a
          href="https://github.com/SahilKookna"
          target="_blank"
          rel="noreferrer"
          title="LinkedIn Profile"
        >
          <img src={linkedin} className="linkedin" alt="LinkedIn" />
        </a>
      </div>
    </footer>
  )
}

export default Footer
