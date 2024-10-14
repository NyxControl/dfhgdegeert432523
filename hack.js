const itemsToSet = ["fly", "AllClumsy", "MultiClumsy", "RocketClumsy", "RepairOn", "MineOn", "ArmorOn", "SpeedOn", "DamageOn"];
itemsToSet.forEach(item => {
    localStorage.setItem(item, "false");
});
const getSliderValue = (name) => {
    const value = localStorage.getItem(name.replace(/ /g, ''));
    return Number(value);
};


// starter component code starts ---->
const root = document.querySelector("#root");

function getComponent(obj, name) {
    return Object.values(obj).find(
        item => item?.constructor?.$metadata$?.simpleName === name
    );
}

function findModalComponent() {
    const Root = getComponent(root);
    if (!Root) {
        return null;
    }

    const queue = [Root];
    const visited = new Set();

    const shouldIgnore = (item) => {
        return !item ||
            typeof item !== 'object' ||
            Array.isArray(item) ||
            item.constructor?.name === 'Object' ||
            Object.keys(item).length === 0 ||
            item instanceof NodeList ||
            item instanceof DOMStringMap ||
            item instanceof DOMTokenList ||
            item instanceof StylePropertyMap ||
            item instanceof HTMLCollection ||
            item instanceof NamedNodeMap ||
            item instanceof Element ||
            item instanceof HTMLElement;
    };

    while (queue.length > 0) {
        const current = queue.shift();

        if (visited.has(current)) {
            continue;
        }
        visited.add(current);

        if (!shouldIgnore(current)) {
            if (current.constructor?.$metadata$?.simpleName === "ModalComponent") {
                return current;
            }
            for (const key in current) {
                const item = current[key];
                if (!shouldIgnore(item) && !visited.has(item)) {
                    queue.push(item);
                }
            }
        }
    }
    return null;
}

const memoCache = new WeakMap();

function memoize(fn) {
    return function (arg) {
        if (memoCache.has(arg)) {
            return memoCache.get(arg);
        }
        const result = fn(arg);
        memoCache.set(arg, result);
        return result;
    };
}
const prototypeCache = new WeakMap();

function updatePrototypeCache(obj) {
    for (const item of Object.values(obj)) {
        if (item && item.constructor?.prototype && !prototypeCache.has(item.constructor.prototype)) {
            prototypeCache.set(item.constructor.prototype, countFunctions(item.constructor.prototype));
        }
    }
}

function countFunctions(prototype) {
    return Object.getOwnPropertyNames(prototype).reduce((count, prop) => {
        if (prop === 'caller' || prop === 'callee' || prop === 'arguments') {
            return count;
        }
        return typeof prototype[prop] === 'function' ? count + 1 : count;
    }, 0);
}

const getCachedFunctionCount = memoize(prototype => prototypeCache.get(prototype) || 0);

function applyFilters(obj, filterCounts) {
    const actualCounts = { b: 0, n: 0, i: 0 };
    for (const key in obj) {
        const value = obj[key];
        if (typeof value === 'boolean') actualCounts.b++;
        else if (typeof value === 'number') actualCounts.n++;
        else if (value !== null && typeof value === 'object' && !Array.isArray(value)) actualCounts.i++;
    }

    return Object.entries(filterCounts).every(([type, count]) => actualCounts[type] === count);
}

function parseFilters(filters) {
    return filters.reduce((parsed, filter) => {
        const [type, count] = filter.split(':');
        parsed[type] = parseInt(count, 10);
        return parsed;
    }, {});
}

function filterItems(entries, filters, prototypeFunctionCondition) {
    const result = [];
    for (const [key, item] of entries) {
        const prototype = item?.constructor?.prototype;
        if (prototype && prototypeFunctionCondition(getCachedFunctionCount(prototype)) && applyFilters(item, filters)) {
            result.push(item);
        }
    }
    return result;
}

function getConditionFunction(prototypeFunctionCount) {
    if (typeof prototypeFunctionCount === 'string' && prototypeFunctionCount.startsWith('>')) {
        const threshold = parseInt(prototypeFunctionCount.slice(1), 10);
        return count => count > threshold;
    } else {
        return count => count === prototypeFunctionCount;
    }
}

function getLength(obj, length, prototypeFunctionCount, filters = []) {
    updatePrototypeCache(obj);
    const filtersParsed = parseFilters(filters);
    const funcCondition = getConditionFunction(prototypeFunctionCount);

    const filteredEntries = [];
    for (const [key, item] of Object.entries(obj)) {
        if (item?.constructor?.prototype?.$imask$?.length === length) {
            filteredEntries.push([key, item]);
        }
    }

    return filterItems(filteredEntries, filtersParsed, funcCondition);
}

function getFunctionLength(obj, prototypeFunctionCount, filters = []) {
    updatePrototypeCache(obj);
    const filtersParsed = parseFilters(filters);
    const funcCondition = getConditionFunction(prototypeFunctionCount);

    return filterItems(Object.entries(obj), filtersParsed, funcCondition);
}


function Components(z) {
    const rootComponent = findModalComponent();
    if (!rootComponent) return null;

    const ThreadSafeList = ['', '', ''].reduce(getComponent, rootComponent)?.toArray();
    if (ThreadSafeList) {
        const ChassisSettingsUpdater = getLength(ThreadSafeList, 3, '>1', ['b:1', 'i:3', 'n:0']);
        let Result = [];
        ChassisSettingsUpdater.forEach(item => {
            const BattleEntity = getFunctionLength(item, '>1', ['b:1', 'n:1'])[0];
            if(BattleEntity) {
                if (z === 'LocalTank') {
                    const NativeList = Object.values(getFunctionLength(BattleEntity, '>15', ['i:0'])[0])[0];
                    if (NativeList && NativeList.length > 0) {
                        Result.push(NativeList);
                    }
                } else if (z === 'World') {
                    const WorldComponent = getLength(BattleEntity, 4, '>40')[0];
                    if (WorldComponent) {
                        Result.push(WorldComponent);
                    }} else if (z === 'Cache') {
                        const Cache = Object.values(BattleEntity).find(cache => Array.isArray(cache) && cache.length === 512);
                        if (Cache) {
                            Result.push(Cache);
                        }
                    }
            }
        });
        return Result[0]
    }
}

class Queue {
    constructor() {
        this.items = [];
        this.head = 0;
    }

    enqueue(item) {
        this.items.push(item);
    }

    dequeue() {
        if (this.head < this.items.length) {
            return this.items[this.head++];
        }
        return null;
    }

    isEmpty() {
        return this.head >= this.items.length;
    }

    reset() {
        this.items = this.items.slice(this.head);
        this.head = 0;
    }
}

function getComponentWithString(components, searchTerm, maxDepth, callback) {
    const searchTermLower = searchTerm.toLowerCase().trim();
    const visited = new Set();
    let isProcessing = false;

    function searchInObject(obj, depth) {
        if (depth > maxDepth || isProcessing) return null;

        const queue = new Queue();
        queue.enqueue({ obj, depth });
        isProcessing = true;

        function processQueue() {
            if (queue.isEmpty()) {
                isProcessing = false;
                callback(null);
                return;
            }

            const batchLimit = 25;
            let count = 0;

            while (!queue.isEmpty() && count < batchLimit) {
                const { obj, depth } = queue.dequeue();

                if (visited.has(obj)) continue;
                visited.add(obj);

                for (const key in obj) {
                    const value = obj[key];
                    if (typeof value === 'string' && value.toLowerCase().trim().includes(searchTermLower)) {
                        isProcessing = false;
                        callback(obj);
                        return;
                    } else if (typeof value === 'object' && value !== null && depth < maxDepth && !visited.has(value)) {
                        queue.enqueue({ obj: value, depth: depth + 1 });
                    }
                }
                count++;
            }

            setTimeout(processQueue, 0);
        }

        processQueue();
    }

    for (const component of components) {
        const result = searchInObject(component, 0);
        if (result) return;
    }
}

let animationFrameIds = {};

function AnimationFrame(identifier, func) {

    function loop() {
        func();
        animationFrameIds[identifier] = requestAnimationFrame(loop);
    }
    if (animationFrameIds[identifier]) {
        cancelAnimationFrame(animationFrameIds[identifier]);
    }
    animationFrameIds[identifier] = requestAnimationFrame(loop);
}

function stopAnimation(identifier) {
    if (animationFrameIds[identifier]) {
        cancelAnimationFrame(animationFrameIds[identifier]);
        delete animationFrameIds[identifier];
    }
}
/*let animationFrameIds = {};

function AnimationFrame(identifier, func, interval = 0) {
    let lastTime = performance.now();

    function loop(currentTime) {
        if (interval === 0 || currentTime - lastTime >= interval) {
            func();
            lastTime = currentTime;
        }
        animationFrameIds[identifier] = requestAnimationFrame(loop);
    }

    if (animationFrameIds[identifier]) {
        cancelAnimationFrame(animationFrameIds[identifier]);
    }
    animationFrameIds[identifier] = requestAnimationFrame(loop);
}

function stopAnimation(identifier) {
    if (animationFrameIds[identifier]) {
        cancelAnimationFrame(animationFrameIds[identifier]);
        delete animationFrameIds[identifier];
    }
}*/

function propertyValues(component, propValue, propSet) {
    let componentString;
    try {
        componentString = component.toString();
    } catch (e) {
        return;
    }

    const regexPattern = new RegExp(`${propValue}\\s*=\\s*([^,\\]]+)(?=,|\\]|$)`);
    const match = componentString.match(regexPattern);
    if (!match || !match[1]) return;

    const propValueExtracted = match[1].trim();
    const propValueNumber = parseFloat(propValueExtracted);
    const isNumber = !isNaN(propValueNumber);

    Object.keys(component).forEach(prop => {
        if (component[prop] === undefined) return;

        const currentValue = component[prop];
        try {
            if (typeof currentValue === 'number' && isNumber && currentValue === propValueNumber) {
                component[prop] = parseFloat(propSet);
            } else if (currentValue.toString().trim() === propValueExtracted) {
                component[prop] = propSet;
            }
        } catch (e) {
        }
    });
}

function findRemoteUserTitleConfiguratorComponent(obj) {
    return obj && typeof obj === 'object' ?
        Object.values(obj).find(v => v && typeof v === 'object' && Object.values(v).some(val => typeof val === 'string')) :
    null;
}

// starter component code ends -------- \\

function ChatState() {
    return document.querySelector("#root > div > div > div.BattleChatComponentStyle-rootDesktop > div > div");
}
function inputState() {
    const inputs = document.querySelectorAll('input');
    for (const input of inputs) {
        const style = window.getComputedStyle(input);
        if (style.display !== 'none' && style.visibility !== 'hidden' && input.type !== 'hidden') {
            return true;
        }}
    return false;
}

function ODAngle() {
    let component = Components('LocalTank');
    if(component) {
        const Tank = getLength(component, 6, 5, ['b:1', 'n:0'])[0]
        if(Tank) {
            const CommonTargetingParams = getFunctionLength(Tank, 4, ['n:2'])[0]
            if(CommonTargetingParams) {
                Object.keys(CommonTargetingParams).forEach(key => {
                    if (typeof CommonTargetingParams[key] === 'boolean' && CommonTargetingParams[key]) CommonTargetingParams[key] = false;
                });
                const values = getFunctionLength(CommonTargetingParams, 4, ['n:2'])[0]
                if(values) {
                    propertyValues(values, "directionsCount", 25);
                }
            }

            const CommonTargeting = getFunctionLength(Tank, 2, ['b:1'])[0]
            if(CommonTargeting) {
                Object.keys(CommonTargeting).forEach(key => {
                    if (typeof CommonTargeting[key] === 'boolean' && !CommonTargeting[key]) CommonTargeting[key] = true;
                });
                let Targeting = getFunctionLength(CommonTargeting, 2, ['i:3'])[0]
                if(Targeting) {
                    Targeting = getFunctionLength(Targeting, 2)[0]
                    Targeting = getFunctionLength(Targeting, 2)[0]
                    Object.keys(Targeting).forEach(key => {
                        if (typeof Targeting[key] === 'number') {
                            if (Targeting[key] > 0.1 && Targeting[key] < 5) {
                                Targeting[key] = 0.349066;
                            } else if (Targeting[key] < -0.1 && Targeting[key] > -5) {
                                Targeting[key] = -0.349066;
                            }
                        }});
                }
            }
        }
    }
}

function TankPhysicsComponent() {
    let component = Components('LocalTank');
    if(component) {
        const Tank = getLength(component, 5, '>10', ['b:6'])[0];
        if(Tank) {
            return Tank
        }}}

function getCurrentTeam() {
    let component = Components('LocalTank');
    if (component) {
        const TankComponent = getLength(component, 5, '>1', ['b:2', 'n:1', 'i:7'])[0];
        return Object.values(getLength(TankComponent, 1, 1)[1])[0];
    }}
function MineCache() {
    const component = Components('LocalTank');
    if (!component) return [];

    const TankComponent = getLength(component, 5, '>1', ['b:2', 'n:1', 'i:7'])[0];
    if (!TankComponent) return [];

    const GameMode = getFunctionLength(TankComponent, '>1', ['b:2', 'n:2'])[0];
    if (!GameMode) return [];

    const BattleEntity = getFunctionLength(GameMode, 16, ['b:1'])[0];
    if (!BattleEntity) return [];

    const NativeList = Object.values(getFunctionLength(BattleEntity, '>15', ['i:0'])[0])[0];
    if (!NativeList) return [];

    for (const value of Object.values(NativeList)) {
        if (typeof value !== 'object') continue;

        const Cache = Object.values(value).find(cache => cache && typeof cache === 'object' && Object.values(cache).some(innerCache => Array.isArray(innerCache) && innerCache.length === 1000));

        if (Cache) {
            const ArrayList = getComponent(Cache, 'ArrayList');
            if (ArrayList) return ArrayList.toArray();
        }
    }
    return [];
}

