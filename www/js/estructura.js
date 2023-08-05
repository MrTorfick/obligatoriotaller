const URLBASE = `https://censo.develotion.com/`;
const MENU = document.querySelector("#menu");
const ROUTER = document.querySelector("#ruteo");
const HOME = document.querySelector("#pantalla-home");
const LOGIN = document.querySelector("#pantalla-login");
const REGISTRO = document.querySelector("#pantalla-registro");
const AGREGARP = document.querySelector("#pantalla-persona-agregar");
const DEPARTAMENTO = document.querySelector("#departamentos");
const FECHANAC = document.querySelector("#fechaNac");


const NAV = document.querySelector("ion-nav");



class Usuario {

    constructor(usuario, password) {
        this.usuario = usuario;
        this.password = password;
    }
}

class Persona {
    constructor(idUsuario, nombre, departamento, ciudad, fechaNacimiento, ocupacion) {
        this.idUsuario = idUsuario;
        this.nombre = nombre;
        this.departamento = departamento;
        this.ciudad = ciudad;
        this.fechaNacimiento = fechaNacimiento;
        this.ocupacion = ocupacion;
    }
}