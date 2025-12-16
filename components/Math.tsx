
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useMemo } from 'react';
// @ts-ignore
import katex from 'katex';

interface LatexProps {
  children: string;
  className?: string;
  block?: boolean;
}

export const Latex: React.FC<LatexProps> = ({ children, className = '', block = false }) => {
  // useMemo allows synchronous rendering without useEffect flicker
  const { html, error } = useMemo(() => {
    try {
      // renderToString does not enforce document.compatMode checks, bypassing the "quirks mode" error
      // This is safe because we are using a stable version of KaTeX and passing trusted strings
      const rendered = katex.renderToString(children, {
        throwOnError: true,
        displayMode: block,
        strict: false,
        trust: true,
        output: 'html', 
      });
      return { html: rendered, error: false };
    } catch (err) {
      console.error(`[KaTeX Error] Failed to render string: "${children}"`, err);
      return { html: '', error: true };
    }
  }, [children, block]);

  if (error) {
    return (
      <span 
        className={`${className} ${block ? 'block my-2' : 'inline-block'}`}
        title={`Rendering failed: ${children}`}
        style={{ 
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            fontSize: '0.85em',
            color: '#78716c',
            borderBottom: '1px dashed #d6d3c9'
        }}
      >
        {children}
      </span>
    );
  }

  return (
    <span 
        className={`${className} ${block ? 'block my-2' : 'inline-block'}`}
        dangerouslySetInnerHTML={{ __html: html }} 
    />
  );
};
