/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
	presets: [require('nativewind/preset')],
	darkMode: 'class',
	theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        app: {
          primary: {
            50: '#eff6ff',
            100: '#dbeafe',
            200: '#bfdbfe',
            300: '#93c5fd',
            400: '#60a5fa',
            500: '#3b82f6',
            600: '#2563eb',
            700: '#1d4ed8',
            800: '#1e40af',
            900: '#1e3a8a',
            dark: {
              50: '#1e3a8a',
              100: '#1e40af',
              200: '#1d4ed8',
              300: '#2563eb',
              400: '#3b82f6',
              500: '#60a5fa', 
              600: '#93c5fd',
              700: '#bfdbfe',
              800: '#dbeafe',
              900: '#eff6ff',
            }
          },
          background: { 
            primary: '#f9fafb',
            secondary: '#f3f4f6',
            card: '#ffffff',
            modal: '#ffffff',
            overlay: 'rgba(0, 0, 0, 0.5)',      
            dark: {
              primary: '#0f172a',     
              secondary: '#1e293b',   
              card: '#334155',      
              modal: '#475569',     
              elevated: '#64748b',   
              overlay: 'rgba(0, 0, 0, 0.8)',
            }
          },
          text: {
            primary: '#111827',
            secondary: '#6b7280',
            tertiary: '#9ca3af',
            inverse: '#ffffff',
            muted: '#d1d5db',
            dark: {
              primary: '#f8fafc',  
              secondary: '#cbd5e1', 
              tertiary: '#94a3b8',  
              inverse: '#0f172a',   
              muted: '#64748b',    
              accent: '#60a5fa',     
            }
          },
    
          border: {
            light: '#e5e7eb',
            medium: '#d1d5db',
            dark: '#9ca3af',
            dark: {
              light: '#475569',      
              medium: '#334155',  
              dark: '#1e293b', 
            }
          },
          success: {
            50: '#f0fdf4',
            400: '#4ade80', 
            500: '#22c55e',
            600: '#16a34a',
            dark: {
              400: '#4ade80',    
              500: '#22c55e',
              600: '#16a34a',
            }
          },
          error: {
            50: '#fef2f2',
            400: '#f87171',    
            500: '#ef4444',
            600: '#dc2626',
            dark: {
              400: '#f87171',   
              500: '#ef4444',
              600: '#dc2626',
            }
          },
          warning: {
            50: '#fffbeb',
            400: '#fbbf24',     
            500: '#f59e0b',
            600: '#d97706',
            dark: {
              400: '#fbbf24',    
              500: '#f59e0b',
              600: '#d97706',
            }
          },
  
          orange: {
            400: '#fb923c',        
            500: '#f97316',
            600: '#ea580c',
            dark: {
              400: '#fb923c',      
              500: '#f97316',
              600: '#ea580c',
            }
          },

          chart: {

            blue: '#3b82f6',
            lightBlue: '#93c5fd',
            gray: '#6b7280',
      
            dark: {
              blue: '#60a5fa',      
              lightBlue: '#93c5fd',
              gray: '#94a3b8',     
              purple: '#a78bfa',    
              green: '#4ade80',    
              orange: '#fb923c',   
            }
          }
        }
      },
      boxShadow: {

        'app-card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'app-modal': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'app-button': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'app-card-dark': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
        'app-modal-dark': '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
        'app-button-dark': '0 2px 4px 0 rgba(0, 0, 0, 0.2)',
        'app-glow': '0 0 20px rgba(59, 130, 246, 0.3)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        'app-card': '12px',
        'app-button': '8px',
        'app-input': '6px',
      }
    },
  },
	plugins: [],
};
