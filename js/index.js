/**
 * ToDo) Make Unique and non unique areas in map loader
 * ToDo) Create a prompt for world gen size
 */

//Global Variables
var worldMap;
var directionalArr = [
  [1, 0],   //North
  [1, 1],   //Northeast
  [0, 1],   //East
  [-1, 1],  //Southeast
  [-1, 0],  //South
  [-1, -1], //Southwest
  [0, -1],  //West
  [1, -1],  //Northwest
];
var currentPos;
var selectedNodeIndex = null;

const loadMap = async function (mapSize) {
  // Load from JSON
  const response = await fetch("../assets/json/mapData.json");
  const jsonData = await response.json();
  const locations = jsonData.locations;

  //Add elements loaded in random order to the array
  const arrArr = [...Array(mapSize)].map(x => ([...Array(mapSize)].map(x => null)));
  for (let i = 0; i < mapSize; i++) {
    for (let k = 0; k < mapSize; k++) {
      let locIndex = Math.floor(Math.random() * locations.length);
      arrArr[i][k] = locations.splice(locIndex, 1)[0];
    }
  }
  return arrArr;
}

const calculateNewNode = function () {
  const upperBound = worldMap.length - 1;
  const lowerBound = 0;

  newPos = [
    currentPos[0] + directionalArr[selectedNodeIndex][0],
    currentPos[1] + directionalArr[selectedNodeIndex][1]
  ];

  //Check bounds and correct if necessary
  if (newPos[0] < lowerBound)
    newPos[0] = upperBound;
  else if (newPos[0] > upperBound)
    newPos[0] = lowerBound;

  if (newPos[1] < lowerBound)
    newPos[1] = upperBound;
  else if (newPos[1] > upperBound)
    newPos[1] = lowerBound;

  return newPos;
}

const setSelectedNodeText = function () {
  const selectedElement = document.getElementById("selected-node-display");
  if (selectedNodeIndex === null) {
    selectedElement.style.display = "none";
    selectedElement.children[0].innerHTML = "";
    selectedElement.children[1].innerHTML = "";
  } else {
    selectedElement.style.display = "block";
    selectedElement.children[0].innerHTML = worldMap[calculateNewNode()[0]][calculateNewNode()[1]].title;
    selectedElement.children[1].innerHTML = selectedNodeIndex;
  }
}

const changeSelectedNode = function (index) {
  selectedNodeIndex = index;
  setSelectedNodeText();
}

const setCurrentNodeText = function () {
  const currentElement = document.getElementById("current-node-display");
  currentElement.children[0].innerHTML = worldMap[currentPos[0]][currentPos[1]].title;
}

const rotateDirRandomly = function () {
  const rotation = Math.floor(Math.random() * directionalArr.length) * (Math.round(Math.random()) ? 1 : -1);
  if (rotation > 0) {
    for (let i = 0; i < rotation; i++) {
      directionalArr.unshift(directionalArr.pop());
    }
  } else if (rotation < 0) {
    for (let i = rotation; i < 0; i++) {
      directionalArr.push(directionalArr.shift());
    }
  }
}

const traverseWorldMap = function () {
  if (selectedNodeIndex === null)
    return;
  currentPos = calculateNewNode();
  selectedNodeIndex = null;
  rotateDirRandomly();
  setCurrentNodeText();
  setSelectedNodeText();
}

const loadControls = function () {
  document.getElementById("top-dir-button").onclick = () => { changeSelectedNode(0) };
  document.getElementById("top-right-dir-button").onclick = () => { changeSelectedNode(1) };
  document.getElementById("mid-right-dir-button").onclick = () => { changeSelectedNode(2) };
  document.getElementById("bottom-right-dir-button").onclick = () => { changeSelectedNode(3) };
  document.getElementById("bottom-dir-button").onclick = () => { changeSelectedNode(4) };
  document.getElementById("bottom-left-dir-button").onclick = () => { changeSelectedNode(5) };
  document.getElementById("mid-left-dir-button").onclick = () => { changeSelectedNode(6) };
  document.getElementById("top-left-dir-button").onclick = () => { changeSelectedNode(7) };
  document.getElementById("go-button").onclick = () => { traverseWorldMap(); };
}

const loadFunc = async function () {
  worldMap = await loadMap(5);
  currentPos = [Math.round((worldMap.length - 1) / 2), Math.round((worldMap.length - 1) / 2)];
  loadControls();
  setCurrentNodeText();
  setSelectedNodeText();
}

window.onload = loadFunc;