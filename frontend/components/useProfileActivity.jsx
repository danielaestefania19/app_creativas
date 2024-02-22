import { useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';

const useProfileActivity = () => {
    const context = useContext(AuthContext);

    // Solo ejecuta el código si el contexto existe
    if (context) {
        const { whoami, actor } = context; // accede al actor aquí

        useEffect(() => {
            console.log("whoami:", whoami);
        }, []);
    }
};

export default useProfileActivity;
