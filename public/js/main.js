const socket = io();

Handlebars.registerHelper('formatDate', function(date) {
    return new Handlebars.SafeString(
        new Date(date).toLocaleString()
    );
});

const formAgregarProductos = document.getElementById("formAgregarProductos")
const formAgregarMensajes = document.getElementById("formAgregarMensajes")

formAgregarProductos.addEventListener('submit', e => {
    // prevengo que el formulario recargue la pagina al hacer submit
    e.preventDefault()
    const producto = {
        title: formAgregarProductos [ 0 ].value, 
        price: formAgregarProductos [ 1 ].value, 
        thumbnail: formAgregarProductos [ 2 ].value, 
    }
    // envio el producto al servidor via socket
    socket.emit('updateProducto', producto);
    // limpio el contenido de los campos del formulario
    formAgregarProductos.reset()
})

// agrego manejador de eventos de tipo 'productos'
socket.on('productos', manejarEventoProductos);
 
async function manejarEventoProductos(productos) {
    // busco la plantilla del servidor
    const recursoRemoto = await fetch('views/tabla-productos.hbs')
    //extraigo el texto de la respuesta del servidor
    const textoPlantilla = await recursoRemoto.text()
    //armo el template con handlebars
    const functionTemplate = Handlebars.compile(textoPlantilla)
    // relleno la plantilla con las personas recibidas
    const html = functionTemplate({ productos })
    // reemplazo el contenido del navegador con los nuevos datos
    document.getElementById('productos').innerHTML = html
}

// agrego manejador de eventos de tipo 'productos'
socket.on('productosRandom', cargaProductosRandom);

async function cargaProductosRandom(productos) {
    // busco la plantilla del servidor
    const recursoRemoto = await fetch('views/tabla-productosRandom.hbs')

    //extraigo el texto de la respuesta del servidor
    const textoPlantilla = await recursoRemoto.text()

    //armo el template con handlebars
    const functionTemplate = Handlebars.compile(textoPlantilla)

    // relleno la plantilla con las personas recibidas
    const html = functionTemplate({ productos })

    // reemplazo el contenido del navegador con los nuevos datos
    document.getElementById('productosRandom').innerHTML = html
}

// agrego manejador de eventos 
socket.on('cargarDatosSesion', cargarSesion);

async function cargarSesion(datosSesion){
    console.log('DATOS SESION')
    console.log(datosSesion)

    // busco la plantilla del servidor
    const recursoRemoto = await fetch('views/tabla-bienvenida.hbs')

    //extraigo el texto de la respuesta del servidor
    const textoPlantilla = await recursoRemoto.text()

    //armo el template con handlebars
    const functionTemplate = Handlebars.compile(textoPlantilla)

    // relleno la plantilla con las personas recibidas
    const html = functionTemplate({ datosSesion })
    document.getElementById('divUsuario').innerHTML = html
}

formAgregarMensajes.addEventListener('submit', e => {
    // prevengo que el formulario recargue la pagina al hacer submit
    e.preventDefault()

    const mensaje={ 
        author: {
            id: formAgregarMensajes[0].value, 
            nombre: formAgregarMensajes[1].value, 
            apellido: formAgregarMensajes[2].value, 
            edad: formAgregarMensajes[3].value,
            alias: formAgregarMensajes[4].value,
            avatar: formAgregarMensajes[5].value,
        },
        text: formAgregarMensajes[6].value,
        fechaHora: new Date()
    }
    
    // envio el producto al servidor via socket
    socket.emit('updateMensaje', mensaje);

    // limpio el contenido de los campos del formulario
    //formAgregarMensajes.reset()
    formAgregarMensajes["nuevoMensaje"].value=""
})

// agrego manejador de eventos de tipo 'mensajes'
socket.on('mensajes', manejarEventoMensajes);
 
async function manejarEventoMensajes(paqueteDatos) {

    const {antes, despues, mensajesNormalizado}= paqueteDatos

    const authorSchema = new normalizr.schema.Entity('author',{idAttribute:"id"});
    const messageSchema = new normalizr.schema.Entity('mensaje',{
        author: authorSchema})
    const allMessageSchema= new normalizr.schema.Entity('mensajes',{
        mensajes:[ messageSchema]});
    
    const denormalizedData= normalizr.denormalize(mensajesNormalizado.result, allMessageSchema, mensajesNormalizado.entities)    
    
    const mensajes= denormalizedData.mensajes

    // busco la plantilla del servidor
    const recursoRemoto = await fetch('views/tabla-mensajes.hbs')

    //extraigo el texto de la respuesta del servidor
    const textoPlantilla = await recursoRemoto.text()

    //armo el template con handlebars
    const functionTemplate = Handlebars.compile(textoPlantilla)

    // relleno la plantilla con las personas recibidas
    const html = functionTemplate({mensajes}) //antes era mensajes

    // reemplazo el contenido del navegador con los nuevos datos
    document.getElementById('mensajes').innerHTML = html

    //agregamos tasa de compresion
    if (antes!=0 || despues!==0){
        htmlTasaCompresion=`Compresion: t.inicial: ${antes} t.final: ${despues} ratio: ${(despues/antes*100).toFixed(2)} %.`
    }else{
        htmlTasaCompresion=""
    }
    document.getElementById('tasacompresion').innerHTML = htmlTasaCompresion
}
