import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

const GITHUB_ERROR_MESSAGES: Record<string, string> = {
	'Only the first 1000 search results are available':
		'検索結果は最大1000件までしか取得できません。',
	'API rate limit exceeded for':
		'GitHubのAPIレート制限を超えました。時間を置いて再度お試しください。',
	'Validation Failed': '検索クエリが無効です。',
	'Bad credentials': '認証情報が無効です。',
};

export function translateErrorMessage(message: string) {
	const entry = Object.entries(GITHUB_ERROR_MESSAGES).find(([english]) =>
		message.includes(english)
	);
	return entry ? entry[1] : message;
}
