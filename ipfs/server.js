// Importamos los módulos necesarios
const express = require('express');
const multer = require('multer');
const Nodefs = require('fs'); // Módulo de sistema de archivos de Node.js
const cors = require('cors'); // Módulo CORS

// Creamos una nueva aplicación Express
const app = express();

// Usamos cors en nuestra aplicación para permitir todas las solicitudes CORS
app.use(cors());

// Inicializamos Multer, que nos ayudará a manejar las cargas de archivos
const upload = multer();

// Usamos el middleware express.json() para analizar las solicitudes con contenido JSON
app.use(express.json())

// Creamos un nuevo Mapa para almacenar los archivos cargados
let hashMap = new Map()

// Esta función crea un nodo Helia y devuelve un sistema de archivos basado en unixfs
async function createNode() {
    // Importamos los módulos necesarios de forma dinámica
    const {createHelia} = await import ('helia');
    const {unixfs} = await import('@helia/unixfs');

    // Creamos una nueva instancia de Helia
    const helia =  await createHelia();

    // Creamos un nuevo sistema de archivos basado en unixfs
    const fs = unixfs(helia);

    // Devolvemos el sistema de archivos
    return fs;
}

async function run() {
const fs = await createNode();

// Definimos una ruta POST para cargar archivos de imagen
app.post('/uploadImage', upload.single('file'), async (req, res) => {
    // Obtenemos los datos del archivo cargado
    const data = req.file.buffer;

    // Añadimos los datos al sistema de archivos y obtenemos su CID
    const cid = await fs.addBytes(data)

    // Almacenamos el CID en nuestro Mapa con el nombre original del archivo como clave
    hashMap.set(req.file.originalname, cid)

    // Enviamos una respuesta al cliente indicando que el archivo ha sido cargado
    res.status(201).send(cid)
})

// Definimos una ruta GET para recuperar archivos de imagen por CID
app.get('/fetchImage/:cid', async (req, res) => {
    // Obtenemos el CID del archivo de la solicitud
    const cid = req.params.cid;

    // Si no encontramos el CID, enviamos una respuesta de error
    if (!cid) {
        res.status(404).send('No se pudo encontrar el archivo')
        return;
    }

    // Intentamos recuperar el archivo del sistema de archivos
    let imageBuffer = Buffer.alloc(0)
    try {
        for await (const chunk of fs.cat(cid)) {
            imageBuffer = Buffer.concat([imageBuffer, Buffer.from(chunk)])
        }
    } catch (error) {
        // Si ocurre un error al recuperar el archivo, enviamos una respuesta de error
        res.status(500).send('Ocurrió un error al recuperar el archivo')
        return;
    }

    // Enviamos el buffer de la imagen en la respuesta
    res.status(200).send(imageBuffer)
})



// Iniciamos el servidor en la dirección IP 192.168.1.9 y el puerto 5000
app.listen(1111, '192.168.1.8', () => {
    console.log('El servidor está escuchando en http://192.168.1.8:1234');
})};

run();
