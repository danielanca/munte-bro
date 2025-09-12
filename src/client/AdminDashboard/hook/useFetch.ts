import { useEffect, useReducer, useRef } from "react";

interface State<T> {
  data?: T;
  error?: Error;
  status: string;
}

type Cache<T> = { [url: string]: T };

type Action<T> =
  | { type: "loading" }
  | { type: "fetched"; payload: T }
  | { type: "error"; payload: Error };

function useFetch<T = unknown>(url?: string, options?: RequestInit): State<T> {
  const cache = useRef<Cache<T>>({});
  const cancelRequest = useRef<boolean>(false);

  const initialState: State<T> = {
    data: undefined,
    error: undefined,
    status: "idle",
  };

  const fetchReducer = (state: State<T>, action: Action<T>): State<T> => {
    switch (action.type) {
      case "loading":
        return { ...state, status: "loading" };
      case "fetched":
        return { ...state, data: action.payload, status: "fetched" };
      case "error":
        return { ...state, error: action.payload, status: "error" };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(fetchReducer, initialState);

  useEffect(() => {
    if (!url) return;

    const fetchData = async () => {
      dispatch({ type: "loading" });
      console.log("Loading data from URL:", url);

      if (cache.current[url]) {
        console.log("Using cached data for URL:", url);
        dispatch({ type: "fetched", payload: cache.current[url] });
        return;
      }

      try {
        const response = await fetch(url, options);
        console.log("Received response:", response);

        if (!response.ok) {
          console.error("Response not OK:", response.statusText);
          throw new Error(response.statusText);
        }

        const data = (await response.json()) as T;
        console.log("Fetched data:", data);

        cache.current[url] = data;
        if (cancelRequest.current) return;

        dispatch({ type: "fetched", payload: data });
      } catch (error) {
        console.error("Fetch error:", error);
        if (cancelRequest.current) return;

        dispatch({ type: "error", payload: error as Error });
      }
    };

    fetchData();

    return () => {
      cancelRequest.current = true;
    };
  }, [url, options]);

  return state;
}

export default useFetch;
