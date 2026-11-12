import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

// ===== מערכת הודעות ואישורים לכל האתר =====
// שימוש בכל קומפוננטה:
//   const { toast, confirm } = useFeedback();
//   toast('נשמר בהצלחה!', 'success')            // 'success' | 'error' | 'info'
//   const ok = await confirm({ title, message, confirmText, cancelText, danger: true });

const FeedbackContext = createContext(null);

const Svg = ({ children }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {children}
    </svg>
);
const ICONS = {
    success: <Svg><circle cx="12" cy="12" r="9" /><path d="M8 12.5l2.7 2.7L16 9.8" /></Svg>,
    error: <Svg><circle cx="12" cy="12" r="9" /><path d="M12 7.5v5.5M12 16.5h.01" /></Svg>,
    info: <Svg><circle cx="12" cy="12" r="9" /><path d="M12 11v5.5M12 7.5h.01" /></Svg>,
    danger: <Svg><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" /></Svg>,
    question: <Svg><circle cx="12" cy="12" r="9" /><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5v.2M12 16.5h.01" /></Svg>,
    close: <Svg><path d="M6 6l12 12M18 6 6 18" /></Svg>,
};

let nextId = 1;

export const FeedbackProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const [dialog, setDialog] = useState(null); // { title, message, confirmText, cancelText, danger, resolve }
    const cancelRef = useRef(null);
    const lastFocusRef = useRef(null);

    // ---------- הודעות קופצות ----------
    const removeToast = useCallback((id) => {
        setToasts((list) => list.filter((t) => t.id !== id));
    }, []);

    const toast = useCallback((message, type = 'success') => {
        const id = nextId++;
        setToasts((list) => [...list, { id, message, type }]);
        setTimeout(() => removeToast(id), 3500);
    }, [removeToast]);

    // ---------- חלון אישור ----------
    const confirm = useCallback((options = {}) => {
        lastFocusRef.current = document.activeElement;
        return new Promise((resolve) => {
            setDialog({
                title: options.title || 'אישור פעולה',
                message: options.message || '',
                confirmText: options.confirmText || 'אישור',
                cancelText: options.cancelText || 'ביטול',
                danger: Boolean(options.danger),
                resolve,
            });
        });
    }, []);

    const closeDialog = (result) => {
        if (dialog) dialog.resolve(result);
        setDialog(null);
        // החזרת הפוקוס לכפתור שפתח את החלון
        if (lastFocusRef.current && lastFocusRef.current.focus) lastFocusRef.current.focus();
    };

    // כשהחלון נפתח – הפוקוס עובר ל"ביטול" (הבחירה הבטוחה)
    useEffect(() => {
        if (dialog && cancelRef.current) cancelRef.current.focus();
    }, [dialog]);

    return (
        <FeedbackContext.Provider value={{ toast, confirm }}>
            {children}

            {/* הודעות קופצות */}
            <div className="ui-toasts" dir="rtl">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className={`ui-toast ui-toast--${t.type}`}
                        role={t.type === 'error' ? 'alert' : 'status'}
                        aria-live={t.type === 'error' ? 'assertive' : 'polite'}
                    >
                        <span className="ui-toast__icon">{ICONS[t.type] || ICONS.info}</span>
                        <p className="ui-toast__text">{t.message}</p>
                        <button type="button" className="ui-toast__close" onClick={() => removeToast(t.id)} aria-label="סגירת ההודעה">
                            {ICONS.close}
                        </button>
                    </div>
                ))}
            </div>

            {/* חלון אישור */}
            {dialog && (
                <div className="ui-overlay" onClick={() => closeDialog(false)}>
                    <div
                        className="ui-dialog"
                        dir="rtl"
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby="uiDialogTitle"
                        aria-describedby="uiDialogText"
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => { if (e.key === 'Escape') closeDialog(false); }}
                    >
                        <span className={`ui-dialog__icon ${dialog.danger ? 'ui-dialog__icon--danger' : ''}`}>
                            {dialog.danger ? ICONS.danger : ICONS.question}
                        </span>
                        <h2 id="uiDialogTitle" className="ui-dialog__title">{dialog.title}</h2>
                        <p id="uiDialogText" className="ui-dialog__text">{dialog.message}</p>
                        <div className="ui-dialog__actions">
                            <button
                                type="button"
                                className={`ui-btn ${dialog.danger ? 'ui-btn--danger' : 'ui-btn--main'}`}
                                onClick={() => closeDialog(true)}
                            >
                                {dialog.confirmText}
                            </button>
                            <button type="button" ref={cancelRef} className="ui-btn ui-btn--ghost" onClick={() => closeDialog(false)}>
                                {dialog.cancelText}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </FeedbackContext.Provider>
    );
};

export const useFeedback = () => {
    const ctx = useContext(FeedbackContext);
    if (!ctx) {
        // אם שכחו לעטוף ב-FeedbackProvider – לא קורסים, חוזרים להתנהגות הרגילה של הדפדפן
        return {
            toast: (message) => window.alert(message),
            confirm: async ({ message } = {}) => window.confirm(message),
        };
    }
    return ctx;
};

export default FeedbackProvider;