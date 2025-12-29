import { Outlet, Link, useLocation } from 'react-router-dom'
import { Home, Grid3x3, AlertCircle, Leaf, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Layout() {
    const location = useLocation()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const navigation = [
        { name: 'Overview', href: '/', icon: Home },
        { name: 'Zones', href: '/zones', icon: Grid3x3 },
        { name: 'Insights', href: '/insights', icon: AlertCircle },
    ]

    const isActive = (href: string) => {
        if (href === '/') return location.pathname === '/'
        return location.pathname.startsWith(href)
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile Header */}
            <div className="lg:hidden fixed  top-0 left-0 right-0 bg-white border-b border-gray-200 p-4 z-30 shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-primary-700">
                            <Leaf className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-lg font-bold text-gray-900">Breathe Again</h1>
                    </div>
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? (
                            <X className="w-6 h-6 text-gray-900" />
                        ) : (
                            <Menu className="w-6 h-6 text-gray-900" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="lg:hidden fixed inset-0 bg-black/50 z-40"
                            onClick={() => setMobileMenuOpen(false)}
                        />
                        <motion.div
                            initial={{ x: -300 }}
                            animate={{ x: 0 }}
                            exit={{ x: -300 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="lg:hidden fixed top-0 left-0 bottom-0 w-64 bg-white shadow-xl z-50"
                        >
                            <div className="flex flex-col h-full">
                                {/* Mobile Logo */}
                                <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-200">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-700">
                                        <Leaf className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-lg font-bold text-gray-900">Breathe Again</h1>
                                        <p className="text-xs text-gray-500">Biophilic Monitoring</p>
                                    </div>
                                </div>

                                {/* Mobile Navigation */}
                                <nav className="flex-1 px-4 py-6 space-y-1">
                                    {navigation.map((item) => {
                                        const Icon = item.icon
                                        const active = isActive(item.href)

                                        return (
                                            <Link
                                                key={item.name}
                                                to={item.href}
                                                onClick={() => setMobileMenuOpen(false)}
                                                className={`
                                                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 min-h-[44px]
                                                    ${active
                                                        ? 'bg-primary-50 text-primary-700 font-medium shadow-sm'
                                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                                    }
                                                `}
                                            >
                                                <Icon className="w-5 h-5" />
                                                <span>{item.name}</span>
                                            </Link>
                                        )
                                    })}
                                </nav>

                                {/* Mobile Footer */}
                                <div className="px-6 py-4 border-t border-gray-200">
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        <span>Backend Connected</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Desktop Sidebar */}
            <aside className="hidden lg:block fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 shadow-sm">
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-200">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-700">
                            <Leaf className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-gray-900">Breathe Again</h1>
                            <p className="text-xs text-gray-500">Biophilic Monitoring</p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-1">
                        {navigation.map((item) => {
                            const Icon = item.icon
                            const active = isActive(item.href)

                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                    ${active
                                            ? 'bg-primary-50 text-primary-700 font-medium shadow-sm'
                                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                        }
                  `}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span>{item.name}</span>
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Footer */}
                    <div className="px-6 py-4 border-t border-gray-200">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span>Backend Connected</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="lg:pl-64 pt-16 lg:pt-0">
                <div className="min-h-screen">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}
