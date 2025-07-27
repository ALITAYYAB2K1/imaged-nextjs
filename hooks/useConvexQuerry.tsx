import { useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface UseConvexQueryResult<T> {
  data: T | undefined;
  isLoading: boolean;
  error: Error | null;
}

interface UseConvexMutationResult<T> {
  data: T | undefined;
  isLoading: boolean;
  error: Error | null;
  mutate: (...args: unknown[]) => Promise<T | undefined>;
}

function useConvexQuerry<T>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  args?: any
): UseConvexQueryResult<T> {
  const result = useQuery(query, args);

  const [data, setData] = useState<T | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (result === undefined) {
      setIsLoading(true);
    } else {
      try {
        setData(result);
        setError(null);
      } catch (err) {
        const errorObj = err instanceof Error ? err : new Error(String(err));
        setError(errorObj);
        toast.error(`Error fetching data: ${errorObj.message}`);
      } finally {
        setIsLoading(false);
      }
    }
  }, [result]);
  return { data, isLoading, error };
}
export const useConvexMutation = <T = void,>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mutation: any
): UseConvexMutationResult<T> => {
  const mutationFn = useMutation(mutation);

  const [data, setData] = useState<T | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (...args: unknown[]): Promise<T | undefined> => {
    setIsLoading(true);
    setError(null);
    try {
      // Handle the case where args might be empty or have a single object
      const response = await mutationFn(
        args.length === 1 ? args[0] : args.length === 0 ? {} : args
      );
      setData(response);
      return response;
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(errorObj);
      toast.error(`Error executing mutation: ${errorObj.message}`);
      return undefined;
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, error, mutate };
};
export default useConvexQuerry;
