/* PENDIENTE: 


1)
- Hay que ver el tema de las ocupaciones, capaz que conviene una funcion, que rellene las tablas dependiendo de la variable global. (Esto prioridad baja,
  es para que en vez de que se vea la id de la ocupacion, se vea el nombre)



2) Hacer lo que menos tiempo lleva para hacer el mismo dia(6/8/2023)
-Empezar por los censados totales
-Mapa


3) Prioridad baja

-Controlar que no se haga llamadas a la api, sin previamente haber controlado los datos
-Optimizar el codigo completo 



*/






Inicio();

function Inicio() {
  Eventos();
  ArmarMenu();
}




/* ionChange */

function ArmarMenu() {
  let hayToken = localStorage.getItem("token");
  let cadena = `<ion-item onclick="cerrarMenu()" href="/">Home</ion-item>`;
  if (hayToken) {
    cadena += `<ion-item onclick="cerrarMenu()" href="/personaAgregar">Agregar Personas</ion-item>
        <ion-item onclick="Logout()">Logout</ion-item>
        <ion-item onclick="cerrarMenu()" href="/personaListar">Personas censadas</ion-item>
        <ion-item onclick="cerrarMenu()" href="/totalCensados">Total censados</ion-item>`;
  } else {
    cadena += ` <ion-item onclick="cerrarMenu()" href="/login">Login</ion-item>
                <ion-item onclick="cerrarMenu()" href="/registro">Registrar</ion-item>
                 `;
  }

  dqs("menu-opciones").innerHTML = cadena;
}

function Eventos() {
  ROUTER.addEventListener("ionRouteDidChange", Navegar); // ionRouteDidChange es un evento que se dispara cuando se cambia de ruta
  dqs("btnRegistrar").addEventListener("click", TomarDatosRegistro);
  dqs("btnLogin").addEventListener("click", TomarDatosLogin);
  DEPARTAMENTO.addEventListener("ionChange", ObtenerCiudades);
  dqs("fechaNac").addEventListener("ionChange", verFecha);
  dqs("btnAgregarPersona").addEventListener("click", AgregarPersona);
  dqs("buscarOcupaciones").addEventListener("ionChange", GetPersonas);
}

function prueba() {
  alert("hola");
}

function verFecha(ev) {
  let nacimiento = new Date(ev.detail.value);
  OCUPACION = "ocupaciones";
  ObtenerOcupaciones(EsMayor(nacimiento));
}

function EsMayor(fNacimiento) {
  let fnacSumado18 = fNacimiento.setFullYear(fNacimiento.getFullYear() + 18);
  let hoy = new Date();
  if (hoy < fnacSumado18) {
    return false;
  }
  return true;
}

function TomarDatosRegistro() {
  let nom = dqs("regUsuario").value;
  let pas = dqs("regPassword").value;

  if (nom != "" && pas != "") {
    let u = new Usuario(nom, pas);
    Registro(u);
  } else {
    Alertar("Error", "Advertencia", "Faltan datos");
  }
}

function TomarDatosLogin() {
  let nom = dqs("logEmail").value;

  let pas = dqs("logPassword").value;
  if (nom != "" && pas != "") {
    let u = new Usuario(nom, pas);
    Login(u);
    console.log(u);
  } else {
    Alertar("ERROR", "Advertencia", "Falta algun dato");
  }
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
    ListarDepartamentos();
  } else if (RUTA == "/personaListar") {
    LISTARP.style.display = "block";
    GetPersonas();
  } else if (RUTA == "/totalCensados") {
    TOTALCENSADOS.style.display = "block";
    CensadosTotales();
  }
}

