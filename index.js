import bodyParser from "body-parser"
import cors from "cors"
import express from "express"
import { ObjectId } from "mongodb"
import client from "./db.js"
 

const app = express()
const port = 3000


// PERMITE RECIBIR DATOS EN EL BODY EN FORMATO JSON
app.use(bodyParser.json())
app.use(cors())

// DB info
const dbName = 'Task_app'
const tasksCollectionName = 'tasks'


// Obtener Todo
app.get('/api/v1/tareas', async (req, res) => {

    const estado = req.query.estado
    

    // 1. Conexion a la DB
    await client.connect()
    // 2. Seleccionar la DB
    const taskAppDB = client.db(dbName)
    // 3. Seleccionar la coleccion
    const tasksCollection = taskAppDB.collection(tasksCollectionName)

    let filtro = {}
    if(estado === "activa" || estado === "finalizada" || estado === "inactiva"){

        filtro = {estado: estado}

    }

    // 4. Realizar la query

    const takslist = await tasksCollection.find(filtro).toArray()

    // 5. Cerrar conexion
    await client.close()

    res.json({
        message: 'documentos entregados',
        data: takslist
    })
})

// Obtener Uno
app.get('/api/v1/tareas/:id', async (req, res) => {

    let id = req.params.id

    // 1. Conexion a la DB
    await client.connect()
    // 2. Seleccionar la DB
    const taskAppDB = client.db(dbName)
    // 3. Seleccionar la coleccion
    const tasksCollection = taskAppDB.collection(tasksCollectionName)

    // 4. Realizar la query

    id = new ObjectId(id)

    const tarea = await tasksCollection.findOne({
        _id: id,
    })

    // 5. Cerrar conexion
    await client.close()


    res.json({
        message: 'documento entregado',
        data: tarea
    })
})

// Crear
app.post('/api/v1/tareas', async (req, res) => {

    const taskdata = req.body
    // console.log(taskdata)

    // 1. Conexion a la DB
    await client.connect()
    // 2. Seleccionar la DB
    const taskAppDB = client.db(dbName)
    // 3. Seleccionar la coleccion
    const tasksCollection = taskAppDB.collection(tasksCollectionName)

    // 4. Realizar la query

    const taskcreate = await tasksCollection.insertOne({

        tarea: taskdata.titulo,
        descripcion: taskdata.descripcion,
        estado: "inactiva",
        responsable: taskdata.responsable,


    })

    // 5. Cerrar conexion
    await client.close()


    res.json({

        message: 'documento creado',

        data: taskcreate
    })
})

// Editar
app.put('/api/v1/tareas/:id', async (req, res) => {

    const taskdata = req.body
    let id = req.params.id



    // 1. Conexion a la DB
    await client.connect()
    // 2. Seleccionar la DB
    const taskAppDB = client.db(dbName)
    // 3. Seleccionar la coleccion
    const tasksCollection = taskAppDB.collection(tasksCollectionName)

    id = new ObjectId(id)
    let modificacion = {}

    if (taskdata.titulo) {
        modificacion.tarea = taskdata.tarea
    }
    if (taskdata.descripcion) {
        modificacion.descripcion = taskdata.descripcion
    }
    if (taskdata.estado) {
        modificacion.estado = taskdata.estado
    }
    if (taskdata.responsable) {
        modificacion.responsable = taskdata.responsable
    }
    // 4. Realizar la query


    await tasksCollection.updateOne(
        { _id: id },
        {
            $set: modificacion

        }


    )

    // 5. Cerrar conexion
    await client.close()

    res.json({
        message: 'documento editado'
    })
})

// Eliminar
app.delete('/api/v1/tareas/:id', async (req, res) => {

    
    let id = req.params.id 

    // 1. Conexion a la DB
    await client.connect()
    // 2. Seleccionar la DB
    const taskAppDB = client.db(dbName)
    // 3. Seleccionar la coleccion
    const tasksCollection = taskAppDB.collection(tasksCollectionName)

    id = new ObjectId(id)

    // 4. Realizar la query

    const tareaEliminada = await tasksCollection.deleteOne({_id: id})
    // 5. Cerrar conexion
    await client.close()

    res.json({
        message: 'documento eliminado',
    })
})

// PUERTO LOGICO
app.listen(port, () => {
    console.log(`Api escuchando desde el puerto ${port}`)
})