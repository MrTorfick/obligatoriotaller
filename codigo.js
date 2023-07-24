const URLBASE = `https://censo.develotion.com/`;

function Registro() {

    let datosReg = new Object();
    datosReg.usuario = "censo85"
    datosReg.password = "censo85"

    fetch(`${URLBASE}usuarios.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosReg)
    })
        .then(function (response) {
            console.log(response);
            return response.json();
        })
        .then(function (data) {
            console.log(data);
        }).catch(function (error) {
            console.log(error);
        })
}

function Login() {

    let datosLogin = new Object();
    datosLogin.usuario = "censo85";
    datosLogin.password = "censo85";

    fetch(`${URLBASE}login.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosLogin)
    })
        .then(function (response) {
            console.log(response);
            return response.json();
        })
        .then(function (data) {

            if (data.codigo == 200) {
                localStorage.setItem("token", data.apiKey)
                localStorage.setItem("id", data.id)
            } else {
                alert("datos incorrectos")
            }
            console.log(data);
        }).catch(function (codigo) {
            console.log(codigo);
        })
}


function AgregarPersona() {

    let datosPersona = new Object();
    datosPersona.idUsuario = localStorage.getItem("id")
    datosPersona.nombre = "Persona 1"
    datosPersona.departamento = 3205; /*Por lo que se ve la api no valida nada. Si yo le mando el departamento vacio, o no le mando nada, me devuelve 300*/
    datosPersona.ciudad = 129777
    datosPersona.fechaNacimiento = "2002-09-25"
    datosPersona.ocupacion = 3

    fetch(`${URLBASE}personas.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': localStorage.getItem("token"),
            'iduser': localStorage.getItem("id")
        },
        body: JSON.stringify(datosPersona)
    })
        .then(function (response) {
            console.log(response);
            return response.json();
        })
        .then(function (data) {

            /*            if (data.codigo == 200) {
                           console.log(data);
                       } else {
                       } */
            console.log(data);
        }).catch(function (codigo) {
            console.log(codigo);
        })
}


