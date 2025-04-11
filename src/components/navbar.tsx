import Link from 'next/link';
import MaxWidthWrapper from './max-width-wrapper';

export default function Navbar() {
	return (
		<div className='bg-white sticky z-50 top-0 inset-x-0 h-16'>
			<header className='relative bg-white'>
				<MaxWidthWrapper>
					<Link href='/'>
						<div className='flex items-center justify-between h-16  border-b border-gray-200'>
							<h1 className='text-xl font-bold text-gray-800 py-8 cursor-pointer hover:text-gray-600 transition-colors duration-200'>
								GitHubリポジトリ検索アプリ
							</h1>
						</div>
					</Link>
				</MaxWidthWrapper>
			</header>
		</div>
	);
}
