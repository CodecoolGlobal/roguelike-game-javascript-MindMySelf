'use strict';

/**
 * Unchangable configuration variables
 */
const c = Object.freeze({
  emptySpace: ' ',
  wall: '#',
  enemy: 'X',
  gateHorizontal: '"',
  gateVertical: '=',
  boardWidth: 80,
  boardHeight: 24,
});

/**
 * The state of the current game
 */
const GAME = {
  currentRoom: '',
  board: [],
  map: {},
  player: {},
};

/**
 * Create a new player Object
 *
 * @param {string} name name of the player
 * @param {string} race race of the player
 * @returns
 */
function initPlayer(name, race) {
  return {
    x: 19,
    y: 15,
    name: name,
    icon: '@',
    race: race,
    health: 100,
    attack: 1,
    defense: 1,
    isPlayer: true,
  };
}

/**
 * List of the 4 main directions
 */
const DIRECTIONS = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

/**
 * Enum for the rooms
 */
const ROOM = {
  A: 'A',
  B: 'B',
  C: 'C',
  D: 'D',
  E: 'E',
};

/**
 * Icon of the enemies
 */
const ENEMY = {
  // RAT: "r",
  RAT: 'r',
  BANDIT: 'b',
  SKELETON: 's',
  BOSS: '$',
};

/**
 * Info of the enemies
 */
const ENEMY_INFO = {

  // [ENEMY.RAT]: { health: 10, attack: 1, defense: 0, icon: ENEMY.RAT, race: "Rat", isBoss: false },
  [ENEMY.RAT]: {
    health: 10, attack: 1, defense: 0,
    icon: ENEMY.RAT, race: 'Rat', isBoss: false,
  },

  [ENEMY.BANDIT]: {
    health: 20, attack: 3, defense: 1,
    icon: ENEMY.BANDIT, race: 'Bandit', isBoss: false,
  },

  [ENEMY.SKELETON]: {
    health: 15, attack: 2, defense: 0,
    icon: ENEMY.SKELETON, race: 'Skeleton', isBoss: false,
  },

  [ENEMY.BOSS]: {
    health: 500, attack: 10, defense: 3,
    icon: ENEMY.BOSS, race: 'Golem', isBoss: true,
  },
};


/**
 * Initialize the play area with starting conditions
 */
function init() {
  GAME.currentRoom = ROOM.A;
  GAME.map = generateMap();
  GAME.board = createBoard(c.boardWidth, c.boardHeight, c.emptySpace);
  GAME.player = initPlayer(playerName.value, playerRace.value);
  // GAME.player.x = getCurrentRoom().gates[0].playerStart.x;
  // GAME.player.y = getCurrentRoom().gates[0].playerStart.y;
  drawScreen();
}

const playerName = document.getElementById('playerName');
const playerRace = document.getElementById('playerRace');


/**
 * Initialize the dungeon map and the items and enemies in it
 */
