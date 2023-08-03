Inicio();

function Inicio() {
    Eventos();
    ArmarMenu();
}


function Eventos() {
    ROUTER.addEventListener("ionRouteDidChange", Navegar); // ionRouteDidChange es un evento que se dispara cuando se cambia de ruta
    dqs("btnRegistrar").addEventListener("click", TomarDatosRegistro);
    /*  dqs("btnLogin").addEventListener("click", TomarDatosLogin); */

}



function TomarDatosRegistro() {
    let nom = dqs("regUsuario").value;
    let pas = dqs("regPassword").value;

    if (nom != "" && pas != "") {
        let u = new Usuario(nom, pas);
        Registro(u);

    } else {
        alert("Faltan datos"); // Esto hay que cambiarlo por un cartelito de ionic
    }

}


function ArmarMenu() {
    let hayToken = localStorage.getItem("apikey");
    let cadena = `<ion-item onclick="cerrarMenu()" href="/">Home</ion-item>`;
    if (hayToken) {
        cadena += `<ion-item onclick="cerrarMenu()" href="/personaAgregar">Personas</ion-item>
        <ion-item onclick="Logout()" >Logout</ion-item>`;
    } else {
        cadena += ` <ion-item onclick="cerrarMenu()" href="/login">Login</ion-item>
                <ion-item onclick="cerrarMenu()" href="/registro">Registrar</ion-item>
                 `;
    }

    dqs("menu-opciones").innerHTML = cadena;
}


function Logout() {
    localStorage.clear(); // Borra todo lo que hay en el localstorage
    ArmarMenu();
    cerrarMenu();
    NAV.push("page-home");
}


function Navegar(evt) {
    OcultarPantallas();
    console.log(evt);
    const RUTA = evt.detail.to;
    if (RUTA == "/") {
        HOME.style.display = "block";
    } else if (RUTA == "/login") {
        LOGIN.style.display = "block";
    } else if (RUTA == "/registro") {
        REGISTRO.style.display = "block";
    } else if (RUTA == "/personaAgregar") {
        AGREGARP.style.display = "block";
    }
}


/* Hay que ver bien esto. */
function ListarDepartamentos() {

    fetch(`${URLBASE} departamentos.php`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            for (let p of data) {
                let currencies = p.currencies
                for (let codigoMoneda in currencies) {
                    document.querySelector("#pais1").innerHTML += `< option value = "${codigoMoneda}" > ${p.name.common}</option > `
                    document.querySelector("#pais2").innerHTML += `< option value = "${codigoMoneda}" > ${p.name.common}</option > `

                }

            }
        })

}



function cerrarMenu() {

    MENU.close();
}


function OcultarPantallas() {
    HOME.style.display = "none";
    LOGIN.style.display = "none";
    REGISTRO.style.display = "none";
    AGREGARP.style.display = "none";
}



function dqs(id) {
    return document.querySelector("#" + id);
}












function Registro(u) {
    presentLoading();

    fetch(`${URLBASE}usuarios.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(u)
    })
        .then(function (response) {
            console.log(response);
            return response.json();
        })
        .then(function (data) {
            loading.dismiss();
            if (data.codigo == 200) {
                Alertar("Ok", "Aviso", "Registro correcto");
            } else {
                Alertar("Error", "Advertencia", data.mensaje);
            }
        })
}

function Login() {

    let datosLogin = new Object();
    datosLogin.usuario = "censo85";
    datosLogin.password = "censo85";

    fetch(`${URLBASE} login.php`, {
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

    fetch(`${URLBASE} personas.php`, {
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


const loading = document.createElement('ion-loading');
function presentLoading() {
    loading.cssClass = 'my-custom-class';
    loading.message = 'Por favor espere...';
    //loading.duration = 2000;
    document.body.appendChild(loading);
    loading.present();

}


function Alertar(header, subheader, message) {
    const alert = document.createElement('ion-alert');
    alert.cssClass = 'my-custom-class';
    alert.header = header;
    alert.subHeader = subheader;
    alert.message = message;
    alert.buttons = ['OK'];

    document.body.appendChild(alert);
    alert.present();

}

