import MaxWidthWrapper from '@/components/max-width-wrapper';
import { Input } from '@/components/ui/input';

export default function Home() {
	return (
		<MaxWidthWrapper className='py-10'>
			<Input
				type='text'
				placeholder='レポジトリを入力して下さい'
				className='border p-2'
			/>
		</MaxWidthWrapper>
	);
}
