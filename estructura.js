const URLBASE = `https://censo.develotion.com/`;
const MENU = document.querySelector("#menu");
const ROUTER = document.querySelector("#ruteo");
const HOME = document.querySelector("#pantalla-home");
const LOGIN = document.querySelector("#pantalla-login");
const REGISTRO = document.querySelector("#pantalla-registro");
const AGREGARP = document.querySelector("#pantalla-persona-agregar");


const NAV = document.querySelector("ion-nav");



class Usuario {

    constructor(usuario, password) {
        this.usuario = usuario;
        this.password = password;
    }
}