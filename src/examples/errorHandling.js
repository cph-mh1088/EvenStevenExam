import React, { useState, useEffect } from "react";

const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // The effect runs when an error occurs in any child component
    const handleError = (error, info) => {
      console.error("Error caught by error boundary:", error, info);
      setHasError(true);
    };

    // tilslut window's error event
    // browseren skal lytte efter fejl, og hvis der er en fejl, så skal den køre handleError funktionen
    window.addEventListener("error", handleError);

    return () => {
      window.removeEventListener("error", handleError);
    };
  }, []);

  if (hasError) {
    return <h1>Something went wrong.</h1>;
  }

  return children;
};

const MyComponent = () => {
  // Wrap JSX
  return (
    <ErrorBoundary>
      {/* The rest of the component tree goes here */}
    </ErrorBoundary>
  );
};
