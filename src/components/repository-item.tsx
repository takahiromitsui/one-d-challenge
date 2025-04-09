import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { GithubRepositoryItem } from '@/api/github-repositories';
import Link from 'next/link';

export default function RepositoryItem({
	item,
}: {
	item: GithubRepositoryItem;
}) {
	return (
		<div className='border p-4 mb-4 rounded'>
			<Link
				href={`/repositories/${item.owner.login}/${item.name}`}
				className='flex items-center gap-4'
			>
				<Avatar>
					<AvatarImage src={item.owner.avatar_url} />
					<AvatarFallback>
						{item.owner.login.slice(0, 2).toUpperCase()}
					</AvatarFallback>
				</Avatar>
				<h2 className='text-lg font-bold'>{item.name}</h2>
			</Link>
		</div>
	);
}
