import {atom} from 'nanostores'
function fetchDarkMode(){
        if (
            typeof localStorage !== "undefined" &&
            localStorage.getItem("theme")
        ) {
            return localStorage.getItem("theme") === "dark";
        }
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            return true;
        }
        return true;
}
export { fetchDarkMode }