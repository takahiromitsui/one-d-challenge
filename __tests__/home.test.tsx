import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '@/app/page';
import { useInfiniteQuery } from '@tanstack/react-query';

// arrange
// IntersectionObserverをモックする
// ReferenceError: IntersectionObserver is not definedを回避するために必要
beforeAll(() => {
	global.IntersectionObserver = jest.fn(function IntersectionObserverMock(
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		_callback,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		_options
	) {
		return {
			root: null,
			rootMargin: '',
			thresholds: [],
			observe: jest.fn(),
			unobserve: jest.fn(),
			disconnect: jest.fn(),
			takeRecords: jest.fn(),
		};
	});
});

// arrange
// useInfiniteQuery hookをモックする
jest.mock('@tanstack/react-query', () => ({
	...jest.requireActual('@tanstack/react-query'),
	useInfiniteQuery: jest.fn(() => ({
		data: undefined,
		error: null,
		isError: false,
		isPending: false,
		fetchNextPage: jest.fn(),
		hasNextPage: false,
		isFetchingNextPage: false,
	})),
}));

describe('Home Page', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('input fieldをレンダーすべき', () => {
		render(<Home />);
		// assert
		expect(
			screen.getByPlaceholderText('レポジトリを入力して下さい')
		).toBeInTheDocument();
	});

	it('input filedが空欄の時はデータをfetchされるべきではない', () => {
		// arrange
		(useInfiniteQuery as jest.Mock).mockReturnValue({
			data: undefined,
			isError: false,
			isPending: false,
			fetchNextPage: jest.fn(),
			hasNextPage: false,
			isFetchingNextPage: false,
		});
		render(<Home />);
		// assert
		expect(screen.queryByText('読み込み中...')).not.toBeInTheDocument();
	});
	it('ユーザーインプットによりレポジトリを表示するべき', async () => {
		// arrange
		(useInfiniteQuery as jest.Mock).mockReturnValue({
			// mock data
			data: {
				pages: [
					{
						items: [
							{
								id: 1,
								name: 'Repo 1',
								owner: { login: 'user1', avatar_url: 'url1' },
							},
							{
								id: 2,
								name: 'Repo 2',
								owner: { login: 'user2', avatar_url: 'url2' },
							},
						],
					},
				],
			},
			isError: false,
			isPending: false,
			fetchNextPage: jest.fn(),
			hasNextPage: true,
			isFetchingNextPage: false,
		});

		render(<Home />);

		// act
		// ユーザーインプットをシミュレート
		const input = screen.getByPlaceholderText('レポジトリを入力して下さい');
		fireEvent.change(input, { target: { value: 'test' } });

		// assert
		// レポジトリが表示されるのを待つ
		await waitFor(() => {
			expect(screen.getByText('Repo 1')).toBeInTheDocument();
			expect(screen.getByText('Repo 2')).toBeInTheDocument();
		});
	});

	it('APIがエラーメッセージを含んでいる場合にはエラーを表示すべき', async () => {
		// arrange
		(useInfiniteQuery as jest.Mock).mockReturnValue({
			data: undefined,
			isError: true,
			error: new Error('Test error'),
			isPending: false,
			fetchNextPage: jest.fn(),
			hasNextPage: false,
			isFetchingNextPage: false,
		});

		render(<Home />);

		// assert
		// エラーが表示されるのを待つ
		await waitFor(() => {
			expect(
				screen.getByText('エラーが発生しました: Test error')
			).toBeInTheDocument();
		});
	});
});
