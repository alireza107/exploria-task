import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface UseQueryParamsOptions {
  initialParams: { [key: string]: any };
}

export function useQueryParams(options: UseQueryParamsOptions) {
  const { initialParams } = options;
  const router = useRouter();

  // Read query parameters from URL
  const queryParams = new URLSearchParams(window.location.search);

  // Initialize state from URL parameters or defaults
  const initialState = Object.fromEntries(
    Object.keys(initialParams).map((key) => [
      key,
      queryParams.get(`${key}`) || initialParams[key],
    ])
  );

  const [params, setParams] = useState(initialState);

  // Update URL when state changes
  useEffect(() => {
    const newQuery = new URLSearchParams(
      Object.entries(params).map(([key, value]) => [`${key}`, value])
    );
    router.push(`${window.location.pathname}?${newQuery.toString()}`);
  }, [params, router]);

  const setQueryParam = (key: string, value: any) => {
    setParams((prevParams) => ({
      ...prevParams,
      [key]: value,
    }));
  };

  return {
    params,
    setQueryParam,
  };
}
