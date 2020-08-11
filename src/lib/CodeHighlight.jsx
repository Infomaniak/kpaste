import React, { Component } from 'react';
import PropTypes from 'prop-types';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

class CodeHighlight extends Component {
  constructor(props) {
    super(props);
    this.state = { loaded: false };
    this.codeNode = React.createRef();
  }

  componentDidMount() {
    this.setState(
      () => ({ loaded: true }),
      () => { this.highlight(); },
    );
  }

  componentDidUpdate() {
    this.highlight();
  }

  highlight = () => {
    const { code } = this.props;

    if (code && this.codeNode && this.codeNode.current) {
      hljs.highlightBlock(this.codeNode.current);
    }
  }

  render() {
    const { children } = this.props;
    const { loaded } = this.state;
    if (!loaded) return ''; // or show a loader

    return (
      <pre>
        <code ref={this.codeNode} className="font-medium">{children}</code>
      </pre>
    );
  }
}

CodeHighlight.propTypes = {
  children: PropTypes.node.isRequired,
  code: PropTypes.bool.isRequired,
};

export default CodeHighlight;
