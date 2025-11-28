import type { Config } from 'tailwindcss';

export default {
	darkMode: 'class',
	content: [
		'./index.html',
		'./src/**/*.{js,ts,jsx,tsx}'
	],
	theme: {
		extend: {
			colors: {
				brand: {
					50: '#f0f9ff',
					100: '#e0f2fe',
					200: '#bae6fd',
					300: '#7dd3fc',
					400: '#38bdf8',
					500: '#0ea5e9',
					600: '#0284c7',
					700: '#0369a1',
					800: '#075985',
					900: '#0c4a6e',
					950: '#082f49'
				}
			},
			fontFamily: {
				sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
				display: ['Outfit', 'Inter', 'sans-serif']
			},
			borderRadius: {
				xl: '1rem',
				'2xl': '1.25rem',
				'3xl': '1.5rem'
			},
			boxShadow: {
				glass: '0 8px 32px rgba(2, 6, 23, 0.2)',
				'glass-lg': '0 12px 48px rgba(2, 6, 23, 0.3)',
				'inner-glow': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
				'neon': '0 0 20px rgba(14, 165, 233, 0.4), 0 0 40px rgba(14, 165, 233, 0.2)',
				'neon-hover': '0 0 30px rgba(14, 165, 233, 0.6), 0 0 60px rgba(14, 165, 233, 0.3)'
			},
			backgroundImage: {
				'dotted': 'radial-gradient(circle at 1px 1px, rgba(148,163,184,0.15) 1px, transparent 0)',
				'gradient-radial': 'radial-gradient(ellipse at top, rgba(56,189,248,0.15), transparent 60%), radial-gradient(ellipse at bottom, rgba(168,85,247,0.12), transparent 60%)',
				'gradient-mesh': 'radial-gradient(at 40% 20%, rgba(14, 165, 233, 0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(168, 85, 247, 0.12) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(16, 185, 129, 0.1) 0px, transparent 50%)',
				'shimmer': 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)'
			},
			backgroundSize: {
				dotted: '24px 24px'
			},
			animation: {
				'fade-in': 'fadeIn 0.5s ease-in-out',
				'fade-in-up': 'fadeInUp 0.6s ease-out',
				'fade-in-down': 'fadeInDown 0.6s ease-out',
				'slide-in-right': 'slideInRight 0.4s ease-out',
				'slide-in-left': 'slideInLeft 0.4s ease-out',
				'scale-in': 'scaleIn 0.3s ease-out',
				'bounce-subtle': 'bounceSubtle 2s infinite',
				'shimmer': 'shimmer 2s infinite',
				'glow': 'glow 2s ease-in-out infinite',
				'float': 'float 3s ease-in-out infinite',
				'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
			},
			keyframes: {
				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				fadeInUp: {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				fadeInDown: {
					'0%': { opacity: '0', transform: 'translateY(-20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				slideInRight: {
					'0%': { opacity: '0', transform: 'translateX(20px)' },
					'100%': { opacity: '1', transform: 'translateX(0)' }
				},
				slideInLeft: {
					'0%': { opacity: '0', transform: 'translateX(-20px)' },
					'100%': { opacity: '1', transform: 'translateX(0)' }
				},
				scaleIn: {
					'0%': { opacity: '0', transform: 'scale(0.95)' },
					'100%': { opacity: '1', transform: 'scale(1)' }
				},
				bounceSubtle: {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-5px)' }
				},
				shimmer: {
					'0%': { backgroundPosition: '-200% 0' },
					'100%': { backgroundPosition: '200% 0' }
				},
				glow: {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.5' }
				},
				float: {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' }
				}
			}
		}
	}
} satisfies Config;
