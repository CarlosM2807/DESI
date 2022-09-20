var array = [1, 3.5, 44, "hola mundo", true];
var fruteria = [
    {
    nombre: "pera",
    precio: 1.45,
    disponible: false
    },
    {
    nombre: "manzana",
    precio: 1.78,
    disponible: true
    }
    ];

    var fruteriaJson = { "fruteria": [
        {
        "nombre": "pera",
        "precio": 1.45,
        "disponible": false
        },
        {
        "nombre": "manzana",
        "precio": 1.78,
        "disponible": true
        }
        ] }

function imprime() {
        console.log("El precio de la manzana es: "+fruteria[1].precio)
        console.log("El primer elemento del array es: "+array[0])
        console.log("El array json las "+fruteriaJson.fruteria[0].precio+" y la disponibilidad es: "+fruteriaJson.fruteria[0].disponible)
    }