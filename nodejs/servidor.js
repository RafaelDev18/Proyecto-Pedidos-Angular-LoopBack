//console.log('Hola mundo desde NodeJS');
const express = require('express');
const mongoose = require('mongoose');
const { db } = require('./modelos/Tarea.js');
const TareaSchema = require('./modelos/Tarea.js');

const app = express();
const router = express.Router();
app.use(express.urlencoded({extend: true}));
app.use(express.json());



// conexion a la base de datos
mongoose.connect("mongodb+srv://prog_web:RafaelRico18@clusterrafaelrico.5buzuct.mongodb.net/ActividadesDB?retryWrites=true&w=majority");

//Operaciones CRUD
router.get('/', (req, res) =>{
    res.send('El inicio de nuestra API');
})

// Peticion GET para Buscar todas las tareas
router.get('/tarea', (req, res) => {
    TareaSchema.find(function(err, datos){
        if(err){
            console.log('Error leyendo las tareas');
        }else{
            res.send(datos);
        }
    })
});

// Peticion GET para Buscar una tarea  por id

router.get('/tarea/:tareaId', (req,res) => {
    let tareaId = req.params.tareaId;

    TareaSchema.findById(tareaId,(err, datos) => {
        if(err){
            console.log('Error leyendo las tareas');
        }else{
            res.send(datos);
        }
    });
});

//Peticion POST para Crear

router.post('/tarea', (req, res) => {
    let nuevaTarea = new TareaSchema({
        idTarea: req.body.id,
        nombreTarea: req.body.nombre,
        detalleTarea: req.body.detalle
    });

    nuevaTarea.save(function(err, datos){
        if(err){
            console.log(err);
        }
        res.send('Tarea almacenada correctamente');
    });
})

// Peticion PUT para Actualizar
router.put('/tarea/:tareaId', async (req,res) => {
    try{
            await TareaSchema.findByIdAndUpdate(req.params.tareaId,{
            nombreTarea: req.body.nombre,
            detalleTarea: req.body.detalle
        });
        res.send('Tarea actualizada correctamente');
        //res.send(datos);
    }catch(err){
        console.log('Error actualizando las tareas');
        res.send(400).send('Server Error');
    }
});


// Peticion DELETE para Borrar
router.delete('/tarea/:tareaId', (req,res) => {
    let tareaId = req.params.tareaId;

    TareaSchema.findById(tareaId, (err, datos) => {
        if(err){
            res
                .status(500)
                .send({ message: `Error al borrar la inscripcion ${err}`});
        }else{
            datos.remove((err) => {
                if(err){
                    res
                        .status(500)
                        .send({ message: `Error al borrar la inscripcion ${err}`}); 
                }else{
                    res.status(200).send({message: 'La tarea ha sido eliminada'});
                }
            });
        }
    });
});





app.use(router);
app.listen(3000, () => {
    console.log('Servidor corriendo por el puerto 3000');
});