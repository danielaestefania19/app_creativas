import React, { useEffect, useState, useContext } from "react";
import { eccomerce } from "../../src/declarations/eccomerce";
import { AuthContext } from './AuthContext';
import { Link } from 'react-router-dom';

function Checkout() {
    const [addresses, setAddresses] = useState([]);
    const [error, setError] = useState(null);
    const [formVisible, setFormVisible] = useState(false);
    const [newAddress, setNewAddress] = useState({
        country: "",
        state: "",
        postal_code: "",
        phone_number: "",
        city: "",
        address: "",
    });
    const { whoami, isUserAuthenticated } = useContext(AuthContext);

    useEffect(() => {
        if (isUserAuthenticated && whoami) {
            eccomerce.get_user_addresses(whoami)
                .then(res => {
                    if (res.Ok) {
                        const transformedAddresses = res.Ok.map(record => {
                            const id = record[0];
                            const address = record[1];
                            return { id, ...address };
                        });
                        setAddresses(transformedAddresses);
                    } else {
                        setError(res.ItemError);
                    }
                })
                .catch(err => setError(err));
        }
    }, [isUserAuthenticated, whoami]);

    const handleInputChange = (event) => {
        setNewAddress({ ...newAddress, [event.target.name]: event.target.value });
    };

    const handleSubmit = () => {
        eccomerce.associate_address({ address_user: whoami, address: newAddress })
            .then(() => {
                setFormVisible(false);
                setNewAddress({
                    country: "",
                    state: "",
                    postal_code: "",
                    phone_number: "",
                    city: "",
                    address: "",
                });
                // Refetch addresses
                eccomerce.get_user_addresses(whoami)
                    .then(res => {
                        if (res.Ok) {
                            const transformedAddresses = res.Ok.map(record => {
                                const id = record[0];
                                const address = record[1];
                                return { id, ...address };
                            });
                            setAddresses(transformedAddresses);
                        } else {
                            setError(res.ItemError);
                        }
                    })
                    .catch(err => setError(err));
            })
            .catch(err => setError(err));
    };

    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!addresses.length) {
        return (
            <div>
                <p>You do not have associated shipping addresses.</p>
                <button onClick={() => setFormVisible(true)}>Create new</button>
                {formVisible && (
                    <div style={{ marginTop: '100px' }}>
                        <input type="text" name="country" value={newAddress.country} onChange={handleInputChange} placeholder="Country" />
                        <input type="text" name="state" value={newAddress.state} onChange={handleInputChange} placeholder="State" />
                        <input type="text" name="postal_code" value={newAddress.postal_code} onChange={handleInputChange} placeholder="Postal Code" />
                        <input type="text" name="phone_number" value={newAddress.phone_number} onChange={handleInputChange} placeholder="Phone Number" />
                        <input type="text" name="city" value={newAddress.city} onChange={handleInputChange} placeholder="City" />
                        <input type="text" name="address" value={newAddress.address} onChange={handleInputChange} placeholder="Address" />
                        <button onClick={handleSubmit}>Create</button>
                    </div>
                )}
            </div>
        );
    } else {
        return (
            <div>
                {addresses.map((address, index) => (
                    <div key={index}>
                        <p>{address.country}, {address.city}, {address.state}, {address.address}, {address.postal_code}, {address.phone_number}</p>
                        <button>Edit Address</button>
                    </div>
                ))}
                <button onClick={() => setFormVisible(true)}>Create other shipping address</button>
                {formVisible && (
                    <div style={{ marginTop: '100px' }}>
                        <input type="text" name="country" value={newAddress.country} onChange={handleInputChange} placeholder="Country" />
                        <input type="text" name="state" value={newAddress.state} onChange={handleInputChange} placeholder="State" />
                        <input type="text" name="postal_code" value={newAddress.postal_code} onChange={handleInputChange} placeholder="Postal Code" />
                        <input type="text" name="phone_number" value={newAddress.phone_number} onChange={handleInputChange} placeholder="Phone Number" />
                        <input type="text" name="city" value={newAddress.city} onChange={handleInputChange} placeholder="City" />
                        <input type="text" name="address" value={newAddress.address} onChange={handleInputChange} placeholder="Address" />
                        <button onClick={handleSubmit}>Create</button>
                    </div>
                )}
            </div>
        );
    }
}

export default Checkout;
