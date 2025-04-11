'use client';
import {
	getGithubRepositories,
	GithubRepositoryItem,
} from '@/api/github-repositories';
import MaxWidthWrapper from '@/components/max-width-wrapper';
import RepositoryItem from '@/components/repository-item';
import { Input } from '@/components/ui/input';
import useDebounce from '@/hooks/use-debounce';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { useEffect, useState } from 'react';

export default function Home() {
	const [search, setSearch] = useState('');
	const debouncedSearch = useDebounce(search, 500);

	const {
		data,
		error,
		isError,
		isPending,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useInfiniteQuery({
		queryKey: ['repositories', debouncedSearch],
		queryFn: ({ pageParam = 1 }) =>
			getGithubRepositories(pageParam, debouncedSearch),
		initialPageParam: 1,
		getNextPageParam: (lastPage, pages) => {
			const nextPage = lastPage.items.length ? pages.length + 1 : undefined;
			return nextPage;
		},
		enabled: debouncedSearch.trim() !== '',
	});

	const dataPages = data && data.pages ? data.pages : [];
	const repositories = dataPages.flatMap(page =>
		page.items ? page.items : []
	);

	const { ref, inView } = useInView();
	// 次のページを取得する
	useEffect(() => {
		if (inView && hasNextPage) {
			fetchNextPage();
		}
	}, [inView, hasNextPage, fetchNextPage]);

	const queryClient = useQueryClient();
	//	キャッシュに保存する -> repositoriesページで使用
	useEffect(() => {
		if (repositories) {
			repositories.forEach(repo => {
				queryClient.setQueryData(
					['repositories', repo.owner.login, repo.name],
					repo
				);
			});
		}
	}, [queryClient, repositories]);

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
					{repositories?.map((repo: GithubRepositoryItem, index: number) => {
						if (repositories.length === index + 1) {
							return (
								<RepositoryItem key={repo.id} item={repo} innerRef={ref} />
							);
						} else {
							return <RepositoryItem key={repo.id} item={repo} />;
						}
					})}
					{isFetchingNextPage ? <h3>読み込み中...</h3> : null}
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
