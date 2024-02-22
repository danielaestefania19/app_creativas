import React, { useState, useContext } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate aquí
import { AuthContext } from './AuthContext';

const Formulario = () => {
    const [form, setForm] = useState({
        username: "",
        profile_picture: null, // Inicializa a null
        about: null, // Inicializa a null
    });
    const { whoami, actor, setIsUserAuthenticated } = useContext(AuthContext); // 
    const navigate = useNavigate(); // Usa useNavigate aquí

    const handleChange = (e) => {
        if (e.target.name === 'profile_picture') {
            setForm({ ...form, [e.target.name]: e.target.files[0] });
        } else {
            setForm({ ...form, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.username) {
            alert('Username is required');
            return;
        }

        let profile_picture = form.profile_picture;

        if (form.profile_picture) {
            const formData = new FormData();
            formData.append("file", form.profile_picture);

            const API_KEY = import.meta.env.VITE_PINATA_API_KEY;
            const API_SECRET = import.meta.env.VITE_PINATA_API_SECRET;
            const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

            try {
                const response = await axios.post(
                    url,
                    formData,
                    {
                        maxContentLength: "Infinity",
                        headers: {
                            "Content-Type": `multipart/form-data;boundary=${formData._boundary}`,
                            'pinata_api_key': API_KEY,
                            'pinata_secret_api_key': API_SECRET
                        }
                    }
                );

                profile_picture = response.data.IpfsHash;
                console.log(response.data.IpfsHash)
            } catch (error) {
                alert('Error uploading image to Pinata');
                console.error(error);
                return;
            }
        }

        const profile = {
            username: form.username,
            profile_picture: profile_picture || "", // Usa "" si no se proporciona
            about: form.about || "" // Usa "" si no se proporciona
        };
        
        

        try {
            await actor.create_profile(profile);
            const hasProfile = await actor.has_profile();
            if (hasProfile) {
                setIsUserAuthenticated(true); // Establece isUserAuthenticated en true
                navigate('/'); // Navega a Home
            }
        } catch (error) {
            alert('Error creating profile');
            console.error(error);
        }
    };
    
    return (
        <div className="flex items-center justify-center h-screen bg-pink-100">
            <form className="p-10 bg-white rounded shadow-md w-1/3" onSubmit={handleSubmit}>
                <h2 className="mb-5 text-3xl font-semibold text-center text-pink-500">Formulario</h2>
                <div className="mb-4">
                    <label className="font-bold text-gray-700" htmlFor="username">Username</label>
                    <input className="w-full px-3 py-2 mt-1 text-gray-700 border rounded-md focus:outline-none focus:shadow-outline" type="text" name="username" id="username" onChange={handleChange} placeholder="Enter username" required />
                </div>
                <div className="mb-4">
                    <label className="font-bold text-gray-700" htmlFor="profile_picture">Profile Picture</label>
                    <input className="w-full px-3 py-2 mt-1 text-gray-700 border rounded-md focus:outline-none focus:shadow-outline" type="file" name="profile_picture" id="profile_picture" onChange={handleChange} placeholder="Select photo" />
                </div>
                <div className="mb-6">
                    <label className="font-bold text-gray-700" htmlFor="about">About</label>
                    <textarea className="w-full px-3 py-2 mt-1 text-gray-700 border rounded-md focus:outline-none focus:shadow-outline" name="about" id="about" onChange={handleChange} placeholder="Tell us about yourself"></textarea>
                </div>
                <button className="w-full px-3 py-2 text-white bg-pink-500 rounded-md hover:bg-pink-600 focus:outline-none focus:shadow-outline" type="submit">Create</button>
            </form>
        </div>
    );
};

export default Formulario;
