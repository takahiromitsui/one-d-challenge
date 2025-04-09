import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Home from '@/app/page';

describe('Home Page', () => {
it('should render the home page', () => {
	render(<Home />);
    expect(
screen.getByPlaceholderText('レポジトリを入力して下さい')
).toBeInTheDocument();
  });
});
