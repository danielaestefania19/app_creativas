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
    const { actor_messages, setIsUserAuthenticated, setShowForm } = useContext(AuthContext); // 


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
            await actor_messages.create_profile(profile);
            const hasProfile = await actor_messages.has_profile();
            if (hasProfile) {
                setIsUserAuthenticated(true); // Establece isUserAuthenticated en true
                setShowForm(false); // Oculta el formulario
            }
        } catch (error) {
            alert('Error creating profile');
            console.error(error);
        }
    };

    const handleCloseModal = () => {
        setShowForm(false);
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-[#323335] bg-opacity-50 flex items-center justify-center z-50">
            <form className="relative p-10 bg-[#323335] rounded shadow-md w-1/3" onSubmit={handleSubmit}>
                <button className="absolute top-0 right-0 mt-4 mr-4 text-gray-600 hover:text-gray-800" onClick={handleCloseModal}>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
                <h2 className="mb-5 text-3xl font-semibold text-center text-white">Welcome!!</h2>
                <div className="mb-4">
                    <label className="block mb-2 font-bold text-white" htmlFor="username">Username</label>
                    <input className="w-full px-3 py-2 text-gray-700 border-black rounded-md focus:outline-none focus:shadow-outline bg-[#0f0f0f]" type="text" name="username" id="username" onChange={handleChange} placeholder="Enter username" required />
                </div>
                <div className="mb-4">
                    <label className="block mb-2 font-bold text-white" htmlFor="profile_picture">Profile Picture</label>
                    <input className="w-full px-3 py-2 text-gray-700 border-black rounded-md focus:outline-none focus:shadow-outline bg-[#0f0f0f]" type="file" name="profile_picture" id="profile_picture" onChange={handleChange} />
                </div>
                <div className="mb-6">
                    <label className="block mb-2 font-bold text-white" htmlFor="about">About</label>
                    <textarea
                        className="w-full h-24 px-3 py-2 text-white border-black rounded-md focus:outline-none focus:shadow-outline bg-[#0f0f0f]" name="about"
                        id="about"
                        onChange={handleChange}
                        placeholder="Tell us about yourself"
                    ></textarea>

                </div>
                <button className="w-full px-3 py-2 text-white bg-pink-500 rounded-md hover:bg-pink-600 focus:outline-none focus:shadow-outline" type="submit">Create</button>
            </form>
        </div>

    );
};

export default Formulario;