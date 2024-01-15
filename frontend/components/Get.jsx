import React, { useState, useCallback} from 'react'
import axios from 'axios'

const GetFile = () => {
  // Inicializamos el CID manualmente
  let cid = 'bafkreiax6i5knmswej2g72hlejcwjtypdk4ikallfvrydejkucqtgzwyva'

  // Usamos el hook useState para almacenar la URL de la imagen
  const [imageUrl, setImageUrl] = useState(null)

  const handleButtonClick = useCallback(async () => {
    try {
      // Hacemos una solicitud GET para obtener los datos de la imagen
      const response = await axios.get(`http://192.168.1.9:9000/fetch/${cid}`, {
        responseType: 'blob' // Indicamos que esperamos una respuesta de tipo blob
      })

      // Creamos una URL de objeto a partir del blob
      const url = URL.createObjectURL(response.data)

      // Actualizamos la URL de la imagen
      setImageUrl(url)
    } catch (error) {
      console.error(error)
      if (error.response) {
        console.error(error.response.data)
      }
    }
  }, [])

  return (
    <div>
      <button onClick={handleButtonClick}>Obtener imagen</button>
      {imageUrl && <img src={imageUrl} alt="Imagen" />}
    </div>
  )
}

export default GetFile

