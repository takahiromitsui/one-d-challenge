'use client';
import {
	getGithubRepositories,
	GithubRepositoryItem,
} from '@/api/github-repositories';
import MaxWidthWrapper from '@/components/max-width-wrapper';
import RepositoryItem from '@/components/repository-item';
import { Input } from '@/components/ui/input';
import useDebounce from '@/hooks/use-debounce';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useState } from 'react';

export default function Home() {
	const [search, setSearch] = useState('');
	const debouncedSearch = useDebounce(search, 500);

	const { data, error, isError, isPending, fetchNextPage, hasNextPage } = useInfiniteQuery({
		queryKey: ['repositories', debouncedSearch],
		queryFn: ({ pageParam = 0 }) =>
			getGithubRepositories(pageParam, debouncedSearch),
		initialPageParam: 0,
		getNextPageParam: (lastPage, pages) => {
			return pages.length + 1;
		},
		enabled: debouncedSearch.trim() !== '',
	});
	
	const repositories = data?.pages.flatMap(page => page.items ?? []) ?? [];

	return (
		<MaxWidthWrapper className='py-10'>
			<div className='mb-4'>
				<Input
					type='text'
					value={search}
					onChange={e => setSearch(e.target.value)}
					placeholder='レポジトリを入力して下さい'
					className='border p-2'
				/>
			</div>
			{!isPending && repositories?.length === 0 ? (
				<div className='text-gray-500'>レポジトリが見つかりません</div>
			) : null}
			{
				<div className='mb-4'>
					{repositories?.map((repo: GithubRepositoryItem) => (
						<RepositoryItem key={repo.id} item={repo} />
					))}
					{hasNextPage ? (
						<button
							className='bg-blue-500 text-white p-2 rounded'
							onClick={() => {
								if (data?.pages.length) {
									fetchNextPage();
								}
							}}
						>
							もっと見る
						</button>
					) : null}
				</div>
			}
			{isError ? (
				<div className='text-red-500'>
					エラーが発生しました:{' '}
					{error instanceof Error ? error.message : '不明なエラー'}
				</div>
			) : null}
		</MaxWidthWrapper>
	);
}
