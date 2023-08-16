import { Component, OnInit } from '@angular/core';
// import { deleteField } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, listAll, getDownloadURL, deleteObject } from '@angular/fire/storage';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  //Propiedad para guardad las url de descarga de las imágenes, y que vamos a mostrar en el html
  images: string[];

  fullPaths: string[]; //Los paths que necesitamos guardar en el objeto

  arregloDePromesas: Promise<any>[]; //Lo utilizamos para guardar nuestras promesas y asegurarnos que se cumplan todas para poder trabajar con ellas si problema

  constructor(private storage: Storage) {
    this.images = []; //Se inicializa la propiedad
    this.fullPaths = []; // Inicializamos
    this.arregloDePromesas = [];
   }

  //Método de arranque
  ngOnInit() {
    //this.getImagies();
  }

  //Método para cargar imágenes
  uploadImage($event: any) {

    //files es un arreglo de archivos que cargamos desde el html
    const files = $event.target.files; //Apuntamos al input y luego los ficheros
    //console.log(files);

    //Creamos una referencia al sitio de firebase
    // En la referencia se coloca el servicio y el path, aún si el path no exíste se puede declarar

    //Creamos una forma de cargar todo el arreglo
    //Utilizamos un ciclo for para recorrer el arreglo e insertar archivo por archivo adquiriendo su referencia
    for(let file of files) {

      //Creamos la referencia para guardar
      const imgRef = ref(this.storage, `carpeta/${file.name}`);

      //Creamos un arreglo de promesas
      this.arregloDePromesas.push(uploadBytes(imgRef, file)); //Método para subir los archivos que retorna Promesa


    } //Fin del for

    //Utilizamos un Promise all para asegurarnos de que el código no avanza hasta que todas las promesas se cumplan
    Promise.all(this.arregloDePromesas)
    .then(resultados => {
      //Nos retorna un arreglo con las respuestas de las promesas
      //Procedemos a iterar para trabajar con cada resultado y obtener el o los path que queremos guardar
      for( let resultado of resultados) {
        // console.log(resultado);
        const fullPath = resultado.metadata.fullPath;
        // console.log(fullPath);
        this.fullPaths.push(fullPath);
      }
      //Aquí mismo disparamos los eventos que tengan relación con nuestro arreglo fullPaths y depositamos el fullPaths como una de las propiedades del objeto Place
      //this.getImagies(); //En caso de que quiera pintar las imágenes

    })
    .catch(error => {
      console.log(error);
    });

    //IMPORTANTE COLOCAR UN LOADING ANTES DE LA PROMESA PARA CUANDO SE CARGA LA IMÁGENES

  } // fin del método



  //Método para obtener imágenes
  getImagies() {

    this.images = [];

    //fullPaths es sólo un ejemplo de arreglo que no persiste en este ejemplo concreto
    //fullPaths debe ser remplazado por la propiedad del objeto (Plance) que almacene el arrelgo de paths
    this.fullPaths.forEach(async fullPath => {
      // console.log(fullPath);

      //Creamos una referencia a la o las imágenes que deseamos
      const pathReference = ref(this.storage, fullPath);

      //Utilizamos el método de firebase para obtener la o las url de descarga
      const url = await getDownloadURL(pathReference);
      this.images.push(url);

    })

  } // Fin método Get


  //Método para eliminar los archivos del Storage
  eliminarImagen() {
    //if(!confirm('¿Estás seguro?')) return ;

    //fullPaths debe ser remplazado por la propiedad del objeto (Plance) que almacene el arrelgo de paths
    this.fullPaths.forEach(fullPath => {
      // console.log(fullPath);

      //Creamos una referencia a la o las imágenes que deseamos borrar
      const pathReference = ref(this.storage, fullPath);

      // Delete the file
      deleteObject(pathReference).then(() => {
        console.log('Se ha borrado ', fullPath);
        //Aquí borramos el fullPath que está guardado en Firestore
        /*
        Usa el método deleteField():
        import { doc, updateDoc, deleteField } from "firebase/firestore";

        const cityRef = doc(db, 'cities', 'BJ');

        // Remove the 'capital' field from the document
        await updateDoc(cityRef, {
            capital: deleteField()
        });
        */
      }).catch((error) => {
        console.log('Ha ocurrido un error');
      });


    })

  }


} //Fin Clase

