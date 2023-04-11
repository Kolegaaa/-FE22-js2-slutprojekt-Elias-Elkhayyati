

function addStatusUpdateToDOM(statusText: string, userPostsElement: HTMLElement, displayName: string, time: number) {
    const inloggedUserPost = document.createElement('div');
    inloggedUserPost.classList.add('inloggedUserPost');

    const statusUpdateElement = document.createElement('p');
    statusUpdateElement.textContent = statusText;

    const timestampElement = document.createElement('p');
    const timestamp = new Date(time);
    timestampElement.textContent = timestamp.toLocaleString();

    const authorElement = document.createElement('p');
    // authorElement.textContent = `By ${displayName}`;

    inloggedUserPost.appendChild(statusUpdateElement);
    inloggedUserPost.appendChild(timestampElement);
    inloggedUserPost.appendChild(authorElement);

    userPostsElement.prepend(inloggedUserPost);
}

export { addStatusUpdateToDOM }