function AgregarPersona() {
  presentLoading();
  let p = new Persona();

  p.idUsuario = localStorage.getItem("id");
  p.nombre = dqs("perNombre").value;
  p.departamento = dqs("departamentos").value;
  p.ciudad = dqs("ciudades").value;
  p.fechaNacimiento = dqs("fechaNac").value;
  p.ocupacion = dqs("ocupaciones").value;

  if (ValidarPersona(p)) {
    fetch(`${URLBASE}personas.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: localStorage.getItem("token"),
        iduser: localStorage.getItem("id"),
      },
      body: JSON.stringify(p),
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        loading.dismiss();
        console.log(data);
        if (data.codigo == 200) {
          Alertar("Exito", "Aviso", data.mensaje);
          /* Habria que limpiar los elementos del HTML */
        } else {
          Alertar("Error", "Advertencia", data.mensaje);
        }
      });
  }


}


function ListarDepartamentos() {
  presentLoading();
  fetch(`${URLBASE}departamentos.php`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      apikey: localStorage.getItem("token"),
      iduser: localStorage.getItem("id"),
    },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.codigo == 200) {
        for (let p of data.departamentos) {
          console.log(data);
          dqs(
            "departamentos"
          ).innerHTML += `<ion-select-option value = "${p.id}">${p.nombre}</ion-select-option>`;
        }
      } else {
        console.log(data);
        Alertar("Error", "Advertencia", data.mensaje);
      }
      loading.dismiss();
    });
}

function ObtenerCiudades(id) {
  dqs("ciudades").innerHTML = "";
  presentLoading();

  fetch(`${URLBASE}ciudades.php?idDepartamento=${id.detail.value}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      apikey: localStorage.getItem("token"),
      iduser: localStorage.getItem("id"),
    },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.codigo == 200) {
        for (let p of data.ciudades) {
          dqs("ciudades").innerHTML += `<ion-select-option value = "${p.id}"> ${p.nombre}</ion -select-option>`;
        }
      } else {
        Alertar("Error", "Advertencia", data.mensaje);
      }
      loading.dismiss();
    });
}

function ObtenerOcupaciones(mayor = true) {
  dqs(OCUPACION).innerHTML = "";
  presentLoading();
  fetch(`${URLBASE}ocupaciones.php`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      apikey: localStorage.getItem("token"),
      iduser: localStorage.getItem("id"),
    },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      loading.dismiss();
      console.log(data);
      if ((data.codigo = 200)) {
        for (let p of data.ocupaciones) {
          if (mayor) {
            dqs(OCUPACION).innerHTML += `<ion-select-option value = "${p.id}"> ${p.ocupacion}</ion-select-option>`;
          } else {
            if (p.id == 5) {
              dqs(OCUPACION).innerHTML = `<ion-select-option value = "${p.id}"> ${p.ocupacion}</ion-select-option>`;
              break;
            }
          }
        }
      } else {
        Alertar("Error", "Advertencia", data.mensaje);
      }
    });

}







