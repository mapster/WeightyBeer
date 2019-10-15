import { Elm } from './src/Main.elm';
import './style/style.css';

document.addEventListener('DOMContentLoaded', function () {
    const app = Elm.Main.init({
        node: document.getElementById('elm')
    });
});