function generateMap() {
  return {
    [ROOM.A]: {
      layout: [10, 10, 20, 20],
      gates: [
        //{x: 6, y: 15, icon: c.gateHorizontal, playerStart: { x: 19, y: 15 } },
        {
          to: ROOM.B, x: 20, y: 15, icon: c.gateVertical,
          playerStart: { x: 15, y: 7 }
        },
      ],
      enemies: [
        {
          type: ENEMY.RAT, x: 12, y: 15,
          name: 'Raataaa', ...ENEMY_INFO[ENEMY.RAT]
        },
        // ^^^^^^^^^   please keep tis format for enemys ^^^^^^^^^^^^^
        //{ type: 'rat', x: 13, y: 13, name: 'Raaataaa', icon: ENEMY.RAT },
        //{ type: 'rat', x: 25, y: 15, name: 'Raaaaataaa', icon: ENEMY.RAT },
        //{ type: 'rat', x: 25, y: 15, name: 'Raattaaa', icon: ENEMY.RAT },
      ],
      items: [
        {
          type: ITEMS.bread.type, x: 15, y: 15,
          name: ITEMS.bread.name, icon: ITEMS.bread.icon
        },

        {
          type: ITEMS.bread.type, x: 12, y: 18,
          name: ITEMS.bread.name, icon: ITEMS.bread.icon
        },
      ],
    },
    [ROOM.B]: {
      layout: [13, 6, 17, 70],
      gates: [
        {
          to: ROOM.A, x: 6, y: 15, icon: c.gateVertical,
          playerStart: { x: 15, y: 19 }
        },

        {
          to: ROOM.C, x: 65, y: 13, icon: c.gateHorizontal,
          playerStart: { x: 18, y: 3 }
        },
      ],
      enemies: [
        // { type: ENEMY.RAT, x: 25, y: 15, name: "Rattata", ...ENEMY_INFO[ENEMY.RAT] },
      ],
      items: [
        {
          type: ITEMS.apple.type, x: 14, y: 58,
          name: ITEMS.apple.name, icon: ITEMS.apple.icon
        },

        {
          type: ITEMS.apple.type, x: 16, y: 27,
          name: ITEMS.apple.name, icon: ITEMS.apple.icon
        },
      ],
    },
    [ROOM.C]: {
      layout: [2, 2, 22, 60],
      gates: [
        {
          to: ROOM.B, x: 2, y: 18, icon: c.gateVertical,
          playerStart: { x: 14, y: 65 }
        },
      ],
      enemies: [
        // { type: ENEMY.RAT, x: 25, y: 15, name: "Rattata", ...ENEMY_INFO[ENEMY.RAT] },
      ],
      items: [
        {
          type: ITEMS.potion.type, x: 4, y: 6,
          name: ITEMS.potion.name, icon: ITEMS.potion.icon
        },

        {
          type: ITEMS.potion.type, x: 20, y: 34,
          name: ITEMS.potion.name, icon: ITEMS.potion.icon
        },

        {
          type: ITEMS.potion.type, x: 16, y: 54,
          name: ITEMS.potion.name, icon: ITEMS.potion.icon
        },

        {
          type: ITEMS.potion.type, x: 10, y: 10,
          name: ITEMS.potion.name, icon: ITEMS.potion.icon
        },
      ],
    },
  };
}

/**
 * Display the board on the screen
 * @param {*} board the gameplay area
 */
function displayBoard(board) {
  const screen = board.join('\n').split(',').join(''); // ...
  _displayBoard(screen);
}

/**
 * Draw the rectangular room, and show the items, enemies and the player on the screen, then print to the screen
 */
function drawScreen() {
  // ... reset the board with `createBoard`
  GAME.board = createBoard(c.boardWidth, c.boardHeight, c.emptySpace);
  // ... use `drawRoom`
  drawRoom(GAME.board, getCurrentRoom().layout[0], getCurrentRoom().layout[1],
    getCurrentRoom().layout[2], getCurrentRoom().layout[3]);
  // ... print entities with `addToBoard`
  addToBoard(GAME.board, GAME.player, GAME.player.icon);
  displayBoard(GAME.board);
}

/**
 * Implement the turn based movement. Move the player, move the enemies, show the statistics and then print the new frame.
 *
 * @param {*} yDiff
 * @param {*} xDiff
 * @returns
 */
function moveAll(yDiff, xDiff) {
  // ... use `move` to move all entities
  move(GAME.player, yDiff, xDiff);
  // ... show statistics with `showStats`
  showStats(GAME.player, ENEMY.RAT);

  // ... reload screen with `drawScreen`
  drawScreen();

}

/**
 * Implement the movement of an entity (enemy/player)
 *
 * - Do not let the entity out of the screen.
 * - Do not let them mve through walls.
 * - Let them visit other rooms.
 * - Let them attack their enemies.
 * - Let them move to valid empty space.
 *
 * @param {*} who entity that tried to move
 * @param {number} yDiff difference in Y coord
 * @param {number} xDiff difference in X coord
 * @returns
 */
