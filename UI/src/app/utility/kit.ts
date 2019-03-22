function elementFromCoords(element: string, { clientX, clientY }): HTMLElement | Node {
    const elementFromPoint = document.elementFromPoint(clientX, clientY);

    if (elementFromPoint.nodeName === element) {
        return elementFromPoint;
    } else {
        let parent = elementFromPoint.parentNode;
        while (parent.nodeName !== element) {
            if (parent.nodeName === 'BODY') {
                return null;
            }

            parent = parent.parentNode;
        }

        return parent;
    }

}

export { elementFromCoords };