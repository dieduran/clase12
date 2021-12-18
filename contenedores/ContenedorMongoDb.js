import { MongoClient } from 'mongodb'
import config from  '../src/options/config.js'

class  ContenedorMongoD {
    constructor  (nombreColeccion){
        this.nombreColeccion=  nombreColeccion;
        this.nombreDb= config.mongodb.nombreDb;
        this.datos = new MongoClient(config.mongodb.uri, { useNewUrlParser: true, useUnifiedTopology: true });
        this.conectar();
    }
    
    conectar= async()=>{
        await this.datos.connect();
    }

    getAll= async()=>{//    getAll(): Object[] - Devuelve un array con los objetos presentes en el archivo.
        try{
            const contenido = await this.datos.db(this.nombreDb).collection(this.nombreColeccion).find().toArray();            
            return contenido
        }catch(error){
            const contenido = []
            return contenido // JSON.parse(contenido)
        }
    }

    save = async(objeto)=>{ //save(Object): Number - Recibe un objeto, lo guarda en el archivo, devuelve el id asignado.
        let maxId = 0;
        await this.datos.connect();
        const arrObjetos= await this.datos.db(this.nombreDb).collection(this.nombreColeccion).find().sort({id:-1}).limit(1).toArray()
        arrObjetos.forEach(valor => {
            if (valor.id > maxId) {
                maxId = valor.id;}
        });
        maxId+=1; //usamos el siguiente id
        objeto.id=maxId
        try{
            await this.datos.db(this.nombreDb).collection(this.nombreColeccion).insertOne(objeto)
            return objeto.id;
        }catch{
            throw new Error('No se pudo guardar');
        }
    }

    getById= async(id)=> {//getById(Number): Object - Recibe un id y devuelve el objeto con ese id, o null si no está.
        try{
            const arrObjetos= await this.getAll();
            let salida=  arrObjetos.find( obj=> (obj.id===id))
            if (salida){
                return salida
            }else{
                return null //porque me daba undefined y pedia null
            }
        }catch{
            throw new Error('Error al obtener el Id');
        }
    }

    getRandom= async()=> {//getRandom(): Object - Devuelve un objeto random.
        const arrObjetos= await this.getAll();
        let maxId = 0;
        let auxAleatorio; 
        arrObjetos.forEach(valor => {
                if (valor.id > maxId) {
                    maxId = valor.id;}
            }
        );
        auxAleatorio= parseInt(Math.random() * maxId) + 1
        try{
            const arrObjetos= await this.getAll();
            let salida=  arrObjetos.find( obj=> (obj.id===auxAleatorio))
            if (salida){
                return salida
            }else{
                return null //porque me daba undefined y pedia null
            }
        }catch{
            throw new Error('Error al obtener el producto aleatorio');
        }
    }

    updateById = async(objeto)=>{ //updateById (Object): Number - Recibe un objeto, lo guarda en el archivo, devuelve el id asignado.
        try{
            await this.datos.db(this.nombreDb).collection(this.nombreColeccion).findOneAndUpdate({"id": objeto.id}, { $set: objeto } ,{new: true})
            return objeto.id;
        }catch (err){
            throw new Error('Error al actualizar el Id.');
        }
    }

    deleteById= async(id)=>{//    deleteById(Number): void - Elimina del archivo el objeto con el id buscado.
        try{
            await this.datos.db(this.nombreDb).collection(this.nombreColeccion).findOneAndDelete({"id": id})
        }catch{
            throw new Error('Error al obtener al borrar el Id');
        }
    }

    deleteAll= async()=>{//    deleteAll(): void - Elimina todos los objetos presentes en el archivo.
        try{
            await this.datos.db(this.nombreDb).collection(this.nombreColeccion).deleteAll()
        } catch(error){
            throw new Error('Error al obtener al borrar todos los objetos');
        }
    }

    updateDetailProductoById = async(id, objetoNuevo)=>{ //updateById (Object): Number - Recibe un objeto, lo guarda en el archivo, devuelve el id asignado.
        try{
            const arrObjetos = await this.getDetailProductoById(id);
            arrObjetos.push(objetoNuevo)
            const filtro={"id": id}
            const actualizar={$set: {productos: arrObjetos}}
            await this.datos.db(this.nombreDb).collection(this.nombreColeccion).findOneAndUpdate(filtro, actualizar ,{new: true})
            return this.getById(id)
        }catch{
            throw new Error('Error al actualizar detalle producto por Id');
        }
    }

    getDetailProductoById= async(id)=> {//getById(Number): Object - Recibe un id y devuelve el array de detalle
        try{
            const objeto= await this.getById(id);
            if(objeto){
                return objeto.productos;
            }else{
                return []
            }
        }catch{
            throw new Error('Error al obtener el detalle segun Id');
        }
    }

    deleteDetailProductoById = async(id, idProd)=>{ //
        try{
            const arrObjetos = await this.getDetailProductoById(id);
            for (let i=0; i< arrObjetos.length;i++)
            {   
                if(idProd===arrObjetos[i].id){
                    arrObjetos.splice(i,1) //eliminamos la aparicion, deberia ser la unica
                } 
            }
            const filtro={"id": id}
            const actualizar={$set: {productos: arrObjetos}}
            await this.datos.db(this.nombreDb).collection(this.nombreColeccion).findOneAndUpdate(filtro, actualizar ,{new: true})
            return this.getById(id)

        }catch{
            throw new Error('Error al obtener al actualizar el Id');
        }
    }

}

export default ContenedorMongoD;