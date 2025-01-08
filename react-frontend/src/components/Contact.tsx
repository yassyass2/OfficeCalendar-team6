import React, { useState } from 'react';

const ContactForm: React.FC = () => {

    const [fullName, setFullName] = useState<string>('');
    const [emailAddress, setEmailAddress] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');

    const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setView(e.target.value);
    };

    const [textareaView, setTextarea] = useState('aa');
    const handleTextarea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTextarea(e.target.value);
    }

    const [selectView, setView] = useState('');
    const handleSubmit = () => {
        return;
    };

    return (
        <section className="row">
            <div className="col-4 contactform-container position-absolute top-50 start-50 translate-middle text-center align-items-center">
                <h1>Contact</h1>
                <br />
                <form onSubmit={handleSubmit}>
                    <select value={selectView} onChange={handleSelect}>
                        <option value="" selected hidden>--- Please choose an option ---</option>
                        <option value="Account & Login issues">Account & Login issues</option>
                        <option value="Feedback & Suggestions">Feedback & Suggestions</option>
                        <option value="Privacy & Data Protection">Privacy & Data Protection</option>
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Complaint">Complaint</option>
                    </select>
                    <input
                        type="text"
                        placeholder="*Full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        autoComplete="off"
                    />
                    <input
                        type="email"
                        placeholder="*E-mail"
                        value={emailAddress}
                        onChange={(e) => setEmailAddress(e.target.value)}
                        required
                        autoComplete="off"
                    />
                    <input
                        type="tel"
                        placeholder="Phone number (optional)"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        autoComplete="off"
                    />
                    <textarea
                        placeholder="*Your message"
                        onChange={handleTextarea}
                        required
                        autoComplete="off"
                    >
                    </textarea>
                    <span className="required-notice">*All fields are required unless marked as 'Optional'</span>
                    <br />
                    <button className="btn-primary" type="submit">
                        Send message
                        <i className="fa-solid fa-caret-right"></i>
                    </button>
                </form>
            </div>
        </section >
    );
}

export default ContactForm;
