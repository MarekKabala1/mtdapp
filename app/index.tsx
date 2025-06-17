if (__DEV__) {
	require('../ReactotronConfig');
}
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {
	return (
		<SafeAreaView className='flex-1 justify-center items-center bg-white dark:bg-gray-900'>
			<Text className='text-black dark:text-white'>Edit app/index.tsx to edit this screen.</Text>
		</SafeAreaView>
	);
}
