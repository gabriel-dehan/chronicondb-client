import React, { FunctionComponent } from 'react';

import './Footer.scss';

const Footer: FunctionComponent = () => {
  return (
    <footer className="o-footer">
      <span className="o-footer-item made-with">
        Made with&nbsp;&nbsp;❤️
      </span>
      <span className="o-footer__separator">|</span>
      <span className="o-footer-item issues">
        Noticed an <strong>issue?</strong> Tell me all about it&nbsp;
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/gabriel-dehan/chronicondb-client/issues"
        >
          here.
        </a>
      </span>
      <span className="o-footer__separator">|</span>
      <span className="o-footer-item source-code">
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/gabriel-dehan/chronicondb-client"
        >
          Source code
        </a>
      </span>
    </footer>
  );
};

export default Footer;
