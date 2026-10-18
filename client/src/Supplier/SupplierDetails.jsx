const SupplierDetails = ({ supp }) => {
    const [isEditing, setIsEditing] = (false)
    const [name, setName] = useState(supp.name)
    const [email, setEmail] = useState(supp.email)
    const [phone, setPhone] = useState(supp.phone)
    const [companyName, setCompanyName] = useState(supp.companyName)


    const submitForm = async (e) => {
        e.preventDefault()
        try {
            const { data } = await Axios.put("http://localhost:7001/api/supplier/", {
                id: supp._id,
                name: name,
                email: email,
                phone: phone,
                companyName: companyName
            })
            fetchTasks()
            // setName("")
            // setEmail("")
            // setPhone ("")
            // setCompanyName ("")
            setIsEditing(false)
        } catch (error) {
            console.error("Error updating supplier:", error)
        }
    }
    return (
        <>

            {/* <div className="supplier-container"> */}
            <div className="header-section">
                <h2>פרטי ספק</h2>
                {isEditing ? (
                    <div className="button-group">
                        <button className="save-btn" onClick={handleSave}>שמירת שינויים</button>
                        <button className="cancel-btn" onClick={() => setIsEditing(false)}>ביטול</button>
                    </div>
                ) : (
                    <button className="edit-btn" onClick={() => setIsEditing(true)}>עריכת ספק</button>
                )}
            </div>
            <div className="field-group">
                <label>שם הספק:</label>
                <div className={`info-box ${isEditing ? 'editing' : ''}`}>
                    {isEditing ? (
                        <input
                            type="text"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    ) : (
                        <span>{name}</span>
                    )}
                </div>
            </div>
            <div className="field-group">
                <label>שם החברה:</label>
                <div className={`info-box ${isEditing ? 'editing' : ''}`}>
                    {isEditing ? (
                        <input
                            type="text"
                            name="companyName"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                        />
                    ) : (
                        <span>{companyName}</span>
                    )}
                </div>
            </div>
            <div className="field-group">
                <label>דואר אלקטרוני:</label>
                <div className={`info-box ${isEditing ? 'editing' : ''}`}>
                    {isEditing ? (
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    ) : (
                        <span>{email}</span>
                    )}
                </div>
            </div>
            <div className="field-group">
                <label>טלפון:</label>
                <div className={`info-box ${isEditing ? 'editing' : ''}`}>
                    {isEditing ? (
                        <input
                            type="tel"
                            name="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)} 
                        />
                    ) : (
                        <span>{phone}</span>
                    )}
                </div>
            </div>
        </>
    )
}
export default SupplierDetails