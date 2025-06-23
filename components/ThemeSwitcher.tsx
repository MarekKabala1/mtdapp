import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useTheme } from "@react-navigation/native"
import { useColorScheme } from "nativewind"
import React, { useEffect, useState } from "react"
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native"
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated"

type ThemeOptions = "light" | "dark" | "system"

export default function ThemeSwitcher() {
  const { setColorScheme, colorScheme } = useColorScheme()
  const [selectedIndex, setSelectedIndex] = useState<ThemeOptions>("system")
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const rotation = useSharedValue(0)

  const toggleColorScheme = async (themeValue: ThemeOptions) => {
    setSelectedIndex(themeValue)
    setColorScheme(themeValue)
    setIsOpen(false)
    handleClose()
    await AsyncStorage.setItem("theme", themeValue)
  }

  useEffect(() => {
    const getTheme = async () => {
      try {
        const themeValue = (await AsyncStorage.getItem("theme")) as ThemeOptions
        if (themeValue) {
          setSelectedIndex(themeValue)
          setColorScheme(themeValue)
        }
      } catch (e) {
        console.error("Error to set a theme", e)
      }
    }
    getTheme()
  }, [])

  const { colors } = useTheme()

  const toggleIsOpen = () => {
    rotation.value = withSpring(isOpen ? 0 : 1, {
      damping: 12,
      stiffness: 100,
    })
    setIsOpen(prev => !prev)
  }

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${interpolate(rotation.value, [0, 1], [0, 180])}deg`,
        },
      ],
    }
  })

  const handleClose = () => {
    rotation.value = withSpring(0, {
      damping: 12,
      stiffness: 100,
    })
    setIsOpen(false)
  }

  return (
    <View className='relative'>
      <TouchableOpacity
        onPress={toggleIsOpen}
        className='flex-row items-center gap-2 rounded-app-button bg-app-background-card px-4 py-2 shadow-app-card dark:bg-app-background-dark-card dark:shadow-app-card-dark'>
        <MaterialCommunityIcons
          name={
            selectedIndex === "light"
              ? "home-lightbulb-outline"
              : selectedIndex === "dark"
                ? "home-lightbulb"
                : "theme-light-dark"
          }
          size={20}
          color={colors.text}
        />
        <Text className='font-medium text-app-text-primary dark:text-app-text-dark-primary'>
          {selectedIndex.charAt(0).toUpperCase() + selectedIndex.slice(1)}
        </Text>
        <Animated.View style={animatedStyle}>
          <MaterialCommunityIcons
            name='chevron-down'
            size={20}
            color={colors.text}
          />
        </Animated.View>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType='fade'
        onRequestClose={handleClose}>
        <Pressable className='flex-1' onPress={handleClose}>
          <View className='absolute right-4 top-16 w-48 overflow-hidden rounded-app-card bg-app-background-card shadow-app-modal dark:bg-app-background-dark-card dark:shadow-app-modal-dark'>
            <TouchableOpacity
              onPress={() => toggleColorScheme("light")}
              className='flex-row items-center gap-3 border-b border-app-border-light px-4 py-3 dark:border-app-border-dark-light'>
              <MaterialCommunityIcons
                name='home-lightbulb-outline'
                size={20}
                color={colors.text}
              />
              <Text className='text-app-text-primary dark:text-app-text-dark-primary'>
                Light
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => toggleColorScheme("dark")}
              className='flex-row items-center gap-3 border-b border-app-border-light px-4 py-3 dark:border-app-border-dark-light'>
              <MaterialCommunityIcons
                name='home-lightbulb'
                size={20}
                color={colors.text}
              />
              <Text className='text-app-text-primary dark:text-app-text-dark-primary'>
                Dark
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => toggleColorScheme("system")}
              className='flex-row items-center gap-3 px-4 py-3'>
              <MaterialCommunityIcons
                name='theme-light-dark'
                size={20}
                color={colors.text}
              />
              <Text className='text-app-text-primary dark:text-app-text-dark-primary'>
                System
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  )
}
