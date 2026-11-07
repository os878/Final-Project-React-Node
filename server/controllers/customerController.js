const Customer = require("../models/customer")
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

// const createNewCustomer = async (req, res) => {
//     const { name, password, username, email, phone } = req.body
//     if (!name || !password || !username || !email || !phone) { // Confirm data
//         return res.status(400).json({ message: 'name, password, username, email and phone are required' })
//     }
//     const customer = await Customer.create({
//         name, password, username, email, phone
//     })
//     if (customer) { // Created
//         return res.status(201).json({ message: 'New Customer created' })
//     } else {
//         return res.status(400).json({ message: 'Invalid Customer data' })
//     }
// }

const findByIdC = async (req, res) => {
    const id = req.user._id

    const customer = await Customer.findById(id).select('-password')

    if (!customer) {
        return res.status(404).json({ message: 'Customer not found' })
    }

    res.json(customer)
}

const getAllCustomers = async (req, res) => {
    const customers = await Customer.find().select('-password').lean()

    if (!customers?.length) {
        return res.status(400).json({ message: 'No customer found' })
    }
    res.json(customers)
}

const updateCustomer = async (req, res) => {
    const { id, name, username, email, phone } = req.body;

    if (!id || !name || !username || !email || !phone) {
        return res.status(400).json({ message: 'id, name, username, email and phone are required' });
    }

    try {
        const filter = req.user.role === 'Admin' 
            ? { _id: id } 
            : { _id: id, _id: req.user._id };

        const customer = await Customer.findOne(filter).exec();

        if (!customer) {
            return res.status(404).json({ message: 'the customer not found' });
        }

        customer.name = name;
        customer.username = username;
        customer.email = email;
        customer.phone = phone;

        const updatedCustomer = await customer.save();

        // אם העדכון בוצע על ידי מנהל, נשלח מייל עדכון ללקוח
        if (req.user.role === 'Admin') {
            try {
                await resend.emails.send({
                    from: 'onboarding@resend.dev', // ניתן להחליף לכתובת הדומיין המאומת שלך
                    to: updatedCustomer.email,
                    subject: 'עדכון פרטי החשבון שלך במערכת',
                    html: `
                <div dir="rtl" style="font-family: Arial, sans-serif; direction: rtl; text-align: right; color: #333333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
                    <h2 style="color: #2c3e50; margin-bottom: 10px;">שלום ${updatedCustomer.name},</h2>
                    <p style="font-size: 16px; line-height: 1.5;">פרטי החשבון שלך עודכנו בהצלחה במערכת על ידי מנהל.</p>
                    
                    <div style="background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 6px; padding: 15px; margin: 20px 0;">
                        <h3 style="margin-top: 0; color: #34495e; border-bottom: 1px solid #eee; padding-bottom: 8px;">הפרטים המעודכנים:</h3>
                        <ul style="list-style-type: none; padding-right: 0; margin: 0; line-height: 1.8;">
                            <li><strong>שם מלא:</strong> ${updatedCustomer.name}</li>
                            <li><strong>שם משתמש:</strong> ${updatedCustomer.username}</li>
                            <li><strong>אימייל:</strong> ${updatedCustomer.email}</li>
                            <li><strong>טלפון:</strong> ${updatedCustomer.phone}</li>
                        </ul>
                    </div>

                    <p style="font-size: 14px; color: #7f8c8d;">אם לא ביקשת שינוי זה, אנא פנה לתמיכה בהקדם.</p>
                </div>
            `
                });
            } catch (emailError) {
                // רישום שגיאה בשליחת המייל מבלי להכשיל את כל פעולת העדכון
                console.error('Error sending email via Resend:', emailError);
            }
        }

        return res.json({
            message: `'${updatedCustomer.name}' updated`,
            customer: updatedCustomer
        });
    } catch (error) {
        if (error.name === 'ValidationError' || error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid customer data' });
        }
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }
        return res.status(500).json({ message: 'Unable to update customer' });
    }
};

const deleteCustomer = async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ message: 'Customer id is required' });
    }

    try {
        // מנהל יכול למחוק כל לקוח, משתמש רגיל יכול למחוק רק את החשבון של עצמו
        const filter = req.user.role === 'Admin' 
            ? { _id: id } 
            : { _id: id, _id: req.user._id };

        const customer = await Customer.findOne(filter).exec();

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        const customerName = customer.name;
        const customerId = customer._id;

        await customer.deleteOne();

        return res.json({
            message: `Customer '${customerName}' ID ${customerId} deleted`,
            id: customerId
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid customer ID' });
        }
        return res.status(500).json({ message: 'Unable to delete customer' });
    }
};

module.exports = {
    // createNewCustomer,
    getAllCustomers,
    updateCustomer,
    deleteCustomer,
    findByIdC
}