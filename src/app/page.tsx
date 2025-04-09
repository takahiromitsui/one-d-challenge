'use client';
import { getGithubRepositories } from '@/api/github-repositories';
import MaxWidthWrapper from '@/components/max-width-wrapper';
import { Input } from '@/components/ui/input';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useState } from 'react';

const pageSize = 100;

export default function Home() {
	const [search, setSearch] = useState('');

	const { data } = useInfiniteQuery({
		queryKey: ['repositories'],
		queryFn: () => getGithubRepositories(pageSize, search),
		initialPageParam: 1,
		getNextPageParam: (lastPage, pages) => {
			if (lastPage.total_count > pages.length * pageSize) {
				return pages.length;
			}
			return undefined;
		},
	});
	console.log(data);
	return (
		<MaxWidthWrapper className='py-10'>
			<Input
				type='text'
				value={search}
				onChange={e => setSearch(e.target.value)}
				placeholder='レポジトリを入力して下さい'
				className='border p-2'
			/>
		</MaxWidthWrapper>
	);
}
