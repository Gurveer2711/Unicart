import React, { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught in ErrorBoundary:", error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen text-center p-4">
          <h1 className="text-3xl font-semibold text-red-600 mb-4">
            Oops! Something went wrong.
          </h1>
          <p className="text-gray-700 mb-4">
            We encountered an unexpected error. Please try refreshing the page.
          </p>
          <button
            onClick={this.handleReload}
            className="bg-[#f46530] text-white px-6 py-2 rounded-lg hover:bg-[#dc6438] transition"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
