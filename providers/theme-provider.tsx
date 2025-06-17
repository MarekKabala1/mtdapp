import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, DefaultTheme, ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { useColorScheme } from 'nativewind';
import React, { useEffect } from 'react';

type ThemeOptions = 'light' | 'dark' | 'system';

export const lightTheme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		primary: '#3b82f6',
		background: '#f9fafb',
		card: '#ffffff',
		text: '#111827',
		border: '#e5e7eb',
		notification: '#f97316',
	},
};

export const darkTheme = {
	...DarkTheme,
	colors: {
		...DarkTheme.colors,
		primary: '#60a5fa',
		background: '#0f172a',
		card: '#334155',
		text: '#f8fafc',
		border: '#475569',
		notification: '#fb923c',
	},
};
export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const { colorScheme, setColorScheme } = useColorScheme();

	useEffect(() => {
		const loadTheme = async () => {
			const stored = (await AsyncStorage.getItem('theme')) as ThemeOptions;
			if (stored) {
				setColorScheme(stored);
			} else {
				setColorScheme('light');
			}
		};

		loadTheme();
	}, []);

	return <NavThemeProvider value={colorScheme === 'dark' ? darkTheme : lightTheme}>{children}</NavThemeProvider>;
}
