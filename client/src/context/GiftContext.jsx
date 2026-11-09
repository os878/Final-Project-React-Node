import { createContext, useState } from 'react';

export const GiftContext = createContext();

export function GiftProvider({ children }) {

    const [formData, setFormData] = useState({
        forGender: '',
        age: '',
        styles: '',
        DedicationPersonalization: '',
        category: '',
        event: '',
        relationship: '',
        color: '',
        price: ''
    });

    const [matchingGifts, setMatchingGifts] = useState([]);

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