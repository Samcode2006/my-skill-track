import React from "react";

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { error: null, info: null };
    }

    componentDidCatch(error, info) {
        this.setState({ error, info });
        // also log to console
        console.error("ErrorBoundary caught:", error, info);
    }

    render() {
        if (this.state.error) {
            return (
                <div style={{ padding: 24 }}>
                    <h2 style={{ color: 'var(--danger)' }}>Something went wrong</h2>
                    <pre style={{ whiteSpace: 'pre-wrap', color: '#f8f8f8', background: 'rgba(255,255,255,0.03)', padding: 12, borderRadius: 8 }}>
                        {String(this.state.error)}
                        {this.state.info && this.state.info.componentStack}
                    </pre>
                </div>
            );
        }
        return this.props.children;
    }
}
