import CreateRootElement from "../../../helpers/createRootElement";

export default function HelpWindowView(): void {
    const bodyDocument: string = `
        <div class="name_app">Welcome to SparkX</div>
    `;

    CreateRootElement("frameArea", bodyDocument);
}