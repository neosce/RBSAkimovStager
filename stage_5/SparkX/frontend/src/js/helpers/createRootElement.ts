export default function CreateRootElement(idName: string, bodyDocument: string): void {
    const element: HTMLDivElement = document.createElement('div');

    element.setAttribute("id", idName);
    document.body.append(element);

    element.innerHTML = `${bodyDocument}`;
}
