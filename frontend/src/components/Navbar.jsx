
import { useContext, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { MyContainer } from '../Context/MyContext'
import {
    ShieldCheck,
    Menu,
    X,
    UserRound,
    FileText,
    LogOut,
    ChevronDown,
    House,
    ClipboardList,
    GraduationCap,
    CarFront,
    Receipt
} from 'lucide-react'

const LINKS = [
    { label: 'Home', to: '/', icon: House },
    { label: 'Apply for Services', to: '/services', icon: FileText },
    { label: 'My Applications', to: '/applications', icon: ClipboardList },
    { label: 'Training & Progress', to: '/training', icon: GraduationCap },
    { label: 'Driving Test', to: '/driving-test', icon: CarFront },
    { label: 'Fines', to: '/fines', icon: Receipt }
]

export default function Navbar() {
    const { user, setUser } = useContext(MyContainer)
    const [menuOpen, setMenuOpen] = useState(false)
    const [accountOpen, setAccountOpen] = useState(false)
    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem('UserToken')
        setUser?.(null)
        setAccountOpen(false)
        setMenuOpen(false)
        navigate('/login')
    }

    return (
        <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white shadow-sm">
            <nav className="mx-auto flex min-h-[76px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">

                <Link
                    to="/"
                    className="flex shrink-0 items-center gap-3 no-underline"
                    onClick={() => setMenuOpen(false)}
                >
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-200">
                        <ShieldCheck size={25} />
                    </span>
                    <span>
                        <span className="block text-lg font-extrabold tracking-tight text-slate-900">
                            RTO Connect
                        </span>
                        <span className="block text-xs text-slate-500">
                            Your licensing portal
                        </span>
                    </span>
                </Link>

                <button
                    type="button"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 lg:hidden"
                    aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={menuOpen}
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    {menuOpen ? <X size={22} /> : <Menu size={22} />}
                </button>

                <div className="hidden items-center gap-1 lg:flex">
                    {LINKS.map(({ label, to, icon: Icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={to === '/'}
                            className={({ isActive }) =>
                                `flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold no-underline transition ${
                                    isActive
                                        ? 'bg-blue-50 text-blue-700'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-blue-700'
                                }`
                            }
                        >
                            <Icon size={17} />
                            {label}
                        </NavLink>
                    ))}
                </div>

                <div className="relative hidden lg:block">
                    <button
                        type="button"
                        onClick={() => setAccountOpen(!accountOpen)}
                        className="flex items-center gap-2 rounded-xl border border-slate-200 p-2 transition hover:bg-slate-50"
                        aria-expanded={accountOpen}
                    >
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                            {user?.FullName?.charAt(0)?.toUpperCase() || <UserRound size={18} />}
                        </span>
                        <span className="max-w-28 truncate text-sm font-semibold text-slate-800">
                            {user?.FullName || 'My Account'}
                        </span>
                        <ChevronDown size={16} className="text-slate-500" />
                    </button>

                    {accountOpen && (
                        <div className="absolute right-0 top-full mt-3 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                            <div className="border-b border-slate-100 px-3 py-3">
                                <p className="truncate text-sm font-bold text-slate-900">
                                    {user?.FullName || 'User'}
                                </p>
                                <p className="mt-1 text-xs text-slate-500">RTO Connect account</p>
                            </div>

                            <Link
                                to="/applications"
                                onClick={() => setAccountOpen(false)}
                                className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 no-underline hover:bg-slate-50"
                            >
                                <FileText size={17} />
                                My Applications
                            </Link>

                            <button
                                type="button"
                                onClick={handleLogout}
                                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-600 hover:bg-red-50"
                            >
                                <LogOut size={17} />
                                Sign out
                            </button>
                        </div>
                    )}
                </div>
            </nav>

            {menuOpen && (
                <div className="border-t border-slate-200 bg-white p-4 lg:hidden">
                    <div className="mx-auto max-w-7xl space-y-1">
                        {LINKS.map(({ label, to, icon: Icon }) => (
                            <NavLink
                                key={to}
                                to={to}
                                end={to === '/'}
                                onClick={() => setMenuOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold no-underline ${
                                        isActive
                                            ? 'bg-blue-50 text-blue-700'
                                            : 'text-slate-700 hover:bg-slate-50'
                                    }`
                                }
                            >
                                <Icon size={19} />
                                {label}
                            </NavLink>
                        ))}

                        <div className="mt-3 border-t border-slate-100 pt-3">
                            <p className="px-4 py-2 text-sm font-semibold text-slate-500">
                                {user?.FullName || 'My Account'}
                            </p>
                            <Link
                                to="/applications"
                                onClick={() => setMenuOpen(false)}
                                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-700 no-underline hover:bg-slate-50"
                            >
                                <FileText size={18} />
                                My Applications
                            </Link>
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-red-600 hover:bg-red-50"
                            >
                                <LogOut size={18} />
                                Sign out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    )
}
