import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import { useFeedback } from './Feedback';

// ===== "הרשמה עצלה": אורח מסתובב חופשי, וההתחברות נדרשת רק ברגע של פעולה אישית =====
// שימוש:
//   const { isLoggedIn, requireLogin } = useLoginGate();
//   if (!(await requireLogin('כדי לשמור את המתנה, התחברו או הירשמו'))) return;
//
// requireLogin מחזיר true אם המשתמש מחובר כלקוח. אם לא מחובר – פותח חלון קצר עם הסבר,
// ואם בחר להתחבר מעביר לדף ההתחברות ושומר את הדף הנוכחי, כדי לחזור אליו אחרי הכניסה.
// ספק או מנהל שמסתכלים בקטלוג – מקבלים הודעה שהפעולה מיועדת ללקוחות.

export const isLoggedIn = () => Boolean(localStorage.getItem('token'));

export const useLoginGate = () => {
    const { confirm, toast } = useFeedback();
    const navigate = useNavigate();
    const location = useLocation();
    // ה-role מגיע מה-Layout (אחרי שהשרת אישר אותו). מחוץ ל-Layout – אין
    const role = useOutletContext()?.role;

    const requireLogin = async (message) => {
        if (isLoggedIn()) {
            if (role && role !== 'customer') {
                toast('שמירה למועדפים, פניות לספקים ורעיונות AI – ללקוחות בלבד', 'info');
                return false;
            }
            return true;
        }

        const ok = await confirm({
            title: 'רק עוד צעד קטן',
            message,
            confirmText: 'להתחברות או הרשמה',
            cancelText: 'אחר כך',
        });
        if (ok) {
            navigate('/login', { state: { from: location.pathname + location.search } });
        }
        return false;
    };

    return { isLoggedIn, requireLogin };
};

// כתובת חזרה בטוחה אחרי התחברות: רק דף פנימי באתר (מתחיל ב-"/" אחד), אחרת – null
export const safeReturnPath = (from) =>
    typeof from === 'string' && from.startsWith('/') && !from.startsWith('//') && !from.startsWith('/login')
        ? from
        : null;
