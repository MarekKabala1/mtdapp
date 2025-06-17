import '../global.css';
import { AppProviders } from '../providers/app-providers';
import StackLayout from './(stack)/_layout';
export default function RootLayout() {
	return (
		<AppProviders>
			<StackLayout />
		</AppProviders>
	);
}