function move(who, yDiff, xDiff) {

  //console.log(`Player position - X: ${who.x} Y: ${who.y}`);
  const desiredYPos = who.y + yDiff;
  const desiredXPos = who.x + xDiff;
  const isGate = GAME.board[desiredXPos][desiredYPos] === c.gateHorizontal ||
    GAME.board[desiredXPos][desiredYPos] === c.gateVertical;
  // ... check if hit a wall
  if (GAME.board[desiredXPos][desiredYPos] === c.wall) {
    return console.log('Someone tried to hit a wall');
  }
  // ... check if move to new room (`removeFromBoard`, `addToBoard`)
  else if (isGate) {
    for (const gate of getCurrentRoom().gates) {
      const isCurrentGate = desiredXPos === gate.y && desiredYPos === gate.x;
      if (isCurrentGate) {
        GAME.currentRoom = gate.to;
        who.x = gate.playerStart.x;
        who.y = gate.playerStart.y;
      }
    }
    return console.log('Moved to another room');
  }

  // ... check if attack player
  else if (GAME.board[desiredXPos][desiredYPos] === GAME.player.icon) {
    if (GAME.player.health <= 0) {
      _gameOver();
    } else {
      GAME.player.health -= who.attack;
    }
    return console.log('Player has been attacked');
  }


  //     ... use `_gameOver()` if necessary

  // ... check if move to empty space
  if (GAME.board[desiredXPos][desiredYPos] !== c.emptySpace) {
    // ... check if taking item
    for (const item of getCurrentRoom().items) {
      const isCurrentItem = desiredXPos === item.x && desiredYPos === item.y;
      if (isCurrentItem) {
        //add item to player
        removeFromBoard(GAME.board, item);
        if ('damage' in ITEMS[item.name]) {
          GAME.player.attack += ITEMS[item.name].damage;
        } else if ('heal' in ITEMS[item.name]) {
          GAME.player.health += ITEMS[item.name].heal;
        } else if ('defense' in ITEMS[item.name]) {
          GAME.player.defense += ITEMS[item.name].defense;
        }
        item.x = 0;
        item.y = 0;
        item.icon = ' ';
        return console.log('Player has been picked up an item');
      }
    }
    for (const enemy of getCurrentRoom().enemies) {
      const isCurrentEnemy = desiredXPos === enemy.x && desiredYPos === enemy.y;
      if (isCurrentEnemy) {
        // Write your desire here
        //removeFromBoard live it here
        removeFromBoard(GAME.board, enemy);
        enemy.x = 0;
        enemy.y = 0;
        enemy.icon = ' ';
        return console.log('Player has been met with an enemy');
      }
    }
    return console.log('Tried to move to non empty space');
  }
  removeFromBoard(GAME.board, GAME.player);
  who.x = desiredXPos;
  who.y = desiredYPos;
  addToBoard(GAME.board, GAME.player, GAME.player.icon);
  if (GAME.player.health <= 0) {
    console.log('lefutok');
    _gameOver();
  }

}

/**
 * Check if the entity found anything actionable.
 *
 * @param {*} board the gameplay area
 * @param {*} y Y position on the board
 * @param {*} x X position on the board
 * @returns boolean if found anything relevant
 */
function hit(board, y, x) {
  // ...
}

/**
 * Add entity to the board
 *
 * @param {Array} board the gameplay area
 * @param {Object} item anything with position data
 * @param {string} icon icon to print on the screen
 */
function addToBoard(board, item, icon) {
  board[item.x][item.y] = icon;
}

/**
 * Remove entity from the board
 *
 * @param {*} board the gameplay area
 * @param {*} item anything with position data
 */
function removeFromBoard(board, item) {
  board[item.x][item.y] = c.emptySpace;
  // ...
}

/**
 * Create the gameplay area to print
 *
 * @param {number} width width of the board
 * @param {number} height height of the board
 * @param {string} emptySpace icon to print as whitespace
 * @returns
 */
function createBoard(width, height, emptySpace) {
  return [...Array(height)].map(() => Array(width).fill(emptySpace));
  //placeholder testnek
}

/**
 * Draw a rectangular room
 *
 * @param {*} board the gameplay area to update with the room
 * @param {*} topY room's top position on Y axis
 * @param {*} leftX room's left position on X axis
 * @param {*} bottomY room's bottom position on Y axis
 * @param {*} rightX room's right position on X axis
 */
