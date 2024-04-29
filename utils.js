const floatingWindow = document.createElement("div");
floatingWindow.classList.add("UtilitiesWindow");
floatingWindow.style.cssText = "position: fixed; top: 40px; left: 40px; background: #222; padding: 20px; border: 2px solid #00ffcc; box-shadow: 0 0 20px rgba(0, 255, 204, 0.5); display: block; border-radius: 15px; z-index: 9999; font-size: 16px; color: #fff; transition: opacity 0.5s, transform 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55); opacity: 0.8; user-select: none; transform: scale(1);";
const title = document.createElement("div");
title.textContent = `Utils`;
title.style.cssText = "width: 100%; text-align: center; margin-bottom: 20px; font-weight: bold; font-size: 24px; color: #00ffcc; text-shadow: 2px 2px 4px rgba(0, 255, 204, 0.5);";

const elm_open_conts = document.createElement("button");
elm_open_conts.classList.add("button", "OpenContainers", "general");
elm_open_conts.textContent = "Open Containers";
elm_open_conts.style.cssText = "width: 100%; padding: 10px 15px; margin-bottom: 10px; background-color: #00ffcc; border: none; border-radius: 8px; color: #222; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; cursor: pointer; outline: none; transition: background-color 0.3s, color 0.3s;";
elm_open_conts.addEventListener("click", () => {
    floatingWindow.style.opacity = 0;
    setTimeout(() => {
        for (var e = 0; e < 1e3; e++) document.querySelector(".ClosedContainerStyle-moreButton")?.click();
        floatingWindow.style.opacity = 1;
    }, 500);
});

const autoPressButton = document.createElement("button");
autoPressButton.classList.add("button", "AutoPressButton", "general");
autoPressButton.textContent = "Open Button Presser [Disabled]";
autoPressButton.style.cssText = "width: 100%; padding: 10px 15px; margin-bottom: 10px; background-color: #00ffcc; border: none; border-radius: 8px; color: #222; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; cursor: pointer; outline: none; transition: background-color 0.3s, color 0.3s;";
let autoPressInterval;

autoPressButton.addEventListener("click", () => {
    if (autoPressInterval) {
        clearInterval(autoPressInterval);
        autoPressInterval = null;
        autoPressButton.textContent = "Open Button Presser [Disabled]";
    } else {
        autoPressInterval = setInterval(() => {
            document.querySelector(".button.OpenContainers")?.click();
        }, 0);
        autoPressButton.textContent = "Open Button Presser [Enabled]";
    }
});

const autoBuyButton = document.createElement("button");
autoBuyButton.classList.add("button", "AutoBuyButton", "general");
autoBuyButton.textContent = "Auto Buy";
autoBuyButton.style.cssText = "width: 100%; padding: 10px 15px; margin-bottom: 10px; background-color: #00ffcc; border: none; border-radius: 8px; color: #222; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; cursor: pointer; outline: none; transition: background-color 0.3s, color 0.3s;";
autoBuyButton.addEventListener("click", AutoBuy);

const buySuppliesButton = document.createElement("button");
buySuppliesButton.classList.add("button", "BuySuppliesButton", "general");
buySuppliesButton.textContent = "Buy Supplies";
buySuppliesButton.style.cssText = "width: 100%; padding: 10px 15px; margin-bottom: 10px; background-color: #00ffcc; border: none; border-radius: 8px; color: #222; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; cursor: pointer; outline: none; transition: background-color 0.3s, color 0.3s;";
buySuppliesButton.addEventListener("click", () => {
    autoClick("SaleByKitStyle-card");
});

const infoButton = document.createElement("button");
infoButton.classList.add("button", "InfoButton", "general");
infoButton.textContent = "Info";
infoButton.style.cssText = "width: 100%; padding: 10px 15px; margin-bottom: 10px; background-color: #00ffcc; border: none; border-radius: 8px; color: #222; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; cursor: pointer; outline: none; transition: background-color 0.3s, color 0.3s;";
infoButton.addEventListener("click", () => {
    alert("Made by Xx_Sparky_xX and edited by DMF\nTo use it just click on OPEN BUTTON PRESSER, be sure to be in the Containers section and before clicking the OPEN BUTTON PRESSER, in Containers section in-game (not in the UI) press Open, and after you can start the OPEN BUTTON PRESSER.\nEnjoy!");
});

let isDragging = false;
let canDrag = true;
let offsetX, offsetY;

function handleDragStart(e) {
    const target = e.target;
    if (target.classList.contains('button') || target.classList.contains('toogle') || target.classList.contains('switch')) {
        canDrag = false;
        return;
    }
    canDrag = true;
    isDragging = true;
    offsetX = e.clientX - floatingWindow.getBoundingClientRect().left;
    offsetY = e.clientY - floatingWindow.getBoundingClientRect().top;
}

function handleDragMove(e) {
    if (!isDragging || !canDrag) return;
    floatingWindow.style.left = `${e.clientX - offsetX}px`;
    floatingWindow.style.top = `${e.clientY - offsetY}px`;
}

floatingWindow.addEventListener('mousedown', handleDragStart);
document.addEventListener('mousemove', handleDragMove);
document.addEventListener('mouseup', () => { isDragging = false; });

document.addEventListener("keydown", e => {
    if (e.key === "+" && !document.querySelector("input")) {
        if (floatingWindow.style.opacity === "1") {
            floatingWindow.style.opacity = 0;
            floatingWindow.style.transform = 'scale(0)';
            setTimeout(() => { floatingWindow.style.display = "none"; }, 500);
        } else {
            floatingWindow.style.display = "block";
            setTimeout(() => {
                floatingWindow.style.opacity = 1;
                floatingWindow.style.transform = 'scale(1)';
            }, 1);
        }
    }
});

floatingWindow.appendChild(title);
floatingWindow.appendChild(elm_open_conts);
floatingWindow.appendChild(autoPressButton);
floatingWindow.appendChild(autoBuyButton);
floatingWindow.appendChild(buySuppliesButton);
floatingWindow.appendChild(infoButton);
document.body.appendChild(floatingWindow);

document.querySelectorAll('.general').forEach(e => {
    e.addEventListener('mouseenter', () => {
        e.style.backgroundColor = '#00e6b8';
        e.style.color = '#222';
    });
    e.addEventListener('mouseleave', () => {
        e.style.backgroundColor = '#00ffcc';
        e.style.color = '#222';
    });
});

// Your AutoBuy function as it is
let fac;
let cnvrt;
function AutoBuy() {
    const itemCost = prompt("enter the price of the item: ");
    function findAndClick() {
        const elements = document.getElementsByClassName('ShopItemComponentStyle-footerContent');
        for (let element of elements) {
            if (element.textContent.includes(itemCost)) {
                element.click();
                break;
            }
        }
    }
    function convert() {
        const elements = document.getElementsByClassName('Common-flexStartAlignStart');
        for (let element of elements) {
            const text = element.textContent.trim();
            if (text == 'N') {
                element.click();
                break;
            };
        };
    };
    fac = setInterval(findAndClick, 10);
    cnvrt = setInterval(convert, 10);
}

function autoClick(className) {
    function clickElements() {
        var elements = document.querySelectorAll('.' + className);
        elements.forEach(function(element) {
            element.click();
        });
    }
    clickElements();
    setInterval(clickElements, 0);
}
