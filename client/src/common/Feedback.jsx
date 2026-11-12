import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

const FeedbackContext = createContext(null);

const FeedbackIcon = ({ type, className = '' }) => {
    if (type === 'success') {
        return (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <path d="m8 12 2.5 2.5L16 9" />
            </svg>
        );
    }

    if (type === 'error') {
        return (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8v4m0 4h.01" />
            </svg>
        );
    }

    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 11v5m0-8h.01" />
        </svg>
    );
};

export const FeedbackProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const [dialog, setDialog] = useState(null);
    const timersRef = useRef(new Map());
    const nextToastIdRef = useRef(0);
    const confirmResolverRef = useRef(null);
    const cancelButtonRef = useRef(null);
    const previousFocusRef = useRef(null);
    const dialogWasOpenRef = useRef(false);

    const removeToast = useCallback((id) => {
        const timer = timersRef.current.get(id);
        if (timer) {
            clearTimeout(timer);
            timersRef.current.delete(id);
        }
        setToasts((currentToasts) => currentToasts.filter((item) => item.id !== id));
    }, []);

    const toast = useCallback((message, type = 'success') => {
        const id = nextToastIdRef.current++;
        setToasts((currentToasts) => [...currentToasts, { id, message, type }]);
        const timer = setTimeout(() => removeToast(id), 3500);
        timersRef.current.set(id, timer);
    }, [removeToast]);

    const finishConfirm = useCallback((confirmed) => {
        const resolve = confirmResolverRef.current;
        confirmResolverRef.current = null;
        setDialog(null);
        if (resolve) resolve(confirmed);
    }, []);

    const confirm = useCallback(({
        title = 'אישור',
        message = '',
        confirmText = 'אישור',
        cancelText = 'ביטול',
        danger = false
    } = {}) => new Promise((resolve) => {
        if (confirmResolverRef.current) {
            confirmResolverRef.current(false);
        } else {
            previousFocusRef.current = document.activeElement;
        }
        confirmResolverRef.current = resolve;
        setDialog({ title, message, confirmText, cancelText, danger });
    }), []);

    useEffect(() => {
        if (dialog) {
            dialogWasOpenRef.current = true;
            cancelButtonRef.current?.focus();
            return;
        }

        if (dialogWasOpenRef.current) {
            dialogWasOpenRef.current = false;
            const previousElement = previousFocusRef.current;
            previousFocusRef.current = null;
            previousElement?.focus?.();
        }
    }, [dialog]);

    useEffect(() => () => {
        timersRef.current.forEach((timer) => clearTimeout(timer));
        timersRef.current.clear();
        if (confirmResolverRef.current) {
            confirmResolverRef.current(false);
            confirmResolverRef.current = null;
        }
    }, []);

    const handleDialogKeyDown = (event) => {
        if (event.key === 'Escape') {
            event.preventDefault();
            finishConfirm(false);
        }
    };

    return (
        <FeedbackContext.Provider value={{ toast, confirm }}>
            {children}
            <div className="ui-toast-stack" role="status" aria-live="polite">
                {toasts.map(({ id, message, type }) => (
                    <div
                        key={id}
                        className={`ui-toast ui-toast--${type}`}
                        role={type === 'error' ? 'alert' : undefined}
                    >
                        <FeedbackIcon type={type} className="ui-toast__icon" />
                        <p className="ui-toast__message">{message}</p>
                        <button
                            type="button"
                            className="ui-toast__close"
                            aria-label="סגירת הודעה"
                            onClick={() => removeToast(id)}
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>

            {dialog && (
                <div
                    className="ui-modal-overlay"
                    onClick={(event) => {
                        if (event.target === event.currentTarget) finishConfirm(false);
                    }}
                >
                    <div
                        className="ui-modal"
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby="ui-modal-title"
                        aria-describedby="ui-modal-message"
                        tabIndex={-1}
                        onKeyDown={handleDialogKeyDown}
                    >
                        <span className={`ui-modal__icon ${dialog.danger ? 'ui-modal__icon--danger' : ''}`}>
                            <FeedbackIcon type={dialog.danger ? 'error' : 'info'} />
                        </span>
                        <h2 className="ui-modal__title" id="ui-modal-title">{dialog.title}</h2>
                        <p className="ui-modal__message" id="ui-modal-message">{dialog.message}</p>
                        <div className="ui-modal__actions">
                            <button
                                type="button"
                                className={`ui-modal__confirm ${dialog.danger ? 'ui-modal__confirm--danger' : ''}`}
                                onClick={() => finishConfirm(true)}
                            >
                                {dialog.confirmText}
                            </button>
                            <button
                                ref={cancelButtonRef}
                                type="button"
                                className="ui-modal__cancel"
                                onClick={() => finishConfirm(false)}
                            >
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
    const feedback = useContext(FeedbackContext);
    if (!feedback) {
        throw new Error('useFeedback must be used within a FeedbackProvider');
    }
    return feedback;
};
