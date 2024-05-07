import React, { useEffect, useRef, useState } from 'react';
import hljs from 'highlight.js/lib/common';
import 'highlight.js/styles/github.css';

interface CodeHighlightProps {
  children: React.ReactNode;
  code: boolean;
}

const CodeHighlight: React.FC<CodeHighlightProps> = ({ children, code }) => {
  const [loaded, setLoaded] = useState(false);
  const codeNode = useRef<HTMLElement>(null);

  useEffect(() => {
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (code && codeNode && codeNode.current) {
      hljs.highlightBlock(codeNode.current);
    }
  }, [code, loaded]);

  if (!loaded) return null; 

  return (
    <pre>
      <code ref={codeNode} className="font-medium">{children}</code>
    </pre>
  );
};

export default CodeHighlight;