function drawRoom(board, topY, leftX, bottomY, rightX) {
  for (let x = leftX; x <= rightX; x++) {
    board[topY][x] = c.wall;
    board[bottomY][x] = c.wall;
  }
  for (let y = topY; y < bottomY; y++) {
    board[y][leftX] = c.wall;
    board[y][rightX] = c.wall;
  }
  for (const gate of getCurrentRoom().gates) {
    board[gate.y][gate.x] = gate.icon;
  }
  for (const item of getCurrentRoom().items) {
    addToBoard(GAME.board, item, item.icon);
  }
  for (const enemy of getCurrentRoom().enemies) {
    addToBoard(GAME.board, enemy, enemy.icon);
  }
  return board;
}

/**
 * Print stats to the user
 *
 * @param {*} player player info
 * @param {array} enemies info of all enemies in the current room
 */
function showStats(player, enemies) {
  const playerStats = `Player stats:
  Player Name: ${player.name}
  Player Race: ${player.race}
  Health: ${player.health}
  Attack: ${player.attack}
  Defense: ${player.defense}`;

  const enemyStats = 'Enemy stat'; // ... concatenate them with a newline
  _updateStats(playerStats, enemyStats);
}

/**
 * Update the gameplay area in the DOM
 * @param {*} board the gameplay area
 */
function _displayBoard(screen) {
  document.getElementById('screen').innerText = screen;
}

/**
 * Update the gameplay stats in the DOM
 *
 * @param {*} playerStatText stats of the player
 * @param {*} enemyStatText stats of the enemies
 */
function _updateStats(playerStatText, enemyStatText) {
  const playerStats = document.getElementById('playerStats');
  playerStats.innerText = playerStatText;
  const enemyStats = document.getElementById('enemyStats');
  enemyStats.innerText = enemyStatText;
}

/**
 * Keep a reference of the existing keypress listener, to be able to remove it later
 */
let _keypressListener = null;

/**
 * Code to run after the player ddecided to start the game.
 * Register the movement handler, and make sure that the boxes are hidden.
 *
 * @param {function} moveCB callback to handle movement of all entities in the room
 */
function _start(moveCB) {
  const msgBox = document.getElementById('startBox');
  const endBox = document.getElementById('endBox');
  endBox.classList.add('is-hidden');
  GAME.player.name = document.getElementById('playerName').value;
  GAME.player.race = document.getElementById('playerRace').value;
  msgBox.classList.toggle('is-hidden');
  _keypressListener = (e) => {
    let xDiff = 0;
    let yDiff = 0;
    switch (e.key.toLocaleLowerCase()) {
      case 'w': { yDiff = 0; xDiff = -1; break; }
      case 's': { yDiff = 0; xDiff = 1; break; }
      case 'a': { yDiff = -1; xDiff = 0; break; }
      case 'd': { yDiff = 1; xDiff = 0; break; }
    }
    if (xDiff !== 0 || yDiff !== 0) {
      moveCB(yDiff, xDiff);
    }
  };
  document.addEventListener('keypress', _keypressListener);
}

/**
 * Code to run when the player died.
 *
 * Makes sure that the proper boxes are visible.
 */
function _gameOver() {
  const msgBox = document.getElementById('startBox');
  msgBox.classList.add('is-hidden');
  const endBox = document.getElementById('endBox');
  endBox.classList.remove('is-hidden');
  if (_keypressListener) {
    document.removeEventListener('keypress', _keypressListener);
  }
}

/**
 * Code to run when the player hits restart.
 *
 * Makes sure that the proper boxes are visible.
 */
function _restart() {
  const msgBox = document.getElementById('startBox');
  msgBox.classList.remove('is-hidden');
  const endBox = document.getElementById('endBox');
  endBox.classList.add('is-hidden');
  init();
}

const ITEMS = {
  sword: { name: 'sword', type: 'weapon', damage: 5, icon: 'W' },
  spear: { name: 'spear', type: 'weapon', damage: 10, icon: 'S' },
  mace: { name: 'mace', type: 'weapon', damage: 15, icon: 'M' },
  bread: { name: 'bread', type: 'food', heal: 5, icon: 'B' },
  apple: { name: 'apple', type: 'food', heal: 10, icon: 'A' },
  potion: { name: 'potion', type: 'food', heal: 25, icon: 'P' },
};


function getCurrentRoom() {
  return GAME.map[GAME.currentRoom];
}

init();

