const sim = () => {
    const body = document.querySelector("body");
    let isMouse = false;
    let index = 0;
    let x = 0;
    let y = 0;

    window.addEventListener("load", () => {
        window.addEventListener('mousedown', () => {
            isMouse = true;
            window.addEventListener('mousemove', (e) => {
                x = e.clientX;
                y = e.clientY;
                if (isMouse) {
                    const zz = document.createElement("div");
                    body.append(zz);
                    index++;
                    zz.style = `position: fixed;
                    top: ${y}px;
                    left: ${x}px;
                    width: 0px;
                    height: 0px;
                    border-radius: 50%;
                    transform: translate(-50%, -50%);
                    background-color :#${generateRandomSequence()};
                    transition: all .5s;
                    z-index: ${index};
                    `
                    setTimeout(() => {
                        zz.style.width = "20px";
                        zz.style.height = "20px";
                        zz.style.opacity = "0.5";
                    }, 0);
                }
            });
        });

        window.addEventListener('mouseup', () => {
            isMouse = false;
        });
    })
}

function getRandomCharacter() {
    const characters = 'abcdef0123456789';
    const randomIndex = Math.floor(Math.random() * characters.length);
    return characters[randomIndex];
}

function generateRandomSequence() {
    let sequence = '';
    for (let i = 0; i < 6; i++) {
        sequence += getRandomCharacter();
    }
    return sequence;
}

export default sim;

