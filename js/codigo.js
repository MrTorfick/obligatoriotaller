Inicio();

function Inicio() {
  Eventos();
  ArmarMenu();
}

function Eventos() {
  ROUTER.addEventListener("ionRouteDidChange", Navegar); // ionRouteDidChange es un evento que se dispara cuando se cambia de ruta
  dqs("btnRegistrar").addEventListener("click", TomarDatosRegistro);
  dqs("btnLogin").addEventListener("click", TomarDatosLogin);
  DEPARTAMENTO.addEventListener("ionChange", ObtenerCiudades);
  FECHANAC.addEventListener("ionChange", ObtenerCiudades);
  dqs("fechaNac").addEventListener("ionChange", verFecha);
  dqs("btnAgregarPersona").addEventListener("click", AgregarPersona);
}

function verFecha(ev) {
  let nacimiento = new Date(ev.detail.value);
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
  } else {
    Alertar("ERROR", "Advertencia", "Falta algun dato");
  }
}

function ArmarMenu() {
  let hayToken = localStorage.getItem("token");
  let cadena = `<ion-item onclick="cerrarMenu()" href="/">Home</ion-item>`;
  if (hayToken) {
    cadena += `<ion-item onclick="cerrarMenu()" href="/personaAgregar">Agregar Personas</ion-item>
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
    ListarDepartamentos();
  }
}

function AgregarPersona() {
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
        console.log(data);
        if (data.codigo == 200) {
          Alertar("Exito", "Aviso", data.mensaje);
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
          ).innerHTML += `<ion-select-option value="${p.id}">${p.nombre}</ion-select-option>`;
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
          dqs(
            "ciudades"
          ).innerHTML += `<ion-select-option value="${p.id}">${p.nombre}</ion-select-option>`;
        }
      } else {
        Alertar("Error", "Advertencia", data.mensaje);
      }
      loading.dismiss();
    });
}

function ObtenerOcupaciones(mayor) {
  dqs("ocupaciones").innerHTML = "";
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
      console.log(data);
      if ((data.codigo = 200)) {
        for (let p of data.ocupaciones) {
          if (mayor) {
            dqs(
              "ocupaciones"
            ).innerHTML += `<ion-select-option value="${p.id}">${p.ocupacion}</ion-select-option>`;
          } else {
            if (p.id == 5) {
              dqs(
                "ocupaciones"
              ).innerHTML = `<ion-select-option value="${p.id}">${p.ocupacion}</ion-select-option>`;
              break;
            }
          }
        }
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
        alert("datos incorrectos");
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
}

function dqs(id) {
  return document.querySelector("#" + id);
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

function ValidarPersona(p) {

  if (p.idUsuario == "" || p.nombre == "" || p.departamento == "" || p.ciudad == "" || p.fechaNacimiento == "" || p.ocupacion == "") {
    Alertar("Error", "Advertencia", "Verifique los datos ingresados");
    return false;
  }
  return true;

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
        alert("datos incorrectos");
      }
      console.log(data);
    })
    .catch(function (codigo) {
      console.log(codigo);
    });
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
  alert.buttons = ["OK"];

  document.body.appendChild(alert);
  alert.present();
}
