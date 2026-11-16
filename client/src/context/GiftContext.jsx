import { createContext, useEffect, useState } from 'react';

export const GiftContext = createContext();

const EMPTY_FORM = {
    forGender: '',
    age: '',
    styles: '',
    DedicationPersonalization: '',
    category: '',
    event: '',
    relationship: '',
    color: '',
    price: ''
};

// תשובות השאלון והתוצאות נשמרות ב-sessionStorage (רק לחלון הנוכחי),
// כדי שלא ילכו לאיבוד ברענון או כשאורח עוצר באמצע כדי להתחבר.
const load = (key, fallback) => {
    try {
        const saved = sessionStorage.getItem(key);
        return saved ? JSON.parse(saved) : fallback;
    } catch {
        return fallback;
    }
};
const save = (key, value) => {
    try {
        sessionStorage.setItem(key, JSON.stringify(value));
    } catch {
        // אחסון חסום או מלא – האתר ממשיך לעבוד, רק בלי שמירה
    }
};

export function GiftProvider({ children }) {

    const [formData, setFormData] = useState(() => load('gifter.formData', EMPTY_FORM));

    const [matchingGifts, setMatchingGifts] = useState(() => load('gifter.matchingGifts', []));

    useEffect(() => save('gifter.formData', formData), [formData]);
    useEffect(() => save('gifter.matchingGifts', matchingGifts), [matchingGifts]);

    return (
        <GiftContext.Provider value={{
            formData,
            setFormData,
            matchingGifts,
            setMatchingGifts
        }}>
            {children}
        </GiftContext.Provider>
    );
}
