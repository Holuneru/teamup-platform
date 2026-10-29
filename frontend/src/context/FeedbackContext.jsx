import { createContext, useCallback, useContext, useRef, useState } from "react";
import { CircleCheck, CircleX, Info, X } from "lucide-react";
import "../styles/feedback.css";

const FeedbackContext = createContext(null);
let nextToastId = 0;

const toastIcons = {
    success: CircleCheck,
    error: CircleX,
    info: Info
};

export function FeedbackProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const [confirmation, setConfirmation] = useState(null);
    const pendingConfirmation = useRef(null);

    const notify = useCallback((message, type = "error") => {
        const id = ++nextToastId;
        setToasts(current => [...current, { id, message, type }].slice(-4));
        window.setTimeout(() => {
            setToasts(current => current.filter(toast => toast.id !== id));
        }, 4500);
    }, []);

    const dismissToast = useCallback(id => {
        setToasts(current => current.filter(toast => toast.id !== id));
    }, []);

    const confirm = useCallback((message, options = {}) => new Promise(resolve => {
        pendingConfirmation.current = resolve;
        setConfirmation({
            title: options.title || "Подтвердите действие",
            message,
            confirmLabel: options.confirmLabel || "Продолжить",
            variant: options.variant || "danger"
        });
    }), []);

    const resolveConfirmation = useCallback(result => {
        pendingConfirmation.current?.(result);
        pendingConfirmation.current = null;
        setConfirmation(null);
    }, []);

    return (
        <FeedbackContext.Provider value={{ notify, confirm }}>
            {children}
            <div className="feedback-toast-stack" aria-live="polite" aria-relevant="additions">
                {toasts.map(toast => {
                    const Icon = toastIcons[toast.type] || Info;
                    return (
                        <div className={`feedback-toast feedback-${toast.type}`} key={toast.id} role={toast.type === "error" ? "alert" : "status"}>
                            <Icon size={19} />
                            <span>{toast.message}</span>
                            <button onClick={() => dismissToast(toast.id)} aria-label="Закрыть уведомление">
                                <X size={15} />
                            </button>
                        </div>
                    );
                })}
            </div>
            {confirmation && (
                <div className="feedback-dialog-backdrop" onMouseDown={event => {
                    if (event.target === event.currentTarget) resolveConfirmation(false);
                }}>
                    <section className="feedback-dialog" role="alertdialog" aria-modal="true" aria-labelledby="feedback-dialog-title">
                        <div className="feedback-dialog-mark"><CircleX size={21} /></div>
                        <h2 id="feedback-dialog-title">{confirmation.title}</h2>
                        <p>{confirmation.message}</p>
                        <div className="feedback-dialog-actions">
                            <button className="feedback-dialog-cancel" onClick={() => resolveConfirmation(false)}>
                                Отмена
                            </button>
                            <button
                                className={`feedback-dialog-confirm ${confirmation.variant === "primary" ? "primary" : "danger"}`}
                                onClick={() => resolveConfirmation(true)}
                            >
                                {confirmation.confirmLabel}
                            </button>
                        </div>
                    </section>
                </div>
            )}
        </FeedbackContext.Provider>
    );
}

export function useFeedback() {
    const context = useContext(FeedbackContext);
    if (!context) {
        throw new Error("useFeedback must be used within FeedbackProvider");
    }
    return context;
}
