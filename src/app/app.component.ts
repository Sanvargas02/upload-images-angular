import { Component, OnInit } from '@angular/core';
import { Storage, ref, uploadBytes, listAll, getDownloadURL } from '@angular/fire/storage';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  //Propiedad para guardad las url de descarga de las imágenes, y que vamos a mostrar en el html
  images: string[];

  fullPaths: string[]; //Los paths que necesitamos guardar en el objeto

  arregloDePromesas: Promise<any>[]; //Lo utilizamos para guardar nuestras promesas y asegurarnos que se cumplan

  constructor(private storage: Storage) {
    this.images = []; //Se inicializa la propiedad
    this.fullPaths = []; // Inicializamos
    this.arregloDePromesas = [];
   }

  //Método de arranque
  ngOnInit() {
    //this.getImagies();
  }

  uploadImage($event: any) {

    const files = $event.target.files; //Apuntamos al input y luego los ficheros
    //console.log(files);

    //Creamos una referencia al sitio de firebase
    // En la referencia se coloca el servicio y el path, aún si el path no exíste se puede declarar

    // const imgRef = ref(this.storage, `images/${file.name}`);

    //Creamos una forma de cargar todo el arreglo
    //Utilizamos un ciclo for para recorrer el arreglo e insertar archivo por archivo adquiriendo su referencia
    for(let file of files) {

      //Creamos la referencia para guardar
      const imgRef = ref(this.storage, `carpeta/${file.name}`);

      //Creamos un arreglo de promesas
      this.arregloDePromesas.push(uploadBytes(imgRef, file)); //Método para subir los archivos que retorna Promesa

      //Insertamos la referencia y el archivo en este caso imágen que queremos subir.
      //Método para subir la imágen.
      //uploadBytes(imgRef, file) //Nos retorna una promesa
      //.then((response) => {
      // console.log(response);

      //Nos podemos plantear guardar la url de descarga a la imágen en una de las propiedades del objeto que estemos insertando en la base de datos Firestore.

      //const fullPath = response.metadata.fullPath; //fullPath es candidato a ser guardado en Firestore, en un arreglo de fullPaths.

      //this.fullPaths.push(fullPath);

      // console.log(pathReference);
      //También se puede guardar la URL de descarga del un archivo directamente en el objeto que queremos guardar, aplicando el método getDownloadURL() con la referencia ref() del elemento en concreto.

      //Creamos referencia al path donde se guardó la img para traer el link de descarga
      //const pathReference = ref(this.storage, fullPath);

      //Es probable que el código que continúa sea mejor colocarlo en un método get

      //Podemos usar then y cach pero la anidación se puede tornar complicada de leer.
      //const url = await getDownloadURL(pathReference);
      //console.log(url);

      //Este arreglo con las url se convierte en nuestra propiedad
      // this.images.push(url);

      // this.getImagies();
      //})
      //.catch( (error) => { console.log(error) } )


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
      //Aquí mismo disparamos los eventos que tengan relación con nuestro arreglo fullPaths
      this.getImagies();
    })
    .catch(error => {
      console.log(error);
    });

    //IMPORTANTE COLOCAR UN LOADING ANTES DE LA PROMESA PARA CUANDO SE CARGA LA IMÁGENES
    //SE COLOCA EL LOADING EN FALSE CUANDO EL CICLO FOR SE HAYA TERMINADO

    // console.log(this.fullPaths); // fullPaths es la propiedad que voy a almacenar en mi objeto Place, Empleado etc.
    //this.getImagies();

  } // fin del método



  //Método para obtener imágenes
  getImagies() {
  //   //console.log(this.fullPaths.length);
  //   //Se crea una referencia
  //   //Con el método ref() le decimos qué queremos, archivo, imagen, carpeta, en sí la dirección
  //   // const imagesRef = ref(this.storage, 'images');

  //   //En este caso utilizamos el fullPaths como arreglo para mostrar las imágenes pero tenemos que tener en cuenta que se debe utilizar la propiedad que viene desde el objeto que traemos
    this.images = [];

    //fullPaths es sólo un ejemplo de arreglo que no persiste en este ejemplo concreto
    this.fullPaths.forEach(async fullPath => {
      // console.log(fullPath);

      //Creamos una referencia a la o las imágenes que deseamos
      const pathReference = ref(this.storage, fullPath);

      //Utilizamos el método de firebase para obtener la o las url de descarga
      const url = await getDownloadURL(pathReference);
      this.images.push(url);

    })

  //   //   //Creamos la referencia

  //   //   //Utilizamos el método getDownloadUrl para obtener la url de descarga

  //   //   //Se guarda en un arreglo que se va a renderizar al final en el html
    //   //this.images.push(url); //insertamos en el arreglo images cada una de las url traidas desde firebase.


  //   listAll(imagesRef)
  //   .then( async response => {

  //     console.log(response);

  //     this.images = []; //Borramos el array antes de el for para que no se vayan sobre escribiendo.

  //     for(let item of response.items) {
  //       //Podemos usar then y cach pero la anidación se puede tornar complicada de leer.
  //       const url = await getDownloadURL(item); // Obtenemos la URL de descarga de cada objeto del arreglo de items.
  //       this.images.push(url); //insertamos en el arreglo images cada una de las url traidas desde firebase.
  //     }
  //   })
  //   .catch( error => console.log(error) )
  } // Fin método Get

} //Fin Clase

