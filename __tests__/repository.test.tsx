import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import RepositoryPage from '@/app/repositories/[owner]/[repo]/page';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

// useParamsとuseRouterをモックする
jest.mock('next/navigation', () => ({
	useParams: jest.fn(),
	useRouter: jest.fn(),
}));

// テスト用のQueryClientを用意する
const createTestQueryClient = () =>
	new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
			},
		},
	});

describe('Repository Page', () => {
	let queryClient: QueryClient;
	// arrange
	beforeEach(() => {
		jest.clearAllMocks();
		queryClient = createTestQueryClient();
	});

	const renderRepositoryPage = () =>
		render(
			<QueryClientProvider client={queryClient}>
				<RepositoryPage />
			</QueryClientProvider>
		);

	it('キャッシュにレポ情報が保存されているならば、レポ情報の詳細を表示すべき', () => {
		// arrange
		(useParams as jest.Mock).mockReturnValue({ owner: 'user1', repo: 'repo1' });
		queryClient.setQueryData(['repositories', 'user1', 'repo1'], {
			name: 'Repo 1',
			owner: { login: 'user1', avatar_url: 'url1' },
			language: 'Go',
			stargazers_count: 100,
			watchers_count: 50,
			forks_count: 25,
			open_issues_count: 10,
		});
		renderRepositoryPage();
		// assert
		expect(screen.getByText('Repo 1')).toBeInTheDocument();
		expect(screen.getByText('by user1')).toBeInTheDocument();
		expect(screen.getByText('Go')).toBeInTheDocument();
		expect(screen.getByText('Star数')).toBeInTheDocument();
		expect(screen.getByText('Watcher数')).toBeInTheDocument();
		expect(screen.getByText('Fork数')).toBeInTheDocument();
		expect(screen.getByText('Issue数')).toBeInTheDocument();
		expect(screen.getByText('100')).toBeInTheDocument();
		expect(screen.getByText('50')).toBeInTheDocument();
		expect(screen.getByText('25')).toBeInTheDocument();
		expect(screen.getByText('10')).toBeInTheDocument();
	});

	it('キャッシュにレポ情報が保存されていないならば、エラーメッセージを表示すべき', () => {
		// arrange
		(useParams as jest.Mock).mockReturnValue({ owner: 'user1', repo: 'repo1' });
		queryClient.setQueryData(['repositories', 'user1', 'repo1'], undefined);
		renderRepositoryPage();
		// assert
		expect(
			screen.getByText('レポジトリが見つかりませんでした')
		).toBeInTheDocument();
	});
});
