'use client';
import { GithubRepositoryItem } from '@/api/github-repositories';
import MaxWidthWrapper from '@/components/max-width-wrapper';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Eye, GitFork, Star, AlertCircle } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

export default function RepositoryPage() {
	const { owner, repo } = useParams() as { owner: string; repo: string };
	const queryClient = useQueryClient();
	const router = useRouter();

	// キャッシュからリポジトリ情報を取得
	const repos = queryClient.getQueryData<GithubRepositoryItem>([
		'repositories',
		owner,
		repo,
	]);
	if (!repos) {
		return <div>レポジトリが見つかりませんでした</div>;
	}

	return (
		<MaxWidthWrapper className='py-10'>
			<div className='bg-gradient-to-r from-slate-100 to-slate-50 p-6 rounded mb-4'>
				<div className='flex items-center gap-4 mb-4'>
					<Avatar className='h-16 w-16 border-2 border-white shadow-sm'>
						<AvatarImage src={repos.owner.avatar_url} alt={repos.owner.login} />
						<AvatarFallback className='text-lg'>
							{repos.owner.login.slice(0, 2).toUpperCase()}
						</AvatarFallback>
					</Avatar>
					<div>
						<div className='flex items-center gap-2'>
							<h1 className='text-2xl font-bold'>{repos.name}</h1>
							{repos.language ? (
								<Badge className='ml-2'>{repos.language}</Badge>
							) : null}
						</div>
						<h2 className='text-sm text-muted-foreground mt-1'>
							by {repos.owner.login}
						</h2>
					</div>
				</div>

				<div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
					<div className='flex flex-col items-center p-4 rounded-lg bg-white'>
						<Star className='h-5 w-5 text-amber-500 mb-2' />
						<span className='text-xl font-semibold'>
							{repos.stargazers_count}
						</span>
						<span className='text-xs text-muted-foreground'>Star数</span>
					</div>

					<div className='flex flex-col items-center p-4 rounded-lg bg-white'>
						<Eye className='h-5 w-5 text-violet-500 mb-2' />
						<span className='text-xl font-semibold'>
							{repos.watchers_count}
						</span>
						<span className='text-xs text-muted-foreground'>Watcher数</span>
					</div>

					<div className='flex flex-col items-center p-4 rounded-lg bg-white'>
						<GitFork className='h-5 w-5 text-emerald-500 mb-2' />
						<span className='text-xl font-semibold'>{repos.forks_count}</span>
						<span className='text-xs text-muted-foreground'>Fork数</span>
					</div>

					<div className='flex flex-col items-center p-4 rounded-lg bg-white'>
						<AlertCircle className='h-5 w-5 text-rose-500 mb-2' />
						<span className='text-xl font-semibold'>
							{repos.open_issues_count}
						</span>
						<span className='text-xs text-muted-foreground'>Issue数</span>
					</div>
				</div>
			</div>
			<Button
				variant='ghost'
				className='font-bold text-gray-800 py-8 cursor-pointer hover:text-gray-600 transition-colors duration-200 hover:bg-transparent'
				onClick={() => router.back()}
			>
				<ArrowLeft className='mr-2 h-4 w-4' />
				戻る
			</Button>
		</MaxWidthWrapper>
	);
}
