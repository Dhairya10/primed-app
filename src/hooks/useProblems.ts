import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { getProblems, getProblemsMetadata, type GetProblemsParams } from '@/lib/api';
import { DEFAULT_USER_ID, PROBLEMS_PER_PAGE } from '@/lib/constants';

export function useProblems(params: Omit<GetProblemsParams, 'limit' | 'offset'>) {
  return useInfiniteQuery({
    queryKey: ['problems', params],
    queryFn: ({ pageParam = 0 }) =>
      getProblems({
        ...params,
        limit: PROBLEMS_PER_PAGE,
        offset: pageParam,
        user_id: DEFAULT_USER_ID,
      }),
    getNextPageParam: (lastPage) => {
      if (lastPage.has_more) {
        return lastPage.offset + lastPage.limit;
      }
      return undefined;
    },
    initialPageParam: 0,
  });
}

export function useProblemsMetadata() {
  return useQuery({
    queryKey: ['problems-metadata'],
    queryFn: getProblemsMetadata,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}