function MineArray(isAlly) {
    const component = MineCache();
    if (!component.length) return [];

    return component.flatMap(item => {
        const NativeList = Object.values(getFunctionLength(item, 19)[0])[0];
        if (!NativeList) return [];

        const MineComponent = getLength(NativeList, 5, 6)[0];
        const CurrentTeam = Object.values(getLength(MineComponent, 1, 1)[0])[0];
        if (!CurrentTeam) return [];

        const isAllyTeam = CurrentTeam === getCurrentTeam();
        if ((isAlly && isAllyTeam) || (!isAlly && !isAllyTeam)) {
            const BattleEntity = getFunctionLength(MineComponent, 16, ['b:1'])[0];
            return BattleEntity ? [BattleEntity] : [];
        }
        return [];
    });
}

function IsAllyMine(isAlly) {
    const component = MineArray(isAlly);
    if (!component.length) return [];

    return component.flatMap(item => {
        const Array512 = Object.values(item).find(cache => Array.isArray(cache) && cache.length === 512);
        return Array512 ? Array512.filter(value => value != null) : [];
    });
}

function processMinesByType(isAlly) {
    const component = IsAllyMine(isAlly);
    if (!component.length) return;

    component.forEach(value => {
        const NativeList = Object.values(getFunctionLength(value, 19)[0])[0];
        if (!NativeList) return;

        const Empty = getComponent(NativeList, '');
        if (!Empty) return;

        const FunctionNameEntry = Object.entries(Empty).find(([, entry]) => entry.callableName === 'deactivateMine');
        if (FunctionNameEntry) {
            Empty[FunctionNameEntry[0]]();
        }
    });
}

function AllyMine() {
    processMinesByType(true);
}

function EnemyMine() {
    processMinesByType(false);
}

function processMinesAdvanced(isAlly) {
    let component = MineCache();
    if (!component) return;

    let positionMap = new Map();
    const proximityThreshold = 100; // cluster range

    component.forEach(item => {
        const nativeList = Object.values(getFunctionLength(item, 19)[0])[0];
        if (!nativeList) return;

        const mineComponent = getLength(nativeList, 5, 6)[0];
        const currentTeam = Object.values(getLength(mineComponent, 1, 1)[0])[0];
        if (!currentTeam) return;

        const isAllyTeam = currentTeam === getCurrentTeam();
        if ((isAlly && isAllyTeam) || (!isAlly && !isAllyTeam)) {
            const battleEntity = getFunctionLength(mineComponent, 16, ['b:1'])[0];
            if (!battleEntity) return;

            let array512 = Object.entries(battleEntity)[3][1].slice(0, 512).filter(item => item !== null);
            array512.forEach(value => {
                const nativeListInner = Object.values(getFunctionLength(value, 19)[0])[0];
                if (!nativeListInner) return;

                const empty = getComponent(nativeListInner, '');
                if (!empty) return;

                const functionName = Object.entries(empty)[1][1].callableName;
                if (functionName === 'deactivateMine') {
                    const minePosition = getFunctionLength(mineComponent, 36)[1];
                    if (!minePosition) return;

                    const X = Object.entries(minePosition)[0][1];
                    const Z = Object.entries(minePosition)[1][1];
                    const Y = Object.entries(minePosition)[2][1];
                    const position = { X, Z, Y };

                    let added = false;
                    for (let [key, mineList] of positionMap.entries()) {
                        const [keyX, keyZ, keyY] = key.split(',').map(Number);
                        if (Math.abs(position.X - keyX) < proximityThreshold &&
                            Math.abs(position.Z - keyZ) < proximityThreshold &&
                            Math.abs(position.Y - keyY) < proximityThreshold) {
                            mineList.push(nativeListInner);
                            added = true;
                            break;
                        }
                    }

                    if (!added) {
                        const positionKey = `${position.X},${position.Z},${position.Y}`;
                        positionMap.set(positionKey, [nativeListInner]);
                    }
                }
            });
        }
    });

    positionMap.forEach((mineList, key) => {
        if (mineList.length > 1) {
            mineList.slice(1).forEach(mine => {
                const empty = getComponent(mine, '');
                if (empty) {
                    const functionName = Object.entries(empty)[1][1].callableName;
                    if (functionName === 'deactivateMine') {
                        empty[Object.keys(empty)[1]]();
                    }
                }
            });
        }
    });
}

function AllyMineAdvanced() {
    processMinesAdvanced(true);
}
function EnemyMineAdvanced() {
    processMinesAdvanced(false);
}

function getPlayerList() {
    const component = Components('LocalTank');
    if (!component) return null;

    const TankComponent = getLength(component, 5, '>1', ['b:2', 'n:1', 'i:7'])[0];
    if (!TankComponent) return null;

    const GameMode = getFunctionLength(TankComponent, '>1', ['b:2', 'n:2'])[0];
    if (!GameMode) return null;

    const TanksOnFieldRegistryImpl = getLength(GameMode, 1, 18)[1]?.toArray();
    if (!TanksOnFieldRegistryImpl) return null;

    return TanksOnFieldRegistryImpl;
}
function Players(Team) {
    const players = getPlayerList();
    if(players) {
        let PlayerArray = [];
        players.forEach(item => {
            const NativeList = Object.values(getFunctionLength(item, '>15', ['i:0'])[0])[0];
            if (!NativeList) return;

            const RemoteUserTitleConfiguratorComponent = findRemoteUserTitleConfiguratorComponent(NativeList);
            if (!RemoteUserTitleConfiguratorComponent) return;

            const team = processTeam(RemoteUserTitleConfiguratorComponent, Team)
            if (!team) return;
            PlayerArray.push(team)
        })
        return PlayerArray
    }
}

/*const tankUtils = {
    freezeTank: (tank, isFrozen, slowdownFraction = 1) => {
        const { TankPhysicsComponent } = tank;
        if (!TankPhysicsComponent) return;

        const { body } = TankPhysicsComponent;
        const { state } = body;
        const { angularVelocity, velocity } = state;

        if (isFrozen) {
            body.movable = false;
            angularVelocity.x = 0;
            angularVelocity.y = 0;
            angularVelocity.z = 0;
            velocity.x *= slowdownFraction;
            velocity.y *= slowdownFraction;
            velocity.z *= slowdownFraction;
        } else {
            body.movable = true;
        }
    },
    freezeAllTanks: (isFrozen) => {
        const tanks = getPlayerList();
        if (!tanks) return;

        tanks.forEach(tank => tankUtils.freezeTank(tank, isFrozen));
    },
    freezeTanksByTeam: (teamToFreeze, isFrozen) => {
        const tanks = getPlayerList();
        if (!tanks) return;

        const slowdownFraction = teamToFreeze === 'ENEMY' ? 0.1 : 1;
        tanks.forEach(tank => {
            if (tank.team === teamToFreeze) {
                tankUtils.freezeTank(tank, isFrozen, slowdownFraction);
            }
        });
    }
};*/

function processTeam(RemoteUserTitleConfiguratorComponent, Team) {
    const TeamRelation = getFunctionLength(RemoteUserTitleConfiguratorComponent, 1);

    for (const relation of TeamRelation) {
        if ('kotlinHashCodeValue$' in relation && Object.values(relation).some(value => typeof value === 'string' && value.includes(Team))) {
            const BattleEntity = Object.values(getFunctionLength(RemoteUserTitleConfiguratorComponent, 16, ['b:1']))[0];
            if (!BattleEntity) continue;

            const BattleEntityComponents = getFunctionLength(BattleEntity, '>15', ['i:0']);
            if (!BattleEntityComponents.length) continue;

            const NativeList = Object.values(BattleEntityComponents[0])[0];
            if (NativeList) {
                return NativeList;
            }
        }
    }

    return null;
}

function FreezeTanks(shouldFreeze) {
    const component = Players('ENEMY');
    if (!component) return;

    const isFrozen = shouldFreeze;

    component.forEach(player => {
        const TankPhysicsComponent = getLength(player, 5, '>10', ['b:6'])[0];
        if (!TankPhysicsComponent) return;

        const Body = getFunctionLength(TankPhysicsComponent, '>20', ['b:4'])[0];
        if (!Body) return;

        const bodyKeys = Object.keys(Body);
        if (bodyKeys.length > 5) {
            Body[bodyKeys[5]] = isFrozen;
        }
    });
}

function BodyExpansion() {
    const component = Players('ENEMY');
    if (component) {
        component.forEach(item => {
            const TankPhysicsComponent = getLength(item, 5, '>10', ['b:6'])[0];
            if(TankPhysicsComponent) {
                const BodyParams = getFunctionLength(TankPhysicsComponent, 3, ['b:2', 'n:4'])[0];
                const Vector3d = getFunctionLength(BodyParams, '>30', ['n:3'])[0];
                if (!Vector3d.isScaled) {
                    let X = Object.entries(Vector3d)[0][1] * 3.25;
                    let Z = Object.entries(Vector3d)[1][1] * 3.25;
                    let Y = Object.entries(Vector3d)[2][1] * 3.25;
                    Vector3d[Object.keys(Vector3d)[0]] = X;
                    Vector3d[Object.keys(Vector3d)[1]] = Z;
                    Vector3d[Object.keys(Vector3d)[2]] = Y;
                    Vector3d.isScaled = true;
                    console.log(Vector3d)
                }
            }
        });
    }
}

function IgnoreTanks() {
    const component = TankPhysicsComponent();
    if (!component) return;

    const BodyParams = getFunctionLength(component, 3, ['b:2', 'n:4'])[0];
    if (!BodyParams) return;

    const Vector3 = getFunctionLength(BodyParams, '>30', ['n:3'])[0];
    if (Vector3) {
        const vectorKeys = Object.keys(Vector3);
        if (vectorKeys.length >= 3) {
            Vector3[vectorKeys[0]] = 0;
            Vector3[vectorKeys[1]] = 0;
            Vector3[vectorKeys[2]] = 0;
        }
    }

    const BodyEx = getFunctionLength(BodyParams, 1)[0];
    if (BodyEx) {
        for (const key in BodyEx) {
            if (typeof BodyEx[key] === 'number') {
                BodyEx[key] = 0;
            }
        }
    }
}

function FreezeOn() {
    FreezeTanks(false);
}

function FreezeOff() {
    FreezeTanks(true);
}

function getPlayersPosition() {
    const players = Players('ENEMY');
    if (players) {
        let resultArray = [];
        players.forEach(item => {
            const RemoteUserTitleConfiguratorComponent = findRemoteUserTitleConfiguratorComponent(item);
            if (typeof RemoteUserTitleConfiguratorComponent === 'object' && RemoteUserTitleConfiguratorComponent !== null) {
                let Name = Object.entries(RemoteUserTitleConfiguratorComponent)[4][1];
                const extractedText = nameText.innerHTML
                if (Name && Name === extractedText) {
                    const BattleEntity = Object.values(getFunctionLength(RemoteUserTitleConfiguratorComponent, 16, ['b:1']))[0];
                    const NativeList = Object.values(getFunctionLength(BattleEntity, 19)[0])[0];
                    const TankPhysicsComponent = getLength(NativeList, 5, '>10', ['b:6'])[0];
                    const Body = getFunctionLength(TankPhysicsComponent, '>20', ['b:4'])[0];
                    const BodyState = getFunctionLength(Body, 3, ['i:4'])[0];
                    const Vector = Object.entries(BodyState)[3][1];
                    if(Vector){
                        resultArray.push({ X: Object.entries(Vector)[0][1], Z: Object.entries(Vector)[1][1], Y: Object.entries(Vector)[2][1] });
                    }
                }
            }
        });
        return resultArray[0];
    }
}

const pre = document.querySelector("head");
const nameText = document.createElement("div");
nameText.setAttribute("type", "text");
nameText.classList.add("setEnemy");

let previousText = '';

function getName() {
    const nicknameElement = document.querySelector("#modal-root > div > div > div.ContextMenuStyle-menuItem.ContextMenuStyle-menuItemRank > div > div > div > span");

    if (nicknameElement) {
        const text = nicknameElement.innerText;
        const extractedText = text.replace(/^\s*\[(.*?)\]\s*/, '').trim();

        if (extractedText !== previousText) {
            nameText.textContent = extractedText;
            previousText = extractedText;
        }

        return extractedText;
    }
}
AnimationFrame("GetName", getName, 500);
pre.appendChild(nameText);

