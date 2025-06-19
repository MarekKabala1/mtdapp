if (__DEV__) {
	require('../ReactotronConfig');
}
import { db, openMtdDb } from '@/db/drizzle/sqlite/client';
import migrations from '@/db/drizzle/sqlite/migration/migrations';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {
	const { success, error } = useMigrations(db, migrations);
	if (__DEV__) {
		useDrizzleStudio(openMtdDb);
	}
	if (error) {
		return (
			<SafeAreaView className='flex-1 items-center justify-center'>
				<View className='flex flex-col items-center justify-center p-4'>
					<Text className='text-danger text-bold'>Migration error: {error.message}</Text>
				</View>
			</SafeAreaView>
		);
	}
	if (!success) {
		return (
			<View>
				<Text>Migration is in progress...</Text>
			</View>
		);
	}

	return (
		<SafeAreaView className='flex-1 justify-center items-center bg-white dark:bg-gray-900'>
			<Text className='text-black dark:text-white'>Edit app/index.tsx to edit this screen.</Text>
		</SafeAreaView>
	);
}
