import { useState } from "react";
import { register } from "../api/auth";

export default function Register() {
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await register(form);
            console.log("OK:", res.data);
            alert("User created!");
        } catch (err) {
            console.log(err);
            alert("Error");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input name="firstName" placeholder="First name" onChange={handleChange} />
            <input name="lastName" placeholder="Last name" onChange={handleChange} />
            <input name="email" placeholder="Email" onChange={handleChange} />
            <input name="password" placeholder="Password" onChange={handleChange} type="password" />

            <button type="submit">Register</button>
        </form>
    );
}