"use client"; // Error boundaries must be Client Components

import React from "react";

type ErrorProps = {
  error: Error & {digest?: string};
  reset: () => void;
};

function Error(props: ErrorProps) {
  React.useEffect(() => {
    // Log the error to an error reporting service
    console.error(props.error);
  }, [props.error]);

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button
        // Attempt to recover by trying to re-render the segment
        onClick={() => props.reset()}
      >
        Try again
      </button>
    </div>
  );
}

export default Error;