function GetPersonas() {
  OCUPACION = "buscarOcupaciones";
  ObtenerOcupaciones();
  dqs("listarPersonas").innerHTML = "";
  let idOcupacion = dqs("buscarOcupaciones").value;
  presentLoading();
  fetch(`${URLBASE}personas.php?idUsuario=${localStorage.getItem("id")}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      apikey: localStorage.getItem("token"),
      iduser: localStorage.getItem("id"),
    },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      loading.dismiss();
      if (data.personas.length > 0 && data.codigo == 200) {
        for (let p of data.personas) {
          if (idOcupacion != undefined) {
            let personas = [];
            if (p.ocupacion == idOcupacion) {
              personas.push(p);
            }
            data.personas = personas;
          } else {
            if (data.personas.departamento == 3218) {
              censadosMontevideo++;
            }
          }
        }

        censadosTotalesPorUsuario = data.personas.length;
        ListarPersonas(data);

      } else {
        let mensajeError;
        if (data.codigo !== 200) {
          mensajeError = data.mensaje;
        } else {
          mensajeError = "No se encontraron personas registradas";
        }

        Alertar("Aviso", "Advertencia", mensajeError);
      }

    })

}

function GetTotalCensados() {

  fetch(`${URLBASE}totalCensados.php`, {

    method: "GET",
    headers: {
      "Content-Type": "application/json",
      apikey: localStorage.getItem("token"),
      iduser: localStorage.getItem("id"),
    },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      loading.dismiss();
      console.log(data);
      if (data.codigo == 200) {
        censadosTotales = data.total;
      } else {
        Alertar("Error", "Advertencia", data.mensaje);
      }
    });
}




function CensadosTotales() {
  presentLoading();
  dqs("totalCensados").innerHTML = "";
  GetPersonas();
  GetTotalCensados();
  setTimeout(function () { ListarCensadosTotales() }, 3500);

}

function ListarCensadosTotales() {
  dqs("totalCensados").innerHTML = `
  <ion-row>
  <ion-col style="background-color:teal">${censadosTotalesPorUsuario}</ion-col>
  <ion-col style="background-color:teal">${censadosMontevideo}</ion-col>
  <ion-col style="background-color:teal">${censadosTotales}</ion-col>
  <ion-row>
  `;
}



function ListarPersonas(data) {
  dqs("listarPersonas").innerHTML = "";

  if (data.personas.length >= 1) {

    for (let p of data.personas) {

      dqs("listarPersonas").innerHTML += `
      <ion-row>
      <ion-col style="background-color:teal">${p.nombre}</ion-col>
      <ion-col style="background-color:teal">${p.fechaNacimiento}</ion-col>
      <ion-col style="background-color:teal">${p.ocupacion}</ion-col>
      <ion-col style="background-color: transparent">
      <ion-button color="warning" onclick="EliminarPersona(${p.id})">Eliminar</ion-button>
      </ion-col>
      <ion-row>
      `;
    }
  } else {
    Alertar("Aviso", "Advertencia", "No se encontraron personas registradas que coincidan con la ocupacion seleccionada");
  }


}

/* function ListarOcupaciones(data) {
 
  for (let p of data.ocupaciones) {
 
    dqs(OCUPACION).innerHTML += `<ion-select-option value = "${p.id}"> ${p.ocupacion}</ion-select-option>`;
 
  }
 
} */


function EliminarPersona(id) {
  presentLoading();
  fetch(`${URLBASE}personas.php?idCenso=${id}`, {

    method: "DELETE",

    headers: {
      "Content-Type": "application/json",
      apikey: localStorage.getItem("token"),
      iduser: localStorage.getItem("id"),
    },

  }).then(function (response) {
    return response.json();

  }).then(function (data) {
    console.log(data);
    loading.dismiss();
    if (data.codigo == 200) {
      Alertar("Ok", "Aviso", data.mensaje);
    } else {
      Alertar("Error", "Advertencia", data.mensaje);
    }
    GetPersonas();
  })
}

function Registro(u) {
  presentLoading();

  fetch(`${URLBASE}usuarios.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(u),
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
    });
}



function Login(u) {
  presentLoading();
  fetch(`${URLBASE}login.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(u),
  })
    .then(function (response) {
      console.log(response);
      return response.json();
    })
    .then(function (data) {
      if (data.codigo == 200) {
        localStorage.setItem("token", data.apiKey);
        localStorage.setItem("id", data.id);
        NAV.push("page-home");
        ArmarMenu();
        loading.dismiss();
      } else {
        loading.dismiss();
        Alertar("Error", "", data.mensaje);
      }
      console.log(data);
    })
    .catch(function (codigo) {
      console.log(codigo);
    });
}

function cerrarMenu() {
  MENU.close();
}

function OcultarPantallas() {
  HOME.style.display = "none";
  LOGIN.style.display = "none";
  REGISTRO.style.display = "none";
  AGREGARP.style.display = "none";
  LISTARP.style.display = "none";
  TOTALCENSADOS.style.display = "none";
}

function dqs(id) {
  return document.querySelector("#" + id);
}



function ValidarPersona(p) {

  if (p.idUsuario == "" || p.nombre == "" || p.departamento == "" || p.ciudad == "" || p.fechaNacimiento == "" || p.ocupacion == "") {
    Alertar("Error", "Advertencia", "Verifique los datos ingresados");
    return false;
  }
  return true;

}

const loading = document.createElement("ion-loading");
function presentLoading() {
  loading.cssClass = "my-custom-class";
  loading.message = "Por favor espere...";
  //loading.duration = 2000;
  document.body.appendChild(loading);
  loading.present();
}

function Alertar(header, subheader, message) {
  const alert = document.createElement("ion-alert");
  alert.cssClass = "my-custom-class";
  alert.header = header;
  alert.subHeader = subheader;
  alert.message = message;
  alert.buttons = ["Aceptar"];

  document.body.appendChild(alert);
  alert.present();
}
