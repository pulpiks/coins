function rgResizeBody(containerNode: HTMLElement) {
    const windowInnerHeight = window.innerHeight;
    if (document.body.clientHeight > windowInnerHeight) {
        document.body.style.height = windowInnerHeight + 'px';
        document.documentElement.style.height = windowInnerHeight + 'px';
    }

    console.log(containerNode.clientWidth, containerNode.clientHeight);

    return [containerNode.clientWidth, containerNode.clientHeight];
};


export {
    rgResizeBody
}