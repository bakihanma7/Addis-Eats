import { useEffect, useState } from 'react';

export function useFetch(fetcher, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null });

  useEffect(() => {
    let active = true;
    setState((prev) => ({ ...prev, loading: true, error: null }));

    fetcher()
      .then((data) => {
        if (active) setState({ data, loading: false, error: null });
      })
      .catch((err) => {
        if (active) {
          setState({
            data: null,
            loading: false,
            error: err?.message || 'Something went wrong. Please try again.',
          });
        }
      });

    return () => {
      active = false;
    };
  }, deps);

  return state;
}

export default useFetch;
