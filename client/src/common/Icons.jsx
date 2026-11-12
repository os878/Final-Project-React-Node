// אייקונים משותפים (קו פשוט, בסגנון האתר) – לשימוש בכל הדפים
const Svg = ({ children, className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {children}
    </svg>
)

export const UserIcon = (p) => <Svg {...p}><circle cx="12" cy="8" r="4" /><path d="M5 21v-2a7 7 0 0 1 14 0v2" /></Svg>
export const MailIcon = (p) => <Svg {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></Svg>
export const PhoneIcon = (p) => <Svg {...p}><path d="M5 3h4l2 5-3 2a16 16 0 0 0 6 6l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2Z" /></Svg>
export const StoreIcon = (p) => <Svg {...p}><path d="M4 10v10h16V10" /><path d="M3 10 5 4h14l2 6Z" /><path d="M10 20v-5h4v5" /></Svg>
export const EditIcon = (p) => <Svg {...p}><path d="M15 4l5 5L9 20H4v-5Z" /><path d="M13 6l5 5" /></Svg>
export const TrashIcon = (p) => <Svg {...p}><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" /></Svg>
export const CloseIcon = (p) => <Svg {...p}><path d="M6 6l12 12M18 6 6 18" /></Svg>
export const PlusIcon = (p) => <Svg {...p}><path d="M12 5v14M5 12h14" /></Svg>
export const CheckIcon = (p) => <Svg {...p}><path d="M5 12l4 4L19 6" /></Svg>
export const GiftIcon = (p) => <Svg {...p}><rect x="4" y="10" width="16" height="10" rx="1.5" /><path d="M3 7h18v3H3zM12 7v13M12 7c-1.5-3-5-3.5-5-1.5S10 7 12 7Zm0 0c1.5-3 5-3.5 5-1.5S14 7 12 7Z" /></Svg>
export const UsersIcon = (p) => <Svg {...p}><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20v-1.5a6.5 6.5 0 0 1 13 0V20" /><circle cx="17" cy="9" r="2.8" /><path d="M16 14a5 5 0 0 1 5.5 5V20" /></Svg>
export const ShieldIcon = (p) => <Svg {...p}><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6Z" /><path d="M12 9v6M9 12h6" /></Svg>