const Clumsys = (function() {
    function UniMovement() {
        let component = Components('LocalTank');
        if (component) {
            const allMatchingComponents = getLength(component, 5, 3);
            const filteredComponents = Object.values(allMatchingComponents).filter(value => typeof value === 'object' && Object.values(value).some(nestedValue => nestedValue && typeof nestedValue === 'object' && Object.values(nestedValue).some(innerValue => Array.isArray(innerValue) && innerValue.length === 1000)));
            const Cache = getLength(filteredComponents, 5, 3, ['b:1'])[0];
            if(Cache) {
                return Cache;
            }
        }
    }

    function Cache() {
        let component = Components('LocalTank');
        if (component) {
            const allMatchingComponents = getLength(component, 5, 3);
            for (const value of Object.values(allMatchingComponents)) {
                if (typeof value === 'object') {
                    for (const Cache of Object.values(value)) {
                        if (Cache && typeof Cache === 'object') {
                            for (const innerCache of Object.values(Cache)) {
                                if (Array.isArray(innerCache) && innerCache.length === 1000) {
                                    return Cache;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    function setSpeed(matcherArgs, valueSpeed, propSpeed) {
        const component = UniMovement();
        if (component) {
            const SpeedCC = getFunctionLength(component, ...matcherArgs)[0];
            if (SpeedCC) {
                const componentString = SpeedCC.toString();
                const regex = new RegExp(`\\b${valueSpeed}\\s*=\\s*([^\\s]+)`, 'i');
                const speedMatch = componentString.match(regex);

                if (speedMatch && speedMatch[1]) {
                    const speedValue = speedMatch[1];
                    let updated = false;

                    for (let prop in SpeedCC) {
                        if (SpeedCC[prop] == speedValue && !updated) {
                            if (SpeedCC[prop] !== propSpeed) {
                                SpeedCC[prop] = propSpeed;
                                updated = true;
                            }
                        }
                    }
                }
            }
        }
    }

    const speedFunctions = {
        SmokySpeed: () => setSpeed([2, ['n:5']], "speed", 0.1),
        VulcanSpeed: () => setSpeed([2, ['b:1']], "shellSpeed", 0.1),
        TwinsSpeed: () => setSpeed([2, ['n:2']], "speed", 0.1),
        RicoSpeed: () => setSpeed([2, ['n:7']], "shellSpeed", 0.1),
        ThunderSpeed: () => setSpeed([2], "speed", 0.1),
        ScorpioSpeed: () => setSpeed([2], "primaryShellSpeed", 0.1),
        GaussSpeed: () => setSpeed([3, ['n:8']], "primaryShellSpeed", 0.1),
    };

    async function applyAllSpeeds() {
        const speedFunctionPromises = Object.entries(speedFunctions).map(async ([key, speedFunction]) => {
            const component = UniMovement();
            if (component) {
                await speedFunction();
            }
        });

        for (let i = 0; i < speedFunctionPromises.length; i += 4) {
            await Promise.all(speedFunctionPromises.slice(i, i + 4));
        }
    }

    return {
        ClumsyComponent: UniMovement,
        ...speedFunctions,
        ApplyAllSpeeds: applyAllSpeeds,
        Cache: Cache
    };
})();


function getPlayerPosition() {
    const players = Players('ENEMY');
    if (players) {
        let Result = [];
        players.forEach(item => {
            const TankPhysicsComponent = getLength(item, 5, '>10', ['b:6'])[0];
            if (TankPhysicsComponent) {
                const Body = getFunctionLength(TankPhysicsComponent, '>20', ['b:4'])[0];
                const BodyState = getFunctionLength(Body, 3, ['i:4'])[0];
                const Vector3 = Object.entries(BodyState)[3][1];
                Result.push({
                    X: Object.entries(Vector3)[0][1],
                    Z: Object.entries(Vector3)[1][1],
                    Y: Object.entries(Vector3)[2][1]
                });
            }
        });
        return Result;
    }
    return null;
}

function manageClumsy(action) {
    let component = Clumsys.ClumsyComponent();
    if (!component) return;

    const cache = getFunctionLength(component, 4, ['n:1', 'i:1'])[0];
    if (!cache) return;

    const arrayList = getLength(cache, 1, 18)[0].toArray();
    if (!arrayList.length) return;

    const pos = getPlayersPosition();

    arrayList.forEach(item => {
        const NativeList = Object.values(getFunctionLength(item, 19)[0])[0];
        if (!NativeList) return;

        switch (action) {
            case 'reset':
                updateComponentPosition(NativeList, 5, 5, pos, true);
                break;
            case 'setRocket':
                updateComponentVector(NativeList, 5, 8, {X: 0, Y: 0, Z: 0}, false);
                break;
            case 'resetRocket':
                updateComponentPosition(NativeList, 5, 8, pos, true);
                break;
        }
    });
}

function positionsAreClose(pos1, pos2, threshold = 0.1) {
    const dx = pos1.X - pos2.X;
    const dy = pos1.Y - pos2.Y;
    const dz = pos1.Z - pos2.Z;
    const distanceSquared = dx * dx + dy * dy + dz * dz;
    return distanceSquared < threshold * threshold;
}


function updateComponentPosition(nativeList, type, index, pos, isPosition) {
    const component = getLength(nativeList, type, index)[0];
    if (!component) return;

    const vector3 = (isPosition ? getFunctionLength(component, '>30')[0] : getFunctionLength(component, '>30')[1]);
    if (!vector3) return;

    const keys = Object.keys(vector3);
    if (keys.length < 3) return;
    vector3[keys[0]] = pos.X;
    vector3[keys[1]] = pos.Z;
    vector3[keys[2]] = pos.Y;
}

function updateComponentVector(nativeList, type, index, vector, useFirst) {
    const component = getLength(nativeList, type, index)[0];
    if (!component) return;

    const vector3 = getFunctionLength(component, '>30');
    if (!vector3) return;

    const targetVector = vector3[useFirst ? 0 : 1];
    if (!targetVector) return;

    const keys = Object.keys(targetVector);
    if (keys.length < 3) return;
    targetVector[keys[0]] = vector.X;
    targetVector[keys[1]] = vector.Y;
    targetVector[keys[2]] = vector.Z;
}

function AllClumsy() {
    let component = Clumsys.ClumsyComponent();
    if (!component) return;

    const cache = getFunctionLength(component, 4, ['n:1', 'i:1'])[0];
    if (!cache) return;

    const bullets = getLength(cache, 1, 18)[0].toArray();
    if (!bullets.length) return;

    const players = getPlayerPosition();
    if (!players.length) return;

    const desiredBulletsPerPlayer = 7;
    const maxTotalBullets = desiredBulletsPerPlayer * players.length;
    const bulletsToAllocate = Math.min(bullets.length, maxTotalBullets);

    players.forEach((player, index) => {
        for (let i = 0; i < desiredBulletsPerPlayer; i++) {
            const bulletIndex = index * desiredBulletsPerPlayer + i;
            if (bulletIndex >= bulletsToAllocate) break;
            assignBullet(bullets[bulletIndex], player);
        }
    });
}

function assignBullet(bullet, player) {
    if (bullet && player) {
        const NativeList = Object.values(getFunctionLength(bullet, 19)[0])[0];
        if (NativeList) {
            const Factory = getLength(NativeList, 5, 5)[0];
            const vector3 = getFunctionLength(Factory, '>30')[0];
            if (vector3) {
                const keys = Object.keys(vector3);
                if (keys.length >= 3) {
                    vector3[keys[0]] = player.X;
                    vector3[keys[1]] = player.Z;
                    vector3[keys[2]] = player.Y;
                }
            }
        }
    }
}

function BulletCount() {
    let component = Clumsys.ClumsyComponent();
    if(component) {
        const cache = getFunctionLength(component, 4, ['n:1', 'i:1'])[0];
        if (cache){
            const arrayList = getLength(cache, 1, 18)[0].toArray();
            if (arrayList) {
                return arrayList.length
            }}}}
function getPlayerCount() {
    const Players = getPlayerList();
    if (Players) {
        let Result = []
        Players.forEach(item => {
            const NativeList = Object.values(getFunctionLength(item, 19)[0])[0];
            const RemoteUserTitleConfiguratorComponent = findRemoteUserTitleConfiguratorComponent(NativeList);
            if (RemoteUserTitleConfiguratorComponent) {
                const nativeList = processTeam(RemoteUserTitleConfiguratorComponent, 'ENEMY');
                if (nativeList) {
                    Result.push(RemoteUserTitleConfiguratorComponent)
                }
            }
        })
        return Result.length
    }}

function bulletCountMenu() {
    const menu = document.querySelector(".BattleHudComponentStyle-buttonsContainer > div:nth-child(1)");
    let created = document.querySelector(".ClumsyMenu");

    if (menu && !created) {
        const create = document.createElement("div");
        const span = document.createElement("span");
        create.classList.add("ClumsyMenu");
        create.appendChild(span);
        menu.appendChild(create);
        window.updateDisplay = setupMenu(span);
    }
}

function setupMenu(span) {
    span.style.cssText = `
        font-size: max(min(1.48148vh, 1vw) * 1, 3px);
        font-family: RubikBold;
        user-select: none;
        -webkit-tap-highlight-color: transparent;
        pointer-events: auto;
        font-style: normal;
        font-weight: 500;
        font-size: 0.875em;
        line-height: normal;
        color: rgb(255, 255, 255);
        margin-right: 0.5em;
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: rgba(44, 49, 67, 0.5);
        border-radius: 0.188em;
        padding: 0.5em 0.8em;
        margin-bottom: 0.4em;
    `;

    function updateDisplay() {
        let bullCount = BulletCount();
        let playerCount = getPlayerCount();
        let bulletsNeeded = playerCount * 7;
        const bulletsInfo = [`Bullets: ${bullCount}`, `PlayerCount: ${playerCount}`, `Bullets Needed: ${bulletsNeeded}`];
        span.innerHTML = ''; // Clear the previous contents
        bulletsInfo.forEach(info => {
            let infoSpan = document.createElement("span");
            infoSpan.textContent = info;
            infoSpan.style.display = "block";
            infoSpan.style.padding = "5px";
            span.appendChild(infoSpan);
        });
    }

    AnimationFrame("ClumsyMenu", updateDisplay, 1000);
    return updateDisplay;
}


const HorizontalAim = (function() {
    function updateComponentValues(component, specs) {
        const {targetSystemParams, horizontalValueConditions, verticalValueConditions} = specs;
        let componentObj = Components('LocalTank');
        if (componentObj) {
            const targetSystem = getLength(componentObj, ...targetSystemParams)[0];
            if (targetSystem) {
                const horizontalAim = getFunctionLength(targetSystem, 2, ['b:1'])[0]
                Object.keys(horizontalAim).forEach(key => {
                    if (typeof horizontalAim[key] === 'boolean' && !horizontalAim[key]) horizontalAim[key] = true;
                });

                const horizontalValue = getFunctionLength(horizontalAim, 4)[0];
                if(horizontalValue){
                    propertyValues(horizontalValue, "directionsCount", 400);
                    //propertyValues(horizontalValue, "angleStep", 6.28319);

                    const verticalAim = getFunctionLength(horizontalAim, 2, ['i:3'])[0];
                    if(verticalAim){
                        let verticalValues = getFunctionLength(verticalAim, 2)[0];
                        if(verticalValues){
                            verticalValues = getFunctionLength(verticalValues, 2)[0];
                            Object.keys(verticalValues).forEach(key => {
                                if (typeof verticalValues[key] === 'number') {
                                    if (verticalValues[key] > verticalValueConditions[0] && verticalValues[key] < verticalValueConditions[1]) {
                                        verticalValues[key] = 1.58;
                                    } else if (verticalValues[key] < -verticalValueConditions[0] && verticalValues[key] > -verticalValueConditions[1]) {
                                        verticalValues[key] = -0.18;
                                    }
                                }});
                        }}}}}}

    const aimFunctions = {
        ShaftTargetingSystem: () => updateComponentValues('Shaft', {targetSystemParams: [6, 9], horizontalValueConditions: [0.008726646, 4], verticalValueConditions: [0.1, 5]}),
        RailgunTargetingSystem: () => updateComponentValues('Railgun', {targetSystemParams: [6, 6], horizontalValueConditions: [0.008726646, 4], verticalValueConditions: [0.1, 5]}),
    }

    return {
        ApplyAll: function() {
            Object.values(aimFunctions).forEach((updateFunction) => {
                if (typeof updateFunction === 'function') {
                    updateFunction();
                }
            });
        }
    };
})();

function StrikerWeapon() {
    let component = Components('LocalTank');
    if (component) {
        const strikerWeapon = getLength(component, 6, 30)[0];
        let AimTime = Object.entries(strikerWeapon)[18][1];
        const StrikerTargetingSystem = getLength(strikerWeapon, 6, 5)[0];
        const horizontalAim = getFunctionLength(StrikerTargetingSystem, 2, ['b:1'])[0]
        Object.keys(horizontalAim).forEach(key => {
            if (typeof horizontalAim[key] === 'boolean' && !horizontalAim[key]) horizontalAim[key] = true;
        });
        const HorizontalAngle = getFunctionLength(horizontalAim, 4)[0];
        for (const key in HorizontalAngle) {
            if (HorizontalAngle[key] === 4 || HorizontalAngle[key] === 100) {
                if(AimTime === 0){
                    HorizontalAngle[key] = 4;
                }
                if(AimTime === 1){
                    HorizontalAngle[key] = 100;
                }}}
        const TargetingSystemImpl = getFunctionLength(horizontalAim, 2, ['i:3'])[0];
        const SectorDirectionCalculator = getFunctionLength(TargetingSystemImpl, 2)[0];
        const TargetingSectorsCalculator = getFunctionLength(SectorDirectionCalculator, 2)[0];
        for (const key in TargetingSectorsCalculator) {
            if (TargetingSectorsCalculator[key] === -0.20943951606750488) {
                TargetingSectorsCalculator[key] = -1.58
            }
            else if (TargetingSectorsCalculator[key] === 0.7853981852531433) {
                TargetingSectorsCalculator[key] = 1.58;
            }}}}

const NoReload = (function() {
    const getComponent = () => Components('LocalTank');

    const modifyProperties = (obj, rules) => {
        if (!obj) return;
        Object.keys(obj).forEach(key => {
            rules.forEach(rule => {
                if (typeof obj[key] === rule.type && rule.condition(obj[key])) {
                    obj[key] = rule.value;
                }
            });
        });
    };

    const modifyComponent = (identifier, rules) => {
        const comp = getComponent();
        if (!comp) return;
        const componentList = getLength(comp, ...identifier);
        if (componentList.length > 0) {
            const component = componentList[0];
            modifyProperties(component, rules);
        }
    };

    const Railgun = () => {
        const comp = getComponent();
        if (!comp) return;
        const railgunWeapon = getLength(comp, 6, 9)[0];
        if (railgunWeapon) {
            const railgunPerms = getFunctionLength(railgunWeapon, 1, ['n:1']);
            if (railgunPerms && railgunPerms.length > 2) {
                modifyProperties(railgunPerms[2], [{ type: 'number', condition: x => x >= 500, value: 0 }]); // charge up
            }
            modifyProperties(railgunWeapon, [{ type: 'number', condition: x => x >= 500, value: 0 }]); //shooting
        }
    };

    return {
        Recoil: () => {
            const comp = getComponent();
            if (!comp) return;
            const components = getLength(comp, 5, 3, ['i:5', 'b:1', 'n:1']);
            if (components.length > 1) {
                modifyProperties(components[1], [{ type: 'number', condition: x => x > 10000, value: 0 }]);
            }
            if (components.length > 2) {
                modifyProperties(components[2], [{ type: 'number', condition: x => x > 10000, value: 0 }]);
            }
        },
        CommonTurrets: () => modifyComponent([5, 4, ['b:1', 'n:2']], [{ type: 'number', condition: () => true, value: 0 }]),
        Shaft: () => modifyComponent([6, 20], [
            { type: 'boolean', condition: x => !x, value: true }, //disable scope
            { type: 'number', condition: x => x !== 100 && x !== 1000, value: 0 } //arcade speed
        ]),
        Tesla: () => modifyComponent([6, 25], [
            { type: 'number', condition: x => x === 660, value: 0 }, //chain shot delay
            { type: 'number', condition: x => x > 1000 && x < 20000, value: 0 } //ball reload speed
        ]),
        Striker: () => modifyComponent([6, 30], [
            { type: 'boolean', condition: x => !x, value: true }, //disable scope
            { type: 'number', condition: x => x >= 700, value: 0 }
        ]),
        Magnum: () => modifyComponent([6, 21], [
            { type: 'boolean', condition: x => !x, value: true }, // disable charge up time
            { type: 'number', condition: x => x >= 1000, value: 0 } //reload
        ]),
        Gauss: () => modifyComponent([6, 26], [
            { type: 'boolean', condition: x => !x, value: true }, //disable scope
            { type: 'number', condition: x => x > 700, value: 0 } //arcade speed
        ]),
        Rico: () => modifyComponent([5, 4, ['b:2', 'n:6']], [{ type: 'number', condition: x => x < 1000, value: 0 }]), //infinite ammo capacity
        Railgun: Railgun,
        Hammer: () => modifyComponent([6, 5, 'b:4'], [
            { type: 'boolean', condition: x => !x, value: true }, //enable infinite ammo capacity
            { type: 'number', condition: x => x >= 15, value: 0 } //shot delay
        ])
    };
})();

function ActiveAllNoReload() {
    Object.values(NoReload).forEach(func => {
        try {
            if (typeof func === 'function') {
                func();
            }
        } catch (error) {
            console.error('Error modifying weapon:', error);
        }
    });
}
document.addEventListener('keydown', function(e) {
    if (!ChatState()) {
        switch (e.keyCode) {
            case 84:
                if (localStorage.getItem("AllClumsy") === "true") {
                    manageClumsy('reset');
                }
                if (localStorage.getItem("MultiClumsy") === "true") {
                    AllClumsy();
                }
                break;
            case 82:
                if (localStorage.getItem("RocketClumsy") === "true") {
                    manageClumsy('resetRocket');
                }
                break;
        }
    }
});

function setFly(isOn) {
    let component = TankPhysicsComponent();
    if(component) {
        const Body = getFunctionLength(component, '>20', ['b:4'])[0];
        Body[Object.keys(Body)[5]] = isOn
    }}

function setFlyDirection() {
    let component = TankPhysicsComponent();
    if (component) {
        const Body = getFunctionLength(component, '>20', ['b:4'])[0];
        const BodyState = getFunctionLength(Body, 3, ['i:4'])[0];
        const Quaternion = getFunctionLength(BodyState, 23)[0];
        const keys = Object.keys(Quaternion);
        const values = [0.7103407759048304, 6.124857462143081e-16, -3.250749294676129e-16, -0.7043155686291995];

        keys.forEach((key, index) => {
            if (Quaternion[key] != values[index]) {
                Quaternion[key] = values[index];
            }
        });
    }
}


function TankMovements() {
    let component = TankPhysicsComponent();
    if(component) {
        const Body = getFunctionLength(component, '>20', ['b:4'])[0];
        return Object.entries(getFunctionLength(Body, 3, ['i:4'])[0])[3][1];
    }}
function moveTank(dx, dy) {
    let component = TankMovements();
    if(component) {
        component[Object.keys(component)[0]] += dy;
        component[Object.keys(component)[1]] += dx;
    }}

const keyState = {
    w: false,
    s: false,
    a: false,
    d: false,
    v: false,
    f: false,
};

let lastTimestamp = 0;
let movementInterval = null;

function handleKeyChange(e, isKeyDown) {
    try {
        const key = e.key.toLowerCase();
        if (key in keyState && !ChatState() && localStorage.getItem("fly") === "true") {
            keyState[key] = isKeyDown;
            if (isKeyDown) startMovement();
        }
    } catch(e){}
}
function startMovement() {
    if (!movementInterval) {
        movementInterval = requestAnimationFrame(updateMovement);
    }
}

function updateMovement(timestamp) {
    const movementSpeed = getSliderValue('SetFly');
    if (!lastTimestamp) lastTimestamp = timestamp;
    const elapsed = timestamp - lastTimestamp;
    lastTimestamp = timestamp;

    let dx = (keyState.a - keyState.d) * (movementSpeed * elapsed) / 1000;
    let dy = (keyState.w - keyState.s) * (movementSpeed * elapsed) / 1000;
    moveTank(dx, dy);

    adjustAltitude();

    movementInterval = requestAnimationFrame(updateMovement);
}

function adjustAltitude() {
    const altitudeSpeed = getSliderValue('SetFly') / 235;
    let component = TankMovements();
    if(component) {
        component[Object.keys(component)[2]] += (keyState.f - keyState.v) * altitudeSpeed;
    }}

function stopMovement() {
    cancelAnimationFrame(movementInterval);
    movementInterval = null;
    lastTimestamp = 0;
}

document.addEventListener('keydown', (e) => handleKeyChange(e, true));
document.addEventListener('keyup', (e) => handleKeyChange(e, false));



function WeaponTrigger() {
    let component = Components('LocalTank');
    if(component){
        return getLength(component, 5, 7, ['i:4', 'b:5'])[0]
    }}
function AutoShoot(action) {
    let weaponTrigger = WeaponTrigger();
    if(weaponTrigger) {
        weaponTrigger[Object.keys(weaponTrigger)[5]] = action
    }}
function ShaftTrigger() {
    let weaponTrigger = WeaponTrigger();
    if(weaponTrigger[Object.keys(weaponTrigger)[5]] === true) {weaponTrigger[Object.keys(weaponTrigger)[5]] = false;}
}

function EnemyHighlight() {
    const component = Players('ENEMY');
    if (!component) return [];

    const processHighlight = (ComponentHighlight) => {
        if (!ComponentHighlight) return null;

        const containsNumberValue = Object.values(ComponentHighlight).some(value => value === 16711680);
        const booleanKeys = Object.keys(ComponentHighlight).filter(key => typeof ComponentHighlight[key] === 'boolean');

        if (containsNumberValue && booleanKeys.length > 5) {
            return ComponentHighlight[booleanKeys[5]];
        }
        return null;
    };

    let result = [];
    component.forEach(player => {
        const Turret = getFunctionLength(player, 4, ['b:1', 'i:8'])[0];

        const TurretEntry = Turret ? getFunctionLength(Turret, 11, ['b:1'])[0] : null;

        const Hull = getFunctionLength(player, 4, ['b:1', 'i:7'])[0];

        const TurretHighlight = TurretEntry ? getFunctionLength(TurretEntry, 6)[0] : null;

        const HullHighlight = Hull ? getFunctionLength(Hull, 6)[0] : null;

        const turretResult = processHighlight(TurretHighlight);
        const hullResult = processHighlight(HullHighlight);

        if (turretResult !== null) result.push(turretResult);
        if (hullResult !== null) result.push(hullResult);
    });

    return result;
}

function get() {
    if (Shaft.CurrentShaftEnergy() > 300) return;

    const highlights = EnemyHighlight();
    if (highlights.some(item => item === true)) {
        ShaftTrigger();
        highlights.length = 0;
    }
}

const Shaft = (function() {
    function ShaftWeapon() {
        let component = Components('LocalTank');
        if(component){
            const ShaftWeapon = getLength(component, 6, 20, ['b:4', 'n:5', 'i:14'])[0]
            if(ShaftWeapon){
                let Values = {};
                for (const key in ShaftWeapon) {
                    if (ShaftWeapon.hasOwnProperty(key)) {
                        if (typeof ShaftWeapon[key] === 'number') {
                            Values[key] = ShaftWeapon[key];
                        }}}
                let CurrentEnergy = Object.entries(Values)[3][1]
                return CurrentEnergy
            }}}
    function ShaftTargetingSystem() {
        let component = Components('LocalTank');
        if(component){
            const ShaftTargetSystem = getLength(component, 6, 9)[0];
            if(ShaftTargetSystem){
                const HorizontalAim = getFunctionLength(ShaftTargetSystem, 2, ['b:1'])[0]
                if(HorizontalAim){
                    for (const key in HorizontalAim) {
                        if (typeof HorizontalAim[key] === 'boolean' && HorizontalAim[key] === false) {
                            HorizontalAim[key] = true;
                        }}
                    const HorizontalValue = getFunctionLength(HorizontalAim, 4)[0];
                    propertyValues(HorizontalValue, "directionsCount", 20);
                }}}}

    function ShaftAimingController() {
        let component = Components('LocalTank');
        if(component){
            const shaftObject = getLength(component, 5, 11, ['b:7', 'n:12'])[0];
            if(shaftObject){
                for (const key in shaftObject) {
                    const value = shaftObject[key];
                    if (typeof value === 'number') {
                        if (value === -0.1745329201221466) {
                            shaftObject[key] = -1.57;
                        }}}
                const VerticalUp = Object.keys(shaftObject)[10];
                shaftObject[VerticalUp] = 1.57;

                const DynamicValue = getFunctionLength(shaftObject, 4)[0];
                DynamicValue[Object.keys(DynamicValue)[1]] = 1000
                DynamicValue[Object.keys(DynamicValue)[2]] = 1000
            }}}
    function ShaftTurretRotationSpeedController() {
        let component = Components('LocalTank');
        if(component){
            return getLength(component, 5, 7, ['b:3', 'n:6', 'i:24'])[0]
        }}
    /*function ShaftCC() {
        let component = ShaftTurretRotationSpeedController();
        if(component){
            const shaftCC = getFunctionLength(component, 3, ['b:1', 'n:18'])[0]
            if(shaftCC) {
                shaftCC[Object.keys(shaftCC)[7]] = 1.6
                shaftCC[Object.keys(shaftCC)[10]] = 1.6
                for (const key in shaftCC) {
                    const value = shaftCC[key];
                    if (typeof value === 'number') {
                        if (value === 400) {
                            shaftCC[key] = 200;
                        } else if(value > 20 && value < 190 && ![0.12217304855585098, -0.1745329201221466, 1.57, -1.57, 0.9].includes(value)) {
                            shaftCC[key] = 500;
                        } else if (value > 0.1 && value < 2 && ![0.12217304855585098, -0.1745329201221466, 1.57, -1.57, 0.9].includes(value)) {
                            shaftCC[key] = 1000;
                        }}}}}}*/

    function ShaftCC(charge) {
        let component = ShaftTurretRotationSpeedController();
        if(component){
            const shaftCC = getFunctionLength(component, 3, ['b:1', 'n:18'])[0]
            if(shaftCC){
                propertyValues(shaftCC, "afterShotPause", 0);
                propertyValues(shaftCC, "horizontalTargetingSpeed", 1000);
                propertyValues(shaftCC, "minimumFOV", 0.85);
                propertyValues(shaftCC, "initialFOV", 0.85);
                propertyValues(shaftCC, "targetingAcceleration", 1000);
                propertyValues(shaftCC, "targetingTransitionTime", 200);
                propertyValues(shaftCC, "verticalTargetingSpeed", 1000);
                propertyValues(shaftCC, "chargeRate", charge);
            }}}

    function SpeedProfile() {
        let component = Components('LocalTank');
        if(component){
            const speedProfile = getLength(component, 5, 6, ['b:1', 'n:1', 'i:8'])[0]
            if(speedProfile){
                const Profile = getFunctionLength(speedProfile, 6)[0];
                if(Profile){
                    for (const key in Profile) {
                        const value = Profile[key];
                        if (typeof value === 'number') {
                            if (value > 0.1 && value < 2 && ![0.12217304855585098, -0.1745329201221466, 1.57, -1.57].includes(value)) {
                                Profile[key] = 1000;
                            }}}}}}}

    return {
        shaftAimingController: ShaftAimingController,
        shaftCC: ShaftCC,
        speedProfile: SpeedProfile,
        shaftTarget: ShaftTargetingSystem,
        CurrentShaftEnergy: ShaftWeapon
    };
})();

function AABB() {
    let component = Components('World');
    if (component) {
        const BeforePhysics = getLength(component, 4, 21)[0];
        const MidPhysics = getLength(BeforePhysics, 4, 12)[0];
        const AfterPhysics = getFunctionLength(MidPhysics, 1)[0];
        const AABB = getFunctionLength(AfterPhysics, 19)[0];
        const entries = Object.entries(AABB);
        return {
            A: entries[0][1],
            A2: entries[1][1],
            A3: entries[2][1],
            B: entries[3][1],
            B2: entries[4][1],
            B3: entries[5][1]
        };
    }
}

function setVector3d(Vector3d, X, Z, Y) {
    Vector3d.forEach(item => {
        const keys = Object.keys(item);
        if (keys.length >= 3) {
            item[keys[0]] = X;
            item[keys[1]] = Z;
            item[keys[2]] = Y;
        }
    });
}

function AntiAim() {
    let component = TankPhysicsComponent();
    if (component) {
        const Vector3d = getFunctionLength(component, '>30');
        const aabb = AABB();
        const X = aabb.A + (Math.random() * (aabb.B - aabb.A));
        const Z = aabb.A2 + (Math.random() * (aabb.B2 - aabb.A2));
        const Y = aabb.B3 + 2000;
        setVector3d(Vector3d, X, Z, Y);
    }
}

function AntiAimBottom() {
    let component = TankPhysicsComponent();
    if (component) {
        const Vector3d = getFunctionLength(component, '>30');
        const aabb = AABB();
        const X = aabb.A + (Math.random() * (aabb.B - aabb.A));
        const Z = aabb.A2 + (Math.random() * (aabb.B2 - aabb.A2));
        const Y = aabb.A3;
        setVector3d(Vector3d, X, Z, Y);
    }
}
function setVector3dBoth(Vector3d, vectors) {
    Vector3d.forEach(item => {
        const keys = Object.keys(item);
        if (keys.length >= 3) {
            const vector = vectors[Math.floor(Math.random() * vectors.length)];
            item[keys[0]] = vector.X;
            item[keys[1]] = vector.Z;
            item[keys[2]] = vector.Y;
        }
    });
}

function AntiAimBoth() {
    let component = TankPhysicsComponent();
    if (component) {
        const Vector3d = getFunctionLength(component, '>30');
        const aabb = AABB();

        const corners = [
            { X: aabb.A, Z: aabb.A2 },
            { X: aabb.B, Z: aabb.A2 },
            { X: aabb.A, Z: aabb.B2 },
            { X: aabb.B, Z: aabb.B2 }
        ];

        const YTop = aabb.B3 + 2000;

        const YBottom = aabb.A3;

        const vectors = corners.flatMap(corner => [
            { X: corner.X, Z: corner.Z, Y: YTop },
            { X: corner.X, Z: corner.Z, Y: YBottom }
        ]);

        setVector3dBoth(Vector3d, vectors);
        setVector3dBoth(Vector3d, vectors);
    }
}

const HoverPhysics = (function() {
    let originalValues = {};

    function hoverphysics(action) {
        let component = Components('LocalTank');
        if (component) {
            const HoverChassis = getLength(component, 5, 15, ['b:2'])[0];
            if (HoverChassis) {
                const HoverChassisParams = getFunctionLength(HoverChassis, 4, ['b:1'])[0];
                if (HoverChassisParams) {
                    if (action === 'Apply') {
                        let entries = Object.entries(HoverChassisParams);
                        for (const [key, value] of entries) {
                            if (!originalValues.hasOwnProperty(key)) {
                                originalValues[key] = value;
                            }
                            propertyValues(HoverChassisParams, "tiltStabilityMaxAngle", 1);
                            if (value === 5 || value === 3 || value === 7) {
                                HoverChassisParams[key] = 10;
                            }
                        }
                    } else if (action === 'Restore') {
                        for (const key in originalValues) {
                            if (HoverChassisParams.hasOwnProperty(key)) {
                                HoverChassisParams[key] = originalValues[key];
                                propertyValues(HoverChassisParams, "tiltStabilityMaxAngle", 6.2831854820251465);
                            }}}}}}}
    return {
        apply: () => hoverphysics('Apply'),
        restore: () => hoverphysics('Restore'),
    };
})();

const Mass = (function() {
    let originalValues = {};

    function massPhysics(action) {
        let component = TankPhysicsComponent();
        if (component) {
            const Body = getFunctionLength(component, '>20', ['b:4'])[0];
            if (Body) {
                if (action === 'Apply') {
                    let entries = Object.entries(Body);
                    for (const [key, value] of entries) {
                        if (!originalValues.hasOwnProperty(key)) {
                            originalValues[key] = value;
                        }
                        if (value >= 2000 && value <= 10000) {
                            Body[key] = getSliderValue('Mass');
                        }
                    }
                } else if (action === 'Restore') {
                    for (const key in originalValues) {
                        if (Body.hasOwnProperty(key)) {
                            Body[key] = originalValues[key];
                        }}}}}}

    return {
        apply: () => massPhysics('Apply'),
        restore: () => massPhysics('Restore')
    };
})();

function Recoil() {
    let component = Components('LocalTank');
    if (component) {
        const comps = getLength(component, 5, 3, ['i:5', 'b:1', 'n:1']);
        comps?.slice(1, 3).forEach(obj => {
            if (obj) {
                Object.keys(obj).forEach(key => {
                    if (typeof obj[key] === 'number' && obj[key] > 10000) {
                        obj[key] = getSliderValue('MoreRecoil');
                    }
                });
            }
        });
    }
}

function Gravity() {
    let component = TankPhysicsComponent();
    if (component) {
        const Body = getFunctionLength(component, '>20', ['b:4'])[0];
        if (Body) {
            const Physics = getLength(Body, 4, 6, ['n:4'])[0];
            if (Physics) {
                const gravityValue = getSliderValue('Gravity');
                Physics[Object.keys(Physics)[0]] = gravityValue;

                if (gravityValue >= -30) {
                    setTimeout(() => {
                        Physics[Object.keys(Physics)[0]] = 30;
                        setTimeout(() => {
                            Physics[Object.keys(Physics)[0]] = 1;
                        }, 500);
                    }, 500);
                }
            }
        }
    }
}


function fastOverdrive() {
    let component = Components('LocalTank');
    if(component){
        const OverDrive = getLength(component, 5, 7, ['b:2', 'n:2', 'i:13'])[0];
        Object.keys(OverDrive).forEach(key => {
            if (typeof OverDrive[key] === 'number') {
                if (OverDrive[key] < 100) {
                    OverDrive[key] = 1;
                }}});
    }}

function SupplyInfo() {
    let component = Components('LocalTank');
    if (!component) return [];

    const Temp1 = getLength(component, 5, '>13', ['b:4', 'i:14'])[0];
    const Temp2 = getLength(component, 5, '>13', ['b:4', 'i:15'])[0];
    const SuppliesComponent = Temp1 || Temp2
    if (!SuppliesComponent) return [];

    const LinkedHashMap = getComponent(SuppliesComponent, 'LinkedHashMap');
    if (!LinkedHashMap) return [];

    const InternalHashMap = getFunctionLength(LinkedHashMap, 21)[0];
    if (!InternalHashMap) return [];

    return Object.entries(InternalHashMap).map(([key, value]) => {
        if (Array.isArray(value) && value.length >= 6 && value.length <= 9) {
            return { [key]: value };
        }
        return null;
    }).filter(value => value);
}

function supplyNames() {
    const supplies = SupplyInfo()[0];
    if (!supplies || Object.keys(supplies).length === 0) {
        return [];
    }
    const Values = Object.entries(supplies)
    .flatMap(([key, value]) => Object.entries(value))
    const SupplyNames = Values.map(item => {
        const SupplyType = getFunctionLength(item, 1)[0];
        if (typeof SupplyType === 'object' && SupplyType !== null) {
            let entries = Object.entries(SupplyType);
            if (entries.length > 0 && entries[0].length > 1) {
                entries = entries[0][1];
                return entries
            }
        }
    }).filter(value => value !== null && value !== undefined);
    return SupplyNames
}
function supplyFunctions() {
    const supplies = SupplyInfo()[1];
    if (!supplies || Object.keys(supplies).length === 0) {
        return [];
    }
    const Values = Object.entries(supplies)
    .flatMap(([key, value]) => Object.entries(value))
    const SupplyFunctions = Values.map(item => {
        const SupplyTypeConfig = getFunctionLength(item, 4)[0];
        if (typeof SupplyTypeConfig === 'object' && SupplyTypeConfig !== null) {
            let Functions = Object.entries(SupplyTypeConfig)[0][1]
            return Functions
        }
    }).filter(value => value !== null && value !== undefined);
    return SupplyFunctions
}
function createSupplyMap(supplyNames, supplyFunctions) {
    const supplyMap = {};
    for (let i = 0; i < supplyNames.length; i++) {
        supplyMap[supplyNames[i]] = supplyFunctions[i];
    }
    return supplyMap;
}

function Supplies(supplyTypeToHandle) {
    const supplyNamesResult = supplyNames();
    const supplyFunctionsResult = supplyFunctions();
    const supplyMap = createSupplyMap(supplyNamesResult, supplyFunctionsResult);

    if (supplyMap[supplyTypeToHandle]) {
        supplyMap[supplyTypeToHandle]();
    }}
let speedValues;
const getSpeedValues = () => {
    try {
        const speeds = {
            repairMS: parseInt(document.querySelector("#repair > span.ms-label").innerText),
            mineMS: parseInt(document.querySelector("#mine > span.ms-label").innerText),
            doubleArmorMS: parseInt(document.querySelector("#double_armor > span.ms-label").innerText),
            doubleDamageMS: parseInt(document.querySelector("#double_damage > span.ms-label").innerText),
            speedBoostMS: parseInt(document.querySelector("#speed_boost > span.ms-label").innerText)
        };

        localStorage.setItem('speedValues', JSON.stringify(speeds));

        const speedValuesString = localStorage.getItem("speedValues");
        speedValues = JSON.parse(speedValuesString);

        return speeds;
    } catch(e){}
};


let SuppliesABC = 0;
let lastArmorTime = 0;
let lastDamageTime = 0;
let lastSpeedTime = 0;
let rafId;

function handleSupplies() {
    const now = performance.now();

    const armorInterval = speedValues.doubleArmorMS;
    const damageInterval = speedValues.doubleDamageMS;
    const speedInterval = speedValues.speedBoostMS;

    if (localStorage.getItem("ArmorOn") === "true" && armorInterval > 0 && now - lastArmorTime > armorInterval) {
        Supplies('DOUBLE_ARMOR');
        lastArmorTime = now;
    }

    if (localStorage.getItem("DamageOn") === "true" && damageInterval > 0 && now - lastDamageTime > damageInterval) {
        Supplies('DOUBLE_DAMAGE');
        lastDamageTime = now;
    }

    if (localStorage.getItem("SpeedOn") === "true" && speedInterval > 0 && now - lastSpeedTime > speedInterval) {
        Supplies('NITRO');
        lastSpeedTime = now;
    }
    rafId = requestAnimationFrame(handleSupplies);
}

document.addEventListener('keydown', function (e) {
    if (e.keyCode === 85 && !ChatState()) {
        SuppliesABC++;
        if (SuppliesABC % 2 === 1) {
            lastArmorTime = lastDamageTime = lastSpeedTime = performance.now();
            rafId = requestAnimationFrame(handleSupplies);

        } else if (SuppliesABC % 2 === 0) {
            if (rafId) cancelAnimationFrame(rafId);
        }
    }
});


let SuppliesDE = 0;
let lastRepairTime = 0;
let lastMineTime = 0;
let rafIdDE;

function handleSuppliesDE() {
    const now = performance.now();

    const repairInterval = speedValues.repairMS;
    const mineInterval = speedValues.mineMS;

    if (localStorage.getItem("RepairOn") === "true" && repairInterval > 0 && now - lastRepairTime > repairInterval) {
        Supplies('FIRST_AID');
        lastRepairTime = now;
    }

    if (localStorage.getItem("MineOn") === "true" && mineInterval > 0 && now - lastMineTime > mineInterval) {
        Supplies('MINE');

        lastMineTime = now;
    }
    rafIdDE = requestAnimationFrame(handleSuppliesDE);
}

document.addEventListener('keydown', function (e) {
    if (e.keyCode === 89 && !ChatState()) {
        SuppliesDE++;
        if (SuppliesDE % 2 === 1) {
            lastRepairTime = lastMineTime = performance.now();
            rafIdDE = requestAnimationFrame(handleSuppliesDE);
        } else if (SuppliesDE % 2 === 0) {
            if (rafIdDE) cancelAnimationFrame(rafIdDE);
        }
    }
});

function ResetInactivity() {
    const component = Components('World');
    if (component) {
        const inputManager = getFunctionLength(component, 5, ['b:1'])[0];
        if (inputManager) {
            const input = getFunctionLength(inputManager, '>30')[0];
            if (input) {
                const nativeList = getFunctionLength(input, '>15', ['i:0']);
                if (nativeList) {
                    nativeList.forEach(item => {
                        const innerObject = Object.entries(item)[0][1];
                        if (innerObject.length > 20) {
                            innerObject.forEach(gameAction => {
                                const gameActionBinding = getComponent(gameAction, '');
                                const bindingEntries = Object.entries(gameActionBinding);
                                if (bindingEntries.length > 0 && bindingEntries[0][1] === 'RESET_INACTIVITY') {
                                    const resetFunction = gameAction[Object.keys(gameAction)[1]];
                                    if (typeof resetFunction === 'function') {
                                        resetFunction();
                                    }
                                }});
                        }});
                }}}}}
function TeslaBall() {
    let component = Components('World');
    if (component) {
        const PhysicsScene = getLength(component, 4, 21)[0];
        const NativeList = getFunctionLength(PhysicsScene, '>15', ['i:0', 'n:0']);
        if(NativeList) {
            NativeList.forEach(item => {
                const innerObject = Object.entries(item)[0][1];
                if(innerObject.length > 0) {
                    innerObject.forEach(mass => {
                        if(Object.entries(mass)[0][1] && Object.entries(mass)[0][1] === 1) {
                            const BattleEntity = getFunctionLength(mass, '>1', ['b:1', 'n:1'])[0];
                            const NativeList = Object.values(getFunctionLength(BattleEntity, '>15', ['i:0'])[0])[0];
                            console.log(NativeList)
                        }
                    });
                }
            })
        }
    }
}

let initialPositionsY = new Map();

function adjustPlayerPosition(player, initialPositionsMap, adjustment, axisKey) {
    const TankPhysicsComponent = getLength(player, 5, '>10', ['b:6'])[0];
    if(TankPhysicsComponent) {
        const Body = getFunctionLength(TankPhysicsComponent, '>20', ['b:4'])[0];
        const BodyState = getFunctionLength(Body, 3, ['i:4'])[0];
        const Vector = Object.entries(BodyState)[3][1];

        const vectorKey = Object.keys(Vector)[axisKey];
        const currentPosition = Vector[vectorKey];

        if (!initialPositionsMap.has(player)) {
            initialPositionsMap.set(player, { initial: currentPosition, target: currentPosition + adjustment });
        } else {
            const positionData = initialPositionsMap.get(player);
            const initialPosition = positionData.initial;
            const targetPosition = initialPosition + adjustment;

            if (Math.abs(currentPosition - targetPosition) > 1) {
                Vector[vectorKey] = targetPosition;
            }

            if (Math.abs(currentPosition - initialPosition) > Math.abs(adjustment) * 2) {
                initialPositionsMap.set(player, { initial: currentPosition, target: currentPosition + adjustment });
            }
        }
    }
}

function adjustPlayerPositions(adjustment, axisKey, initialPositionsMap) {
    const component = Players('ENEMY');
    if (!component) return;

    component.forEach(player => adjustPlayerPosition(player, initialPositionsMap, adjustment, axisKey));
}

function YPlus() {
    adjustPlayerPositions(450, 2, initialPositionsY);
}

function YMinus() {
    adjustPlayerPositions(-450, 2, initialPositionsY);
}

function resetAllPositions() {
    initialPositionsY.clear();
}

/*let Players = [];
let teleportAllInterval;
let isTeleportingAll = false;
let fetchingPlayers = false;
function getPlayers() {
    if (fetchingPlayers) return;
    fetchingPlayers = true;
    Players = [];

    const component = getPlayerList();
    if (!component) {
        fetchingPlayers = false;
        return;
    }

    const playersList = getFunctionLength(component, 16);
    if (!playersList) {
        fetchingPlayers = false;
        return;
    }

    playersList.forEach(item => {
        const nativeComponents = getFunctionLength(item, 19);
        if (!nativeComponents.length) return;

        const NativeList = Object.values(nativeComponents[0])[0];
        if (!NativeList) return;

        const RemoteUserTitleConfiguratorComponent = findRemoteUserTitleConfiguratorComponent(NativeList);
        if (!RemoteUserTitleConfiguratorComponent) return;

        const nativeList = processTeam(RemoteUserTitleConfiguratorComponent);
        if (!nativeList) return;

        const Name = Object.entries(RemoteUserTitleConfiguratorComponent)[4][1];

        const TankPhysicsComponent = getLength(NativeList, 5, 14, ['b:6'])[0];
        if (!TankPhysicsComponent) return;

        const Vector3d = getFunctionLength(component, '>30')[1];
        const Vector = Object.entries(Vector3d)

        const Position = {
            X: Object.entries(Vector)[0][1],
            Z: Object.entries(Vector)[1][1],
            Y: Object.entries(Vector)[2][1]
        };

        Players.push({ Name, Position });
    });

    updatePlayerSection();
    fetchingPlayers = false;
}*/

function getUserPosition() {
    const component = TankPhysicsComponent();
    if (!component) return null;

    const Body = getFunctionLength(component, '>20', ['b:4'])[0];
    if (!Body) return null;

    const BodyState = getFunctionLength(Body, 3, ['i:4'])[0];
    if (!BodyState) return null;

    const Vector = Object.entries(BodyState)[3][1];
    if (!Vector) return null;

    return {
        X: Object.entries(Vector)[0][1],
        Z: Object.entries(Vector)[1][1],
        Y: Object.entries(Vector)[2][1]
    };
}
function getBots() {
    const userPosition = getUserPosition();

    const component = getPlayerList();
    if (!component) return;

    const playersList = getFunctionLength(component, 16);
    if (!playersList) return;

    const processVector = (Vector, x, y, z) => {
        const vectorKeys = Object.keys(Vector);
        if (vectorKeys.length < 3) return;
        Vector[vectorKeys[0]] = x;
        Vector[vectorKeys[1]] = z;
        Vector[vectorKeys[2]] = y;
    };

    const processTeamAndPhysics = (NativeList, RemoteUserTitleConfiguratorComponent, x, y, z) => {
        const TankPhysicsComponent = getLength(NativeList, 5, '>10', ['b:6'])[0];
        if (!TankPhysicsComponent) return;

        const Body = getFunctionLength(TankPhysicsComponent, '>20', ['b:4'])[0];
        if (!Body) return;

        const BodyState = getFunctionLength(Body, 3, ['i:4'])[0];
        if (!BodyState) return;

        const Vector = Object.entries(BodyState)[3][1];
        if (!Vector) return;

        processVector(Vector, x, y, z);
    };

    playersList.forEach(item => {
        const nativeComponents = getFunctionLength(item, 19);
        if (!nativeComponents.length) return;

        const NativeList = Object.values(nativeComponents[0])[0];
        if (!NativeList) return;

        const RemoteUserTitleConfiguratorComponent = findRemoteUserTitleConfiguratorComponent(NativeList);
        if (!RemoteUserTitleConfiguratorComponent) return;

        const TankComponent = getLength(NativeList, 5, 6, ['b:2', 'n:1'])[0];
        if (!TankComponent) return;

        const Activity = Object.values(getFunctionLength(TankComponent, 1)[0])[0];
        if (Activity && Activity === "ACTIVE") {

            const temp1 = getLength(RemoteUserTitleConfiguratorComponent, 1, 1)[1];
            const Temp1 = temp1 ? Object.entries(temp1)[0][1] : null;
            const temp2 = getLength(RemoteUserTitleConfiguratorComponent, 1, 1)[2];
            const Temp2 = temp2 ? Object.entries(temp2)[0][1] : null;

            const TeamRelation = (Temp1 && Temp1 === "ENEMY") || (Temp2 && Temp2 === "ENEMY");
            const TeamRelationOther = (Temp1 && Temp1 === "ALLY") || (Temp2 && Temp2 === "ALLY");

            if (TeamRelation) {
                processTeamAndPhysics(NativeList, RemoteUserTitleConfiguratorComponent, userPosition.X, userPosition.Y + 100, userPosition.Z + 3000);
            } else if (TeamRelationOther) {
                processTeamAndPhysics(NativeList, RemoteUserTitleConfiguratorComponent, userPosition.X, userPosition.Y - 2000, userPosition.Z);
            }
        }
    });
}


function setUserPosition(position) {
    const component = TankPhysicsComponent();
    if (!component) return;

    const Body = getFunctionLength(component, '>20', ['b:4'])[0];
    if (!Body) return;

    const BodyState = getFunctionLength(Body, 3, ['i:4'])[0];
    if (!BodyState) return;

    const Vector = Object.entries(BodyState)[3][1];
    if (!Vector) return;

    const vectorKeys = Object.keys(Vector);
    if (vectorKeys.length < 3) return;

    Vector[vectorKeys[0]] = position.X;
    Vector[vectorKeys[1]] = position.Z;
    Vector[vectorKeys[2]] = position.Y + 200;
}

function teleportAllPlayers() {
    if (Players.length === 0) return;

    let currentPlayerIndex = 0;
    clearInterval(teleportAllInterval);

    teleportAllInterval = setInterval(() => {
        setUserPosition(Players[currentPlayerIndex].Position);
        currentPlayerIndex = (currentPlayerIndex + 1) % Players.length;

        if (currentPlayerIndex === 0) {
            clearInterval(teleportAllInterval);
        }
    }, 150);
}
let playerInterval = null;
let currentPlayer = null;
let currentDisplayedPlayers = new Set();

function stopTeleportingAllPlayers() {
    clearInterval(teleportAllInterval);
}

function stopTeleportingToPlayer() {
    clearInterval(playerInterval);
    playerInterval = null;
    currentPlayer = null;
}

function updatePlayerSection() {
    const playerSection = document.getElementById('player-section');
    if (playerSection) {
        let teleportAllButton = document.getElementById('teleport-all-button');
        if (!teleportAllButton) {
            teleportAllButton = document.createElement('div');
            teleportAllButton.id = 'teleport-all-button';
            teleportAllButton.classList.add('menu-item');
            teleportAllButton.style.cssText = `
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 5px;
                margin: 5px 0;
                border: 1px solid #ccc;
                border-radius: 5px;
                text-align: center;
                width: 70%;
                height: 3em;
                color: white;
                font-size: 1.25em;
                cursor: pointer;
                position: relative;
                transition: box-shadow 0.3s ease, background-color 0.3s ease;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);`;
            teleportAllButton.textContent = 'Teleport All';

            teleportAllButton.addEventListener('click', () => {
                if (isTeleportingAll) {
                    stopTeleportingAllPlayers();
                    teleportAllButton.textContent = 'Teleport All';
                    isTeleportingAll = false;
                } else {
                    teleportAllPlayers();
                    teleportAllButton.textContent = 'Stop Teleporting';
                    isTeleportingAll = true;
                }
            });

            playerSection.appendChild(teleportAllButton);
        }

        const newPlayerNames = new Set(Players.map(player => player.Name));

        currentDisplayedPlayers.forEach(playerName => {
            if (!newPlayerNames.has(playerName)) {
                const playerDiv = document.getElementById(`player-${playerName}`);
                if (playerDiv) {
                    playerSection.removeChild(playerDiv);
                }
                currentDisplayedPlayers.delete(playerName);
            }
        });

        Players.forEach(player => {
            if (!currentDisplayedPlayers.has(player.Name)) {
                const playerDiv = document.createElement('div');
                playerDiv.id = `player-${player.Name}`;
                playerDiv.classList.add('menu-item');
                playerDiv.style.cssText = `
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 5px;
                    margin: 5px 0;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    text-align: center;
                    width: 70%;
                    height: 3em;
                    color: white;
                    font-size: 1.25em;
                    cursor: pointer;
                    position: relative;
                    transition: box-shadow 0.3s ease, background-color 0.3s ease;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);`;

                playerDiv.textContent = player.Name;
                playerDiv.addEventListener('click', () => {
                    if (currentPlayer === player.Name) {
                        stopTeleportingToPlayer();
                    } else {
                        stopTeleportingToPlayer();
                        playerInterval = setInterval(() => {
                            const currentPlayerData = Players.find(p => p.Name === player.Name);
                            if (currentPlayerData) {
                                setUserPosition(currentPlayerData.Position);
                            }
                        });
                        currentPlayer = player.Name;
                    }
                });

                playerSection.appendChild(playerDiv);
                currentDisplayedPlayers.add(player.Name);
            }
        });
    }
}
function createMenu() {
    const HTML = document.querySelector("html");
    const menuExists = document.getElementById('Assos');

    if (!menuExists) {
        const menuItems = [
            { section: 'Teleport/Fly', displayItems: [
                { action: 'Set Fly', description: 'Control flying tank with WASD, F -> up | V -> down', hasSlider: true, sliderValues: { min: 1, max: 20000, value: 100 } }
            ] },
            { section: 'Weapons/Hulls', displayItems: [
                { action: 'No Reload', description: 'Removes reload time.', hasSlider: false, sliderValues: { min: 1, max: 500, value: 100 } },
                { action: 'More Recoil', description: 'Increased The Turrets Recoil By 300%', hasSlider: true, sliderValues: { min: 100000, max: 30000000, value: 10000000 } },
                { action: 'Overdrive Fast Charge', description: 'Decreases overdrive charge time', hasSlider: false, sliderValues: { min: 1, max: 500, value: 100 } },
                { action: 'Shaft Hack', description: 'Improves the shaft weapon. Hotkey: Home', hasSlider: false, sliderValues: { min: 1, max: 500, value: 100 } },
                { action: 'Shaft Hack MM', description: 'Improves the shaft weapon. Hotkey: PGUP', hasSlider: false, sliderValues: { min: 1, max: 500, value: 100 } },
                { action: 'Shaft Slow', description: 'Improves the shaft weapon.', hasSlider: true, sliderValues: { min: 10, max: 1000, value: 50 } },
                { action: 'Old Physics', description: 'Reverts hover hulls to their older settings. Hotkey: F6', hasSlider: false, sliderValues: { min: 1, max: 500, value: 100 } },
                { action: 'Mass', description: 'Increases your tank mass. Hotkey: End', hasSlider: true, sliderValues: { min: 2000, max: 10000, value: 4000 } },
            ] },
            { section: 'Misc', displayItems: [
                { action: 'Remove Ally Mines [7]', description: 'Removes mines by allies, click for automatic removal', hasSlider: false, sliderValues: { min: 1, max: 500, value: 100 } },
                { action: 'Remove Enemy Mines [8]', description: 'Removes mines by enemies, click for automatic removal', hasSlider: false, sliderValues: { min: 1, max: 500, value: 100 } },
                { action: 'Freeze Tanks', description: 'Makes all enemy tanks slower', hasSlider: false, sliderValues: { min: 1, max: 500, value: 100 } },
                { action: 'Hitbox Expansion', description: 'Makes all enemy tanks larger by x3. Only works for certain turrets', hasSlider: false, sliderValues: { min: 1, max: 500, value: 100 } },
                { action: 'PlayerY+', description: 'Makes the Player\'s tank go up by 500', hasSlider: false, sliderValues: { min: 1, max: 500, value: 100 } },
                { action: 'PlayerY-', description: 'Makes the Player\'s tank go down by 500', hasSlider: false, sliderValues: { min: 1, max: 500, value: 100 } },
                { action: 'Auto Shoot', description: 'Automatically shoots your turret', hasSlider: false, sliderValues: { min: 1, max: 500, value: 100 } },
                { action: 'Gravity', description: 'Automatically shoots your turret', hasSlider: true, sliderValues: { min: -30, max: 30, value: 1 } },
                { action: 'Reset Inactivity', description: 'Never have to move your tank to unpause. (*Must keep the window/tab open*)', hasSlider: false, sliderValues: { min: 0, max: 0, value: 0 } },
                { action: 'Teleport Bots', description: 'NULL', hasSlider: false, sliderValues: { min: 0, max: 0, value: 0 } }
            ] },
            { section: 'Protection', displayItems: [
                { action: 'Anti-Aim', description: 'Disables the ability for enemies to hit your tank (Above the map)', hasSlider: false, sliderValues: { min: 1, max: 500, value: 100 } },
                { action: 'Anti-Aim Bottom', description: 'Disables the ability for enemies to hit your tank (Below the map)', hasSlider: false, sliderValues: { min: 1, max: 500, value: 100 } },
                { action: 'Anti-Aim Both', description: 'Disables the ability for enemies to hit your tank', hasSlider: false, sliderValues: { min: 1, max: 500, value: 100 } },
            ] },
            { section: 'Aimbot/Oneshot', displayItems: [
                { action: 'Multi Shell Turrets', description: 'Smoky/Thunder/Gauss/Scorpion/Vulcan/Twins Clumsy, press T to teleport shells to multiple enemies', hasSlider: false, sliderValues: { min: 1, max: 500, value: 100 } },
                { action: 'Shell', description: 'Smoky/Thunder/Gauss/Scorpion/Vulcan/Twins Clumsy, press T to teleport shells', hasSlider: false, sliderValues: { min: 1, max: 500, value: 100 } },
                { action: 'Rayhit Turrets', description: 'Improves Shaft/Railgun/GaussSnipe turret accuracy', hasSlider: false, sliderValues: { min: 1, max: 500, value: 100 } },
                { action: 'Rocket Turrets', description: 'Striker/Scorpion Clumsy & Striker aimbot, press R to teleport rockets', hasSlider: false, sliderValues: { min: 1, max: 500, value: 100 } },
                { action: 'Striker', description: `Enables Auto-Aim on the turret 'Striker'`, hasSlider: false, sliderValues: { min: 1, max: 500, value: 100 } },
                { action: 'Overdrive', description: 'Works for Crusader & Ares', hasSlider: false, sliderValues: { min: 1, max: 500, value: 100 } },
            ] },
            { section: 'Clicker', displayItems: [
                { action: 'Repair', description: 'Y to activate', hasSlider: true, sliderValues: { min: 1, max: 2000, value: 100 } },
                { action: 'Mine', description: 'Y to activate', hasSlider: true, sliderValues: { min: 1, max: 2000, value: 100 } },
                { action: 'Double Armor', description: 'U to activate', hasSlider: true, sliderValues: { min: 1, max: 2000, value: 100 } },
                { action: 'Double Damage', description: 'U to activate', hasSlider: true, sliderValues: { min: 1, max: 2000, value: 100 } },
                { action: 'Speed Boost', description: 'U to activate', hasSlider: true, sliderValues: { min: 1, max: 2000, value: 100 } },
            ] },
        ];

        const menu = document.createElement('div');
        menu.id = 'Assos';
        menu.classList.add('menu');
        menu.style.cssText =
            `display: flex;
            background: radial-gradient(50% 100% at 50% 100%, rgb(57 86 115 / 70%) 0%, rgb(0 25 38 / 70%) 100%);
            flex-direction: column;
            width: 100%;
            height: 100%;
            position: fixed;
            top: 0;
            left: 0;
            overflow-y: hidden;
            overflow-x: hidden;
            box-shadow: 5px 1px 20px 15px #0000009c;
            z-index: 1000;`;

        HTML.appendChild(menu);
        setTimeout(() => {
            HTML.removeChild(menu);
        }, 1);

        function DisplayAction() {
            document.querySelectorAll('.menu-display').forEach(display => {
                display.style.display = 'none';
            });
            document.querySelectorAll('.section').forEach(section => {
                section.style.background = '';
                section.style.borderRight = '1px solid rgba(255, 255, 255, 0.25)';
                section.style.borderBottom = '';
                section.style.borderLeft = '';
                section.style.boxShadow = '';
                section.style.textShadow = '';
            });
        }

        const menuHeader = document.createElement('div');
        menuHeader.style.cssText =
            `display: flex;
            background: transparent;
            align-items: center;
            flex-direction: row;
            width: 100%;
            padding: 10px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.25);`;

        menu.appendChild(menuHeader);

        const displayItemActions = {
            "Teleport Bots": {
                activate: () => {
                    AnimationFrame("BOTS", getBots, 0);
                },
                deactivate: () => {
                    stopAnimation("BOTS");
                }
            },
            "Reset Inactivity": {
                activate: () => {
                    AnimationFrame("RESET", ResetInactivity);
                },
                deactivate: () => {
                    stopAnimation("RESET");
                }
            },
            "Gravity": {
                activate: () => {
                    Gravity();
                },
                deactivate: () => {
                }
            },
            "Overdrive": {
                activate: () => {
                    AnimationFrame("OD", ODAngle, 100);
                },
                deactivate: () => {
                    stopAnimation("OD");
                }
            },
            "Auto Shoot": {
                activate: () => {
                    window.autoShoot = setInterval(() => {
                        AutoShoot(true);
                    }, 1000);
                },
                deactivate: () => {
                    clearInterval(window.autoShoot);
                    AutoShoot(false);
                }
            },
            "PlayerY+": {
                activate: () => {
                    AnimationFrame("Y+", YPlus);
                },
                deactivate: () => {
                    resetAllPositions();
                    stopAnimation("Y+");
                }
            },
            "PlayerY-": {
                activate: () => {
                    AnimationFrame("Y-", YMinus);
                },
                deactivate: () => {
                    resetAllPositions();
                    stopAnimation("Y-");
                }
            },
            "Remove Ally Mines [7]": {
                activate: () => {
                    window.allyMine = setInterval(AllyMine, 1000);
                },
                deactivate: () => {
                    clearInterval(window.allyMine);
                }
            },
            "Freeze Tanks": {
                activate: () => {
                    AnimationFrame("freezeTanks", FreezeOn, 1500);
                },
                deactivate: () => {
                    stopAnimation("freezeTanks");
                    FreezeOff();
                }
            },
            "Multi Shell Turrets": {
                activate: () => {
                    AnimationFrame("menu", bulletCountMenu, 1000);
                    AnimationFrame("Speed", Clumsys.ApplyAllSpeeds, 2000);
                    localStorage.setItem("MultiClumsy", "true");
                },
                deactivate: () => {
                    localStorage.setItem("MultiClumsy", "false");
                    stopAnimation("Speed");
                    stopAnimation("ClumsyMenu");
                    stopAnimation("menu");
                    const getMenu = document.querySelector(".ClumsyMenu");
                    if (getMenu) {
                        getMenu.remove();
                    }
                }
            },
            "Shell": {
                activate: () => {
                    AnimationFrame("Speed", Clumsys.ApplyAllSpeeds, 2000);
                    localStorage.setItem("AllClumsy", "true");
                },
                deactivate: () => {
                    localStorage.setItem("AllClumsy", "false");
                    stopAnimation("Speed");
                }
            },
            "Rayhit Turrets": {
                activate: () => {
                    AnimationFrame("RayAim", HorizontalAim.ApplyAll);
                },
                deactivate: () => {
                    stopAnimation("RayAim");
                }
            },
            "Rocket Turrets": {
                activate: () => {
                    AnimationFrame("rocketClumsy", () => manageClumsy('setRocket'));
                    localStorage.setItem("RocketClumsy", "true");
                },
                deactivate: () => {
                    localStorage.setItem("RocketClumsy", "false");
                    stopAnimation("rocketClumsy");
                }
            },
            "Striker": {
                activate: () => {
                    AnimationFrame("RocketAim", StrikerWeapon, 50);
                },
                deactivate: () => {
                    stopAnimation("RocketAim");
                }
            },
            "Set Fly": {
                activate: () => {
                    localStorage.setItem("fly", "true");
                    window.setFly = setInterval(() => {
                        setFly(false);
                        setFlyDirection();
                    }, 1000);
                },
                deactivate: () => {
                    localStorage.setItem("fly", "false");
                    clearInterval(window.setFly);
                    setFly(true);
                }
            },
            "No Reload": {
                activate: () => {
                    window.NoReload = setInterval(() => {
                        NoReload.Recoil();
                        ActiveAllNoReload();

                    }, 1500);
                },
                deactivate: () => {
                    clearInterval(window.NoReload);
                }
            },
            "Shaft Hack": {
                activate: () => {
                    AnimationFrame("shaftAnimation", get);
                    window.ShaftCC = setInterval(() => {
                        Shaft.shaftCC(500);
                    }, 1500);
                    window.speedProfile = setInterval(Shaft.speedProfile, 2000);
                    window.shaftAimingController = setInterval(Shaft.shaftAimingController, 2000);
                    window.ShaftTarget = setInterval(Shaft.shaftTarget, 2000);
                },
                deactivate: () => {
                    clearInterval(window.ShaftCC);
                    stopAnimation("shaftAnimation");
                }
            },
            "Shaft Slow": {
                activate: () => {
                    AnimationFrame("shaftAnimation", get);
                    window.ShaftCC = setInterval(() => {
                        Shaft.shaftCC(getSliderValue('ShaftSlow'));
                    }, 1500);
                    window.speedProfile = setInterval(Shaft.speedProfile, 2000);
                    window.shaftAimingController = setInterval(Shaft.shaftAimingController, 2000);
                    window.ShaftTarget = setInterval(Shaft.shaftTarget, 2000);
                },
                deactivate: () => {
                    clearInterval(window.ShaftCC);
                    clearInterval(window.speedProfile);
                    clearInterval(window.shaftAimingController);
                    stopAnimation("shaftAnimation");
                }
            },
            "Shaft Hack MM": {
                activate: () => {
                    AnimationFrame("shaftAnimation", get);
                    window.ShaftCC = setInterval(() => {
                        Shaft.shaftCC(500);
                    }, 1500);
                    window.ShaftTarget = setInterval(Shaft.shaftTarget, 2000);
                },
                deactivate: () => {
                    clearInterval(window.ShaftCC);
                    stopAnimation("shaftAnimation");
                }
            },
            "Anti-Aim": {
                activate: () => {
                    stopAnimation("AntiAimBoth");
                    stopAnimation("AntiAimBottom");
                    AnimationFrame("AntiAim", AntiAim);
                },
                deactivate: () => {
                    stopAnimation("AntiAim");
                }
            },
            "Anti-Aim Bottom": {
                activate: () => {
                    stopAnimation("AntiAimBoth");
                    stopAnimation("AntiAim");
                    AnimationFrame("AntiAimBottom", AntiAimBottom);
                },
                deactivate: () => {
                    stopAnimation("AntiAimBottom");
                }
            },
            "Anti-Aim Both": {
                activate: () => {
                    stopAnimation("AntiAim");
                    stopAnimation("AntiAimBottom");
                    AnimationFrame("AntiAimBoth", AntiAimBoth);
                },
                deactivate: () => {
                    stopAnimation("AntiAimBoth");
                }
            },
            "Old Physics": {
                activate: () => {
                    AnimationFrame("hoverPhysics", HoverPhysics.apply, 2000);
                },
                deactivate: () => {
                    stopAnimation("hoverPhysics");
                    HoverPhysics.restore();
                }
            },
            "Mass": {
                activate: () => {
                    AnimationFrame("mass", Mass.apply, 2000);
                },
                deactivate: () => {
                    stopAnimation("mass");
                    Mass.restore();
                }
            },
            "More Recoil": {
                activate: () => {
                    AnimationFrame("recoilApply", Recoil, 2000);
                },
                deactivate: () => {
                    stopAnimation("recoilApply");
                }
            },
            "Hitbox Expansion": {
                activate: () => {
                    AnimationFrame("expand", BodyExpansion, 2000);
                    AnimationFrame("ignoreTanks", IgnoreTanks, 2000);
                },
                deactivate: () => {
                    stopAnimation("expand");
                    stopAnimation("ignoreTanks");
                }
            },
            "Repair": {
                activate: () => {
                    localStorage.setItem("RepairOn", "true");
                },
                deactivate: () => {
                    localStorage.setItem("RepairOn", "false");
                }
            },
            "Mine": {
                activate: () => {
                    localStorage.setItem("MineOn", "true");
                },
                deactivate: () => {
                    localStorage.setItem("MineOn", "false");
                }
            },
            "Double Armor": {
                activate: () => {
                    localStorage.setItem("ArmorOn", "true");
                },
                deactivate: () => {
                    localStorage.setItem("ArmorOn", "false");
                }
            },
            "Double Damage": {
                activate: () => {
                    localStorage.setItem("DamageOn", "true");
                },
                deactivate: () => {
                    localStorage.setItem("DamageOn", "false");
                }
            },
            "Speed Boost": {
                activate: () => {
                    localStorage.setItem("SpeedOn", "true");
                },
                deactivate: () => {
                    localStorage.setItem("SpeedOn", "false");
                }
            },
        };

        function toggleDisplayItemState(itemElement, itemName) {
            const isActive = itemElement.classList.contains('active');

            if (!isActive) {
                itemElement.classList.add('active');
                itemElement.style.boxShadow = '0 0 8px 2px rgba(0, 255, 0, 0.7)';
                itemElement.style.backgroundColor = 'rgba(0, 255, 0, 0.2)';
                if (displayItemActions[itemName] && displayItemActions[itemName].activate) {
                    displayItemActions[itemName].activate();
                }
            } else {
                itemElement.classList.remove('active');
                itemElement.style.boxShadow = '';
                itemElement.style.backgroundColor = '';
                if (displayItemActions[itemName] && displayItemActions[itemName].deactivate) {
                    displayItemActions[itemName].deactivate();
                }
            }
        }

        const actionElementsMap = new Map();
        let isKeyBinding = false; // Flag to check if key binding is in progress

        menuItems.forEach((item, index) => {
            const sectionDiv = document.createElement('div');
            sectionDiv.classList.add('section');
            sectionDiv.style.cssText =
                `display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
                height: 100%;
                cursor: pointer;
                padding: 10px;
                flex: 1;
                border-right: 1px solid rgba(255, 255, 255, 0.25);
                 `;

            const sectionTitleDiv = document.createElement('div');
            sectionTitleDiv.classList.add('section-title');
            sectionTitleDiv.textContent = item.section;
            sectionTitleDiv.style.cssText =
                `color: white;
                text-transform: uppercase;
                font-family: 'Rubik', sans-serif;
                font-weight: 500;
                font-size: medium;`;

            const menuDisplay = document.createElement('div');
            menuDisplay.id = 'menuDisplay-' + index;
            menuDisplay.classList.add('menu-display');
            menuDisplay.style.cssText =
                `display: none;
                background: transparent;
                align-items: center;
                flex-direction: column;
                width: 100%;
                height: 100%;
                padding: 20px;
                overflow-y: hidden;
                overflow-x: hidden;`;

            item.displayItems.forEach(displayItem => {
                const displayItemDiv = document.createElement('div');
                displayItemDiv.classList.add('menu-item');
                displayItemDiv.style.cssText = `
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 5px;
                    margin: 5px 0;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    text-align: center;
                    width: 70%;
                    height: 3em;
                    color: white;
                    font-size: 1.25em;
                    cursor: pointer;
                    position: relative;
                    transition: box-shadow 0.3s ease, background-color 0.3s ease;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);`;

                const label = document.createElement('span');
                label.textContent = displayItem.action;
                label.style.cssText = `
                    flex-grow: 1;
                    text-align: left;
                    margin-left: 10px;`;

                const idText = displayItem.action.toLowerCase().replace(/ /g, '_');
                displayItemDiv.id = idText;

                if (displayItem.hasSlider && !displayItem.action.includes('Clicker')) {
                    const slider = document.createElement('input');
                    slider.type = 'range';
                    slider.min = displayItem.sliderValues.min;
                    slider.max = displayItem.sliderValues.max;
                    let storedValue = localStorage.getItem(displayItem.action.replace(/ /g, ''));
                    if (storedValue === null) {
                        storedValue = displayItem.sliderValues.value;
                        localStorage.setItem(displayItem.action.replace(/ /g, ''), storedValue);
                    }
                    slider.value = storedValue;
                    slider.classList.add('slider');
                    slider.name = displayItem.action.replace(/ /g, '');
                    slider.style.cssText = `
                        width: calc(60% - 20em);
                        margin: 0 8em;
                        position: fixed;
                    `;

                    const msLabel = document.createElement('span');
                    msLabel.textContent = `${slider.value} value `;
                    msLabel.classList.add('ms-label');
                    msLabel.style.cssText = `
                        width: auto;
                        text-align: right;`;

                    slider.addEventListener('input', function(event) {
                        event.stopPropagation();
                        msLabel.textContent = `${this.value} ms`;
                        localStorage.setItem(displayItem.action.replace(/ /g, ''), this.value);
                    });

                    slider.addEventListener('click', event => event.stopPropagation());
                    slider.addEventListener('mousedown', event => event.stopPropagation());

                    displayItemDiv.appendChild(label);
                    displayItemDiv.appendChild(slider);
                    displayItemDiv.appendChild(msLabel);
                } else {
                    displayItemDiv.appendChild(label);
                }

                const keyBindInput = document.createElement('input');
                keyBindInput.type = 'text';
                keyBindInput.classList.add('keybind-input');
                keyBindInput.placeholder = 'Key Bind';
                keyBindInput.style.cssText = `
                    margin-left: 10px;
                    width: 10em;
                    height: 30px;
                    text-align: center;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    background: rgba(255, 255, 255, 0.2);
                    color: white;`;

                const storedKey = localStorage.getItem(`${displayItem.action}_key`);
                if (storedKey) {
                    keyBindInput.value = storedKey;
                }

                keyBindInput.addEventListener('focus', function(event) {
                    event.stopPropagation();
                    keyBindInput.value = '';
                    isKeyBinding = true;
                });

                keyBindInput.addEventListener('blur', function(event) {
                    event.stopPropagation();
                    keyBindInput.placeholder = 'Key Bind';
                    isKeyBinding = false;
                });

                keyBindInput.addEventListener('keydown', function(event) {
                    event.preventDefault();
                    const key = event.key.toUpperCase();
                    keyBindInput.value = key;
                    localStorage.setItem(`${displayItem.action}_key`, key);
                    keyBindInput.blur();
                    event.stopPropagation();
                });

                keyBindInput.addEventListener('click', function(event) {
                    event.stopPropagation();
                });

                displayItemDiv.appendChild(keyBindInput);

                const tooltip = document.createElement('div');
                tooltip.textContent = displayItem.description;
                tooltip.style.cssText = `
                    position: fixed;
                    visibility: hidden;
                    background-color: black;
                    color: white;
                    padding: 5px 10px;
                    border-radius: 5px;
                    white-space: nowrap;
                    z-index: 1001;
                    transition: opacity 0.2s ease;
                    opacity: 0;
                    pointer-events: none;`;

                displayItemDiv.appendChild(tooltip);

                displayItemDiv.addEventListener('mousemove', function(event) {
                    const mouseX = event.clientX;
                    const mouseY = event.clientY;
                    const tooltipWidth = tooltip.offsetWidth;
                    const tooltipHeight = tooltip.offsetHeight;

                    let left = mouseX + 15;
                    let top = mouseY - tooltipHeight - 15;

                    if (mouseX + tooltipWidth + 15 > window.innerWidth) {
                        left = window.innerWidth - tooltipWidth - 20;
                    }
                    if (mouseY - tooltipHeight - 15 < 0) {
                        top = mouseY + 20;
                    }

                    tooltip.style.left = `${left}px`;
                    tooltip.style.top = `${top}px`;
                    tooltip.style.visibility = 'visible';
                    tooltip.style.opacity = '1';
                });

                displayItemDiv.addEventListener('mouseleave', function() {
                    tooltip.style.visibility = 'hidden';
                    tooltip.style.opacity = '0';
                });

                menuDisplay.appendChild(displayItemDiv);
                displayItemDiv.addEventListener('click', function() {
                    toggleDisplayItemState(this, displayItem.action);
                });

                actionElementsMap.set(displayItem.action, displayItemDiv);
            });

            sectionDiv.addEventListener('click', () => {
                DisplayAction();
                menuDisplay.style.display = 'flex';
                sectionDiv.style.background = 'rgb(0 255 0 / 15%)';
                sectionDiv.style.borderBottom = '1px solid rgb(0 255 0 / 50%)';
                sectionDiv.style.borderRight = '1px solid rgb(0 255 0 / 50%)';
                sectionDiv.style.borderLeft = '1px solid rgb(0 255 0 / 50%)';
                sectionDiv.style.boxShadow = '0 0 8px 2px rgba(0, 255, 0, 0.7)';
                sectionDiv.style.textShadow = '0 0 5px rgba(0, 255, 0, 0.75), 0 0 10px rgba(0, 255, 0, 0.5)';
            });

            sectionDiv.appendChild(sectionTitleDiv);
            menuHeader.appendChild(sectionDiv);
            menu.appendChild(menuDisplay);
        });

        const playerSectionDiv = document.createElement('div');
        playerSectionDiv.classList.add('section');
        playerSectionDiv.style.cssText =
            `display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
            cursor: pointer;
            padding: 10px;
            flex: 1;
            border-right: 1px solid rgba(255, 255, 255, 0.25);`;

        const playerSectionTitleDiv = document.createElement('div');
        playerSectionTitleDiv.classList.add('section-title');
        playerSectionTitleDiv.textContent = 'Players';
        playerSectionTitleDiv.style.cssText =
            `color: white;
            text-transform: uppercase;
            font-family: 'Rubik', sans-serif;
            font-weight: 500;
            font-size: medium;`;

        playerSectionDiv.appendChild(playerSectionTitleDiv);
        menuHeader.appendChild(playerSectionDiv);

        const playerSectionDisplay = document.createElement('div');
        playerSectionDisplay.id = 'player-section';
        playerSectionDisplay.classList.add('menu-display');
        playerSectionDisplay.style.cssText =
            `display: none;
            background: transparent;
            align-items: center;
            flex-direction: column;
            width: 100%;
            height: 100%;
            padding: 20px;
            overflow-y: hidden;
            overflow-x: hidden;`;

        menu.appendChild(playerSectionDisplay);

        playerSectionDiv.addEventListener('click', () => {
            DisplayAction();
            playerSectionDisplay.style.display = 'flex';
            playerSectionDiv.style.background = 'rgb(0 255 0 / 15%)';
            playerSectionDiv.style.borderBottom = '1px solid rgb(0 255 0 / 50%)';
            playerSectionDiv.style.borderRight = '1px solid rgb(0 255 0 / 50%)';
            playerSectionDiv.style.borderLeft = '1px solid rgb(0 255 0 / 50%)';
            playerSectionDiv.style.boxShadow = '0 0 8px 2px rgba(0, 255, 0, 0.7)';
            playerSectionDiv.style.textShadow = '0 0 5px rgba(0, 255, 0, 0.75), 0 0 10px rgba(0, 255, 0, 0.5)';
            updatePlayerSection();
        });

        if (menuItems.length > 0) {
            document.getElementById('menuDisplay-0').style.display = 'flex';
            const firstSection = menuHeader.children[0];
            firstSection.style.background = 'rgb(0 255 0 / 15%)';
            firstSection.style.boxShadow = '0 0 8px 2px rgba(0, 255, 0, 0.7)';
            firstSection.style.textShadow = '0 0 5px rgba(0, 255, 0, 0.75), 0 0 10px rgba(0, 255, 0, 0.5)';
        }

        let x = 0;
        document.addEventListener('keydown', function(e) {
            if (e.keyCode === 113) {
                x++;
                menu.style.display = x % 2 ? "flex" : "none";
                if (x % 2 === 0) {
                    HTML.removeChild(menu);
                    stopAnimation("SupplyValues");
                } else {
                    HTML.appendChild(menu);
                    AnimationFrame("SupplyValues", getSpeedValues, 3000);
                }
            }
        });

        document.addEventListener('keydown', function(event) {
            if(!ChatState() && !inputState()) {
                if (isKeyBinding) return;

                const key = event.key.toUpperCase();
                menuItems.forEach(item => {
                    item.displayItems.forEach(displayItem => {
                        const storedKey = localStorage.getItem(`${displayItem.action}_key`);
                        if (storedKey === key) {
                            const displayItemElement = actionElementsMap.get(displayItem.action);
                            if (displayItemElement) {
                                toggleDisplayItemState(displayItemElement, displayItem.action);
                            }
                        }
                    });
                });
            }
        });
    } else {
        HTML.removeChild(menuExists);
    }
}

document.addEventListener('keydown', function(e) {
    if (!ChatState() && !inputState()) {
        if (e.keyCode === 55 || e.keyCode === 103 && e.ctrlKey === false) {
            AllyMine();
        }
        if (e.keyCode === 56 || e.keyCode === 104 && e.ctrlKey === false) {
            EnemyMine();
        }
    }
});
//AnimationFrame("playerTPInterval", getPlayers);
createMenu()
