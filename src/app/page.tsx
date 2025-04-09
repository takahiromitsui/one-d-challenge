'use client';
import { getGithubRepositories } from '@/api/github-repositories';
import MaxWidthWrapper from '@/components/max-width-wrapper';
import RepositoryItem from '@/components/repository-item';
import { Input } from '@/components/ui/input';
import useDebounce from '@/hooks/use-debounce';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useState } from 'react';

const pageSize = 100;

export default function Home() {
	const [search, setSearch] = useState('');
	const debouncedSearch = useDebounce(search, 500);

	const { data, isError, isPending } = useInfiniteQuery({
		queryKey: ['repositories', debouncedSearch],
		queryFn: () => getGithubRepositories(pageSize, debouncedSearch),
		initialPageParam: 1,
		getNextPageParam: (lastPage, pages) => {
			if (lastPage.total_count > pages.length * pageSize) {
				return pages.length;
			}
			return undefined;
		},
	});
	const { items } = data?.pages[0] || { items: [] };

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
			{isError && <div className='text-red-500'>エラーが発生しました</div>}
			{isPending && <div className='text-gray-500'>Loading...</div>}
			{!isPending && items?.length === 0 ? (
				<div className='text-gray-500'>レポジトリが見つかりません</div>
			) : (
				<>
					{items?.map(item => (
						<RepositoryItem key={item.id} item={item} />
					))}
				</>
			)}
		</MaxWidthWrapper>
	);
}
