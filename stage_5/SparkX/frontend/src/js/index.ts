import Application from "./src/components/Application";
import "../css/main-window.scss";
import * as webix from "webix";

webix.ready(() => {
    const app = new Application();
    app.init();
    webix.ui(app.config());
    app.attachEvents();
});
