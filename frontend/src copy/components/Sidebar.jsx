import { Protect, useClerk, useUser } from '@clerk/clerk-react'
import { Eraser, FileText, Hash, House, Icon, Image, LogOut, Scissors, SquarePen, Users } from 'lucide-react'
import React from 'react'
import { NavLink } from 'react-router-dom'


const navItems = [
    { to: '/ai', label: 'Dashboard', Icon: House },
    { to: '/ai/Write-article', label: 'Write_Article', Icon: SquarePen },
    { to: '/ai/Blog-titles', label: 'Blog Titles', Icon: Hash },
    { to: '/ai/Generate-images', label: 'Generate Images', Icon: Image },
    { to: '/ai/Review-resume', label: 'Rview Resume', Icon: Eraser },
    { to: '/ai/Remove-object', label: 'Remove Object', Icon: Scissors },
    { to: '/ai/Remove-background', label: 'Remove Background', Icon: FileText },
    { to: '/ai/community', label: 'Community', Icon: Users },
]


const Sidebar = ({ sidebar, setSidebar }) => {
    const { user } = useUser()
    const { signOut, openUserProfile } = useClerk()
    return (
        <div className={`w-60 bg-white border-r border-gray-500 flex flex-col justify-between items-center max-sm:absolute top-14 bottom-0 ${sidebar ? 'translate-x-0' : 'max-sm:-translate-x-full'} transition-all duration-300 ease-in-out`}>
            <div className='my-8 w-full'>
                <img src={user.imageUrl} alt="User avatar" className='w-13 rounded-full mx-auto' />
                <h1 className='text-center mt-1 '>{user.fullName}</h1>
                <div className='mt-4 px-5 text-sm text-black font-medium'>
                    {navItems.map(({ to, label, Icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={to === '/ai'}
                            onClick={() => setSidebar(false)}
                            className={({ isActive }) =>
                                isActive
                                    ? 'bg-gradient-to-r from-[#4f46e5] to-[#6366f1] text-black p-2 rounded flex items-center gap-2'
                                    : 'p-2 flex items-center gap-2'
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <Icon className={`w-5 h-5 ${isActive ? 'text-black' : ''}`} />
                                    <span>{label}</span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </div>
            </div>
            <div className='w-full border-gray-300 flex items-center justify-between px-5' >
                <div onClick={() => { openUserProfile }} className='w-9 flex items-center gap-3 cursor-pointer'>
                    <img src={user.imageUrl} alt="" className="w-8 rounded-full" />
                    <div>
                        <h1 className='text-xs text-gray-700 '>
                            {user.fullName}
                        </h1>
                        <p className='text-xs text-gray-600 '>
                            <Protect plan="premium" fallback="Free">Premium</Protect>
                            Plan
                        </p>
                    </div>
                </div>
                <LogOut onClick={signOut} className='w-4.5 text-400 hover: text-gray-700 transition cursor-pointer' />
            </div>
        </div>
    );
};


export default Sidebar