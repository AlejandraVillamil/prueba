/*********************  Se ejecurá al abrir el HTML  ***************************/
function loadProduct(){
//Se configura la conexión a la DB    
var firebaseConfig = {

                        apiKey: "AIzaSyDAJvvDPv_onNMyc_VAlky6a-4skB44mok",
                        authDomain: "eraseunavez-pasteleria.firebaseapp.com",
                        databaseURL: "https://eraseunavez-pasteleria.firebaseio.com",
                        projectId: "eraseunavez-pasteleria",
                        storageBucket: "eraseunavez-pasteleria.appspot.com",
                        messagingSenderId: "802282295386",
                        appId: "1:802282295386:web:13495939bb57a9e12e8863",
                        measurementId: "G-CPVGN5971Q"
                     }

/*********************  Se recorre la DB  ***************************/
var app =firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

//Se determina el tamaño de la colección
db.collection("productos").get().then(snap => {
    size = snap.size // will return the collection size
    console.log(size);
/*****************************************************************/

    let $items = document.querySelector('#items');
    let carrito = [];
    let total = 0;
    let $carrito = document.querySelector('#carrito');
    let $total = document.querySelector('#total');
    let $botonVaciar = document.querySelector('#boton-vaciar');

/**********************************************************************/
/*****************************  FUNCIONES ****************************/
/*********************************************************************/


/*********************  Se renderiza el HTML ***************************/
    function renderItems() {
        db.collection("producto")
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                // doc.data() is never undefined for query doc snapshots
                    // Estructura
                    let miNodo = document.createElement('div');
                    miNodo.classList.add('card', 'col-sm-4');
                    // Body
                    let miNodoCardBody = document.createElement('div');
                    miNodoCardBody.classList.add('card-body');
                    // Titulo
                    let miNodoTitle = document.createElement('h3');
                    miNodoTitle.classList.add('card-title');
                    miNodoTitle.textContent = doc.data().Nombre;
                   // Descripcion
                    let miNodoDesc = document.createElement('p');
                    miNodoDesc.classList.add('card-text','descripcion');
                    miNodoDesc.textContent = doc.data().Descripcion;
                    // Tamano
                    let miNodoSize = document.createElement('h5');
                    miNodoSize.classList.add('tamano');
                    miNodoSize.textContent = doc.data().Tamano_1;
                    // Imagen
                    let miNodoImagen = document.createElement('img');
                    miNodoImagen.classList.add('img-fluid');
                    miNodoImagen.setAttribute('src', doc.data().imagen);
                    // Precio
                    let miNodoPrecio = document.createElement('p');
                    miNodoPrecio.classList.add('card-text','precio');
                    miNodoPrecio.textContent = (doc.data().Precio_1) + ' COP';
                    // Boton 
                    let miNodoBoton = document.createElement('button');
                    miNodoBoton.classList.add('btn', 'btn-primary');
                    miNodoBoton.textContent = 'Agregar';
                    let marc = doc.data().id
                    console.log('prueba')
                    console.log(marc)
                    miNodoBoton.setAttribute('marcador', marc);
                    miNodoBoton.addEventListener('click', anyadirCarrito);
                    // Insertamos
                    miNodoCardBody.appendChild(miNodoImagen);
                    miNodoCardBody.appendChild(miNodoTitle);
                    miNodoCardBody.appendChild(miNodoDesc);
                    miNodoCardBody.appendChild(miNodoSize);
                    miNodoCardBody.appendChild(miNodoPrecio);
                    miNodoCardBody.appendChild(miNodoBoton);
                    miNodo.appendChild(miNodoCardBody);
                    $items.appendChild(miNodo);
                    });
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });
}

/*********************  Se añaden productos al carro ***************************/

    function anyadirCarrito () {
        // Anyadimos el Nodo a nuestro carrito
        carrito.push(this.getAttribute('marcador'))
        // Calculo el total
        calcularTotal();
        // Renderizamos el carrito 
        renderizarCarrito();
        //cobrar();
    }
    function calcularTotal() {
        // Limpiamos precio anterior
        total = 0;
        $total.textContent = 0;
                // Recorremos el array del carrito

        for (let item of carrito) {
        //Se carga el dato de producto correspodiente al botón en la variable miItem 

            let DB = db.collection("producto").doc(item);
            DB.get().then(function (doc) {
                miItem=doc.data()         
        console.log('miItem')        
        console.log(miItem)
            total = total + miItem.Precio_1                     
        
        // Formateamos el total para que solo tenga dos decimales
        let totalDosDecimales = total.toFixed(2);
        // Renderizamos el precio en el HTML
        $total.textContent = totalDosDecimales;
    })
    }
    }
/*********************  Se renderiza el HTML del carrito ***************************/


    function renderizarCarrito() {
        // Vaciamos todo el html
        $carrito.textContent = '';
        // Quitamos los duplicados
        let carritoSinDuplicados = [...new Set(carrito)];
        // Generamos los Nodos a partir de carrito
        carritoSinDuplicados.forEach(function (item, indice) {
            // Obtenemos el item que necesitamos de la variable base de datos
           
           /* let miItem = baseDeDatos.filter(function(itemBaseDatos) {
                return itemBaseDatos['id'] == item;
            });*/

/**/

    //Se carga el dato de producto correspodiente al botón en la variable miItem 

       let DB = db.collection("producto").doc(item);
       DB.get().then(function (doc) {     let    miItem=doc.data()         
        console.log('miItem')        
        console.log(miItem)
                                    
/**/
            // Cuenta el número de veces que se repite el producto
            let numeroUnidadesItem = carrito.reduce(function (total, itemId) {
                return itemId === item ? total += 1 : total;
            }, 0);
            // Creamos el nodo del item del carrito
            let miNodo = document.createElement('li');
            miNodo.classList.add('list-group-item', 'text-right', 'mx-2');          
            miNodo.textContent = miItem.Precio_1
            miNodo.textContent = `${numeroUnidadesItem} x ${miItem.Nombre} - ${miItem.Precio_1}COP`;
            // Boton de borrar
            let miBoton = document.createElement('button');
            miBoton.classList.add('btn', 'btn-danger', 'mx-5');
            miBoton.textContent = 'X';
            miBoton.style.marginLeft = '1rem';
            miBoton.setAttribute('item', item);
            miBoton.addEventListener('click', borrarItemCarrito);
            // Mezclamos nodos
            miNodo.appendChild(miBoton);
            $carrito.appendChild(miNodo);
        })
       
        })
    }

    function borrarItemCarrito() {
        console.log()
        // Obtenemos el producto ID que hay en el boton pulsado
        let id = this.getAttribute('item');
        // Borramos todos los productos
        carrito = carrito.filter(function (carritoId) {
            return carritoId !== id;
        });
        // volvemos a renderizar
        renderizarCarrito();
        // Calculamos de nuevo el precio
        calcularTotal();
    }

    
    function vaciarCarrito() {
        // Limpiamos los productos guardados
        carrito = [];
        // Renderizamos los cambios
        renderizarCarrito();        
        calcularTotal();
        $total.textContent = 0;
    }

    // Eventos
    $botonVaciar.addEventListener('click', vaciarCarrito);

    // Inicio
    renderItems();
})
function checkout(){
    document.getElementByName('amount-in-cents').setAttribute('value',total) ;
    console.log('El valor de pago es')
    console.log(total)

}
};