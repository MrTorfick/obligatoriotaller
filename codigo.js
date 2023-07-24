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
            } else {
                alert("datos incorrectos")
            }
            console.log(data);
        }).catch(function (codigo) {
            console.log(codigo);
        })
}