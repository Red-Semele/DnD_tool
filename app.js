// Form Elements
const addCharacterForm = document.getElementById('add-character-form');
const addItemForm = document.getElementById('add-item-form');
const assignItemForm = document.getElementById('assign-item-form');
const bestLoadoutForm = document.getElementById('best-loadout-form');
const addSkillForm = document.getElementById('add-skill-form');
const assignSkillForm = document.getElementById('assign-skill-form');
const addNoteForm = document.getElementById('add-note-form');

const assignCharacterSelect = document.getElementById('assign-character');
const assignItemSelect = document.getElementById('assign-item');
const loadoutCharacterSelect = document.getElementById('loadout-character');
const assignSkillCharacterSelect = document.getElementById('assign-skill-character');
const assignSkillSelect = document.getElementById('assign-skill');
const characterDetailsSelect = document.getElementById('character-details-select');
const inventoryList = document.getElementById('inventory-list');
const skillsList = document.getElementById('skills-list');
const bestLoadoutResult = document.getElementById('best-loadout-result');

const addNoteModal = document.getElementById('add-note-modal');
const addNoteClose = document.getElementById('add-note-close');
const readNotesModal = document.getElementById('read-notes-modal');
const readNotesClose = document.getElementById('read-notes-close');
const notesList = document.getElementById('notes-list');
const noteDetails = document.getElementById('note-details');
const noteTitleDisplay = document.getElementById('note-title-display');
const noteContentDisplay = document.getElementById('note-content-display');
const rollDiceForm = document.getElementById('roll-dice-form');
const diceRollResult = document.getElementById('dice-roll-result');
let selectedCharacter = "";

const characters = [];
const items = [];
const skills = [];
const inventory = {};
const characterSkills = {};
const notes = {
    items: {},
    skills: {}
};

let currentNoteType = '';
let currentNoteItem = '';

// Folder data structure
//const folders = [];
const characterFolders = {};


document.addEventListener('DOMContentLoaded', loadGameState);
// Helper Functions
function saveGameState() {
    const gameState = {
        characters,
        items,
        skills,
        inventory,
        characterSkills,
        notes,
        characterFolders,
        selectedCharacter
    };
    localStorage.setItem('gameState', JSON.stringify(gameState));
    console.log("Save-attempted")
    console.log(gameState)
}

function loadGameState() {
    console.log("Attempting to load game state");
    const savedState = localStorage.getItem('gameState');
    if (savedState) {
        const gameState = JSON.parse(savedState);
        
        // Helper function to deep clone an object or array
        function deepClone(source) {
            return JSON.parse(JSON.stringify(source));
        }

        // Update function to handle different types of data
        function updateData(target, source) {
            // Handle arrays
            if (Array.isArray(target)) {
                target.splice(0, target.length, ...source);
            }
            // Handle objects
            else if (typeof target === 'object' && target !== null) {
                // Clear existing keys
                Object.keys(target).forEach(key => delete target[key]);
                // Assign new keys
                Object.assign(target, source);
            }
            // Handle primitive types (do nothing)
        }

        // Loop through gameState properties and update corresponding variables
        for (let prop in gameState) {
            if (gameState.hasOwnProperty(prop)) {
                switch (prop) {
                    case 'characters':
                    case 'items':
                    case 'skills':
                    case 'inventory':
                    case 'characterSkills':
                    case 'characterFolders':
                    case 'notes':
                        updateData(eval(prop), deepClone(gameState[prop]));
                        break;
                    case 'selectedCharacter':
                        selectedCharacter = gameState[prop];
                        break;
                    default:
                        // Handle additional properties if needed
                        break;
                }
            }
        }

        // Update UI or perform additional actions as needed
        updateCharacterSelects();
        updateItemSelect();
        updateSkillSelect();
        if (selectedCharacter) {
            updateCharacterDetails();
        }

        console.log("Game state loaded successfully");
    } else {
        console.log("No saved game state found");
    }
}
function updateCharacterSelects() {
    console.log("A")
    const characterOptions = characters.map(character => `<option value="${character}">${character}</option>`).join('');
    assignCharacterSelect.innerHTML = characterOptions;
    loadoutCharacterSelect.innerHTML = characterOptions;
    assignSkillCharacterSelect.innerHTML = characterOptions;
    characterDetailsSelect.innerHTML = characterOptions;
}

function updateItemSelect() {
    const selectElement = document.getElementById('assign-item');
    selectElement.textContent = ''; // Clear existing options

    items.forEach(item => {
        const option = document.createElement('option');
        option.value = item.name;
        option.textContent = item.name;
        selectElement.appendChild(option);
    });
}

function updateSkillSelect() {
    const selectElement = document.getElementById('assign-skill');
    selectElement.textContent = ''; // Clear existing options

    skills.forEach(skill => {
        const option = document.createElement('option');
        option.value = skill.name;
        option.textContent = skill.name;
        selectElement.appendChild(option);
    });
}

function updateInventoryDisplay(character) {
    console.log("Updating inventory display for character:", character);
    if (!character) return;

    let inventoryHtml = '';

    // Display loose items belonging to the selected character
    inventory[character].forEach(item => {
        inventoryHtml += generateInventoryItemHtml(item);
    });

    // Display items from folders that belong to the selected character
    characterFolders[character].forEach(folder => {
        if (folder.type === 'items') {
            inventoryHtml += generateFolderHtml(folder.name, folder.items);
        }
    });

    // Update the inventory list with the generated HTML
    inventoryList.innerHTML = inventoryHtml ? `<ul>${inventoryHtml}</ul>` : 'No items';
    attachDragAndDropHandlers();
}

function updateSkillsDisplay(character) {
    console.log("Updating skills display for character:", character);
    if (!character) return;

    let skillsHtml = '';

    // Display loose skills belonging to the selected character
    characterSkills[character].forEach(skill => {
        skillsHtml += generateSkillItemHtml(skill);
    });

    // Display skills from folders that belong to the selected character
    characterFolders[character].forEach(folder => {
        if (folder.type === 'skills') {
            skillsHtml += generateFolderHtml(folder.name, folder.items, 'skills');
        }
    });

    // Update the skills list with the generated HTML
    skillsList.innerHTML = skillsHtml ? `<ul>${skillsHtml}</ul>` : 'No skills';
    attachDragAndDropHandlers();
}

function updateCharacterDetails() {
    console.log("F")
    const selectedCharacter = characterDetailsSelect.value;
    updateInventoryDisplay(selectedCharacter);
    updateSkillsDisplay(selectedCharacter);
}

// Event Listeners
addCharacterForm.addEventListener('submit', (e) => {
    console.log("G")
    e.preventDefault();
    const characterName = document.getElementById('character-name').value;
    if (!selectedCharacter) {
        selectedCharacter = characterName
    }
    if (!characters.includes(characterName)) {
        characters.push(characterName);
        inventory[characterName] = [];
        characterSkills[characterName] = [];
        characterFolders[characterName] = [];
        updateCharacterSelects();
    }
    addCharacterForm.reset();
    saveGameState();
});

addItemForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const itemName = document.getElementById('item-name').value;
    const itemSlot = document.getElementById('item-slot').value.trim();
    const itemStat = document.getElementById('item-stat').value.trim();
    const itemValue = document.getElementById('item-value').value.trim();
    const itemRarity = document.getElementById('item-rarity').value.trim(); // Capture rarity

    // Check for backslashes in stats and values
    const stats = itemStat.split('/');
    const values = itemValue.split('/').map(v => parseInt(v, 10));

    // Create an array of stat objects
    const statArray = stats.map((stat, index) => ({
        stat: stat.trim(),
        value: values[index] || 0
    }));

    const item = { 
        name: itemName, 
        slot: itemSlot === '' ? null : itemSlot, 
        stats: statArray, 
        rarity: itemRarity  // Include rarity in the item object
    };

    if (itemStat === '') item.stats = [];

    items.push(item);
    notes.items[itemName] = [];
    updateItemSelect();
    addItemForm.reset();
    saveGameState();
});

assignItemForm.addEventListener('submit', (e) => {
    console.log("I")
    e.preventDefault();
    const character = assignCharacterSelect.value;
    const itemName = assignItemSelect.value;
    const item = items.find(i => i.name === itemName);
    inventory[character].push(item);
    
    if (characterDetailsSelect.value === character) {
        updateInventoryDisplay(character);
    }
    saveGameState();
});

addSkillForm.addEventListener('submit', (e) => {
    console.log("J")
    e.preventDefault();
    const skillName = document.getElementById('skill-name').value;
    const skillDescription = document.getElementById('skill-description').value;
    const skill = { name: skillName, description: skillDescription, lastRoll: null};
    skills.push(skill);
    notes.skills[skillName] = [];
    updateSkillSelect();
    addSkillForm.reset();
    saveGameState();
});

assignSkillForm.addEventListener('submit', (e) => {
    console.log("K")
    e.preventDefault();
    const character = assignSkillCharacterSelect.value;
    const skillName = assignSkillSelect.value;
    const skill = skills.find(s => s.name === skillName);
    characterSkills[character].push(skill);
    if (characterDetailsSelect.value === character) {
        updateSkillsDisplay(character);
    }
    saveGameState();
});

bestLoadoutForm.addEventListener('submit', (e) => {
    console.log("L")
    e.preventDefault();
    const character = loadoutCharacterSelect.value;
    const stat = document.getElementById('loadout-stat').value;

    const bestItems = {};
    const bestPartyItems = {};

    // Function to find the best item considering items in inventory and in folders
    function findBestItem(itemsArray) {
        const bestItem = {};

        itemsArray.forEach(item => {
            if ((!item.slot || item.slot === '') && (!item.stat || item.stat === '')) return; // Skip items without slot and stat
            if (!bestItem[item.slot]) bestItem[item.slot] = item;
            else if (item.value > bestItem[item.slot].value) bestItem[item.slot] = item;
        });

        return bestItem;
    }

    // Include items from inventory and folders for the selected character
    const allItems = [...inventory[character]];
    characterFolders[selectedCharacter].filter(folder => folder.type === 'items').forEach(folder => {
        allItems.push(...folder.items);
    });

    // Find best item for the selected character per slot
    bestItems = findBestItem(allItems);

    // Find best item in the entire party inventory per slot
    for (const char in inventory) {
        inventory[char].forEach(item => {
            if ((!item.slot || item.slot === '') && (!item.stat || item.stat === '')) return; // Skip items without slot and stat
            if (!bestPartyItems[item.slot]) bestPartyItems[item.slot] = item;
            else if (item.value > bestPartyItems[item.slot].value) bestPartyItems[item.slot] = item;
        });

        // Also include items from characterFolders[selectedCharacter] of other characters in the party
        if (char !== character) {
            characterFolders[selectedCharacter].filter(folder => folder.type === 'items').forEach(folder => {
                bestPartyItems[folder.name] = findBestItem(folder.items)[folder.name];
            });
        }
    }

    let bestItemsHtml = '<h3>Best Items for ' + character + ' (' + stat + '):</h3>';
    for (const slot in bestItems) {
        bestItemsHtml += `<p>${slot}: ${bestItems[slot].name} (Value: ${bestItems[slot].value})</p>`;
    }

    let bestPartyItemsHtml = '<h3>Best Party Items for ' + character + ' (' + stat + '):</h3>';
    for (const slot in bestPartyItems) {
        if (bestPartyItems[slot]) {
            bestPartyItemsHtml += `<p>${slot}: ${bestPartyItems[slot].name} (Value: ${bestPartyItems[slot].value})</p>`;
        }
    }

    // Display the results
    bestLoadoutResult.innerHTML = bestItemsHtml + bestPartyItemsHtml;
});

addNoteForm.addEventListener('submit', (e) => {
    console.log("M")
    e.preventDefault();
    const noteTitle = document.getElementById('note-title').value;
    const noteContent = document.getElementById('note-content').value;
    
    // Ensure currentNoteType and currentNoteItem are set correctly
    if (currentNoteType && currentNoteItem) {
        if (!notes[currentNoteType][currentNoteItem]) {
            notes[currentNoteType][currentNoteItem] = [];
        }
        notes[currentNoteType][currentNoteItem].push({ title: noteTitle, content: noteContent });
        
        // Update UI to reflect the newly added note
        if (currentNoteType === 'items') {
            updateInventoryDisplay(characterDetailsSelect.value);
        } else if (currentNoteType === 'skills') {
            updateSkillsDisplay(characterDetailsSelect.value);
        }
        
        // Reset the form and hide the modal
        addNoteForm.reset();
        saveGameState();
        addNoteModal.style.display = "none";
    } else {
        console.error('Error adding note: Current note type or item not set.');
    }
});

addNoteClose.onclick = () => {
    addNoteModal.style.display = "none";
}

readNotesClose.onclick = () => {
    readNotesModal.style.display = "none";
}

window.onclick = (event) => {
    if (event.target == addNoteModal) {
        addNoteModal.style.display = "none";
    }
    if (event.target == readNotesModal) {
        readNotesModal.style.display = "none";
    }
}

characterDetailsSelect.addEventListener('change', updateCharacterDetails);

function addNoteModalHandler(type, item) {
    console.log('Adding note modal handler called.');
    currentNoteType = type;
    currentNoteItem = item;
    console.log('Current note type:', currentNoteType);
    console.log('Current note item:', currentNoteItem);
    addNoteModal.style.display = "block";
    saveGameState();
    
}

function readNotesModalHandler(type, item) {
    console.log('Reading notes modal handler called.');
    currentNoteType = type;
    currentNoteItem = item;
    console.log('Current note type:', currentNoteType);
    console.log('Current note item:', currentNoteItem);
    const itemNotes = notes[type][item] || [];
    
    // Prepare HTML for displaying notes
    notesList.innerHTML = itemNotes.map((note, index) => `<p class="note-title" onclick="showNoteDetails(${index})">${note.title}</p>`).join('');
    
    // Show the read notes modal
    noteDetails.style.display = "none"; // Ensure details are initially hidden
    readNotesModal.style.display = "block";
}

function showNoteDetails(index) {
    console.log("M")
    const itemNotes = notes[currentNoteType][currentNoteItem] || [];
    const note = itemNotes[index];
    noteTitleDisplay.innerHTML = note.title;
    noteContentDisplay.innerHTML = note.content;
    noteDetails.style.display = "block";
}

function generateInventoryItemHtml(item) {
    console.log("N");
    console.log(item.stats)
    console.log(Array.isArray(item.stats)); // Verify if it's an array
    const statHtml = item.stats.map(s => `${s.stat}: ${s.value}`).join(', ');
    return `
         <li class="draggable" draggable="true" data-item-name="${item.name}">
            ${item.name.replace("'", "\\'")} (Slot: ${item.slot ? item.slot : 'No Slot'}, Stats: ${statHtml}, Rarity: ${item.rarity})
            <button onclick="addNoteModalHandler('items', '${item.name.replace("'", "\\'")}')">+</button>
            <button onclick="readNotesModalHandler('items', '${item.name.replace("'", "\\'")}')">Read Notes</button>
        </li>`;
}

function generateSkillItemHtml(skill) {
    console.log("skill" + skill)
    return `
        <li class="draggable-skill" draggable="true" data-skill-name="${skill.name}">
            ${skill.name} - ${skill.description}
            <button onclick="console.log('Clicked + button for skill:', '${skill.name.replace("'", "\\'")}'); addNoteModalHandler('skills', '${skill.name.replace("'", "\\'")}')">+</button>
            <button onclick="console.log('Clicked Read Notes button for skill:', '${skill.name.replace("'", "\\'")}'); readNotesModalHandler('skills', '${skill.name.replace("'", "\\'")}')">Read Notes</button>
            <button id="add-roll-${skill.name.replace("'", "\\'")}" onclick="console.log('Clicked Add Roll button for skill:', '${skill.name.replace("'", "\\'")}'); addRoll('${skill.name.replace("'", "\\'")}')">Add Roll</button>
            <button id="perform-${skill.name.replace("'", "\\'")}" style="display:none;" onclick="console.log(this.id + 'Clicked Perform button for skill:', '${skill.name.replace("'", "\\'")}'); performRoll('${skill.name.replace("'", "\\'")}', '${skill.lastRoll}')">Perform</button>
            <button id="edit-${skill.name.replace("'", "\\'")}" style="display:none;" onclick="editRoll('${skill.name.replace("'", "\\'")}')">Edit Roll</button>
            <button onclick="readNotesModalHandler('skills', '${skill.name.replace("'", "\\'")}')">Read Notes</button>
        </li>`;
}

function generateFolderHtml(folderName, items, type = 'items') {
    console.log("O")
    return `
        <li class="folder" data-folder-name="${folderName}" data-folder-type="${type}" data-character="${selectedCharacter}">
            <span class="folder-toggle" onclick="toggleFolderContents('${folderName}', '${type}')">${folderName}</span>
            <ul class="folder-contents collapsed">
                ${items.map(item => type === 'items' ? generateInventoryItemHtml(item) : generateSkillItemHtml(item)).join('')}
            </ul>
        </li>`;
}

function toggleFolderContents(folderName, type) {
    const selectedCharacter = characterDetailsSelect.value;
    const folderContents = document.querySelector(`.folder[data-folder-name="${folderName}"][data-folder-type="${type}"] .folder-contents`);
    folderContents.classList.toggle('collapsed');
}

function createFolder(folderName, itemsToAdd, type) {
    const selectedCharacter = characterDetailsSelect.value;
    if (!characterFolders[selectedCharacter]) {
        characterFolders[selectedCharacter] = [];
    }
    characterFolders[selectedCharacter].push({ name: folderName, items: itemsToAdd, type });

    itemsToAdd.forEach(item => {
        if (type === 'items') {
            const index = inventory[selectedCharacter].findIndex(existingItem => existingItem.name === item.name);
            if (index !== -1) {
                inventory[selectedCharacter].splice(index, 1);
            }
        } else if (type === 'skills') {
            const index = characterSkills[selectedCharacter].findIndex(existingSkill => existingSkill.name === item.name);
            if (index !== -1) {
                characterSkills[selectedCharacter].splice(index, 1);
            }
        }
    });

    if (type === 'items') {
        updateInventoryDisplay(selectedCharacter);
    } else if (type === 'skills') {
        updateSkillsDisplay(selectedCharacter);
    }
}

function promptForFolderName(callback) {
    console.log("S")
    const folderName = prompt("Enter a name for the new folder:");
    if (folderName) {
        callback(folderName);
    }
}

// Drag and Drop Functions
function attachDragAndDropHandlers() {
    console.log("T")
    const draggables = document.querySelectorAll('.draggable');
    const skillDraggables = document.querySelectorAll('.draggable-skill');
    const folders = document.querySelectorAll('.folder');

    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', handleDragStart);
        draggable.addEventListener('dragover', handleDragOver);
        draggable.addEventListener('drop', handleDrop);
    });

    skillDraggables.forEach(draggable => {
        draggable.addEventListener('dragstart', handleDragStartSkill);
        draggable.addEventListener('dragover', handleDragOver);
        draggable.addEventListener('drop', handleDropSkill);
    });

    folders.forEach(folder => {
        folder.addEventListener('dragover', handleDragOver);
        folder.addEventListener('drop', handleDropOnFolder);
    });
}

function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.getAttribute('data-item-name'));
}

function handleDragStartSkill(e) {
    e.dataTransfer.setData('text/plain', e.target.getAttribute('data-skill-name'));
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDrop(e) {
    e.preventDefault();
    const draggedItemName = e.dataTransfer.getData('text/plain');
    const targetItemName = e.target.getAttribute('data-item-name');
    if (draggedItemName && targetItemName) {
        promptForFolderName(folderName => {
            const draggedItemIndex = items.findIndex(item => item.name === draggedItemName);
            if (draggedItemIndex !== -1) {
                const targetItemIndex = items.findIndex(item => item.name === targetItemName);
                if (targetItemIndex !== -1) {
                    createFolder(folderName, [items[draggedItemIndex], items[targetItemIndex]], 'items');
                    // Remove the dragged item from the original items array
                    items.splice(draggedItemIndex, 1);
                    updateItemSelect(); // Update the select dropdown without the removed item
                }
            }
        });
    }
}

function handleDropSkill(e) {
    e.preventDefault();
    const draggedSkillName = e.dataTransfer.getData('text/plain');
    const targetSkillName = e.target.getAttribute('data-skill-name');
    if (draggedSkillName && targetSkillName) {
        promptForFolderName(folderName => {
            const draggedSkillIndex = skills.findIndex(skill => skill.name === draggedSkillName);
            if (draggedSkillIndex !== -1) {
                const targetSkillIndex = skills.findIndex(skill => skill.name === targetSkillName);
                if (targetSkillIndex !== -1) {
                    createFolder(folderName, [skills[draggedSkillIndex], skills[targetSkillIndex]], 'skills');
                    // Remove the dragged skill from the original skills array
                    skills.splice(draggedSkillIndex, 1);
                    updateSkillSelect(); // Update the select dropdown without the removed skill
                }
            }
        });
    }
}

function handleDropOnFolder(e) {
    e.preventDefault();
    const draggedItemName = e.dataTransfer.getData('text/plain');
    const folderName = e.target.closest('.folder').getAttribute('data-folder-name');
    const folderType = e.target.closest('.folder').getAttribute('data-folder-type');
    if (draggedItemName && folderName) {
        if (folderType === 'items') {
            const draggedItem = items.find(item => item.name === draggedItemName);
            const folder = characterFolders[selectedCharacter].find(folder => folder.name === folderName && folder.type === 'items');
            folder.items.push(draggedItem);
            updateInventoryDisplay(characterDetailsSelect.value);
        } else if (folderType === 'skills') {
            const draggedSkill = skills.find(skill => skill.name === draggedItemName);
            const folder = folders.find(folder => folder.name === folderName && folder.type === 'skills');
            folder.items.push(draggedSkill);
            updateSkillsDisplay(characterDetailsSelect.value);
        }
    }
}

rollDiceForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const diceInput = document.getElementById('dice-input').value.trim();

    // Revised regex to match dice notation allowing for spaces
    const diceRegex = /^(\d+)d(\d+)(\s*([\+\-\*\/])\s*(\d+))?$/;
    const match = diceInput.match(diceRegex);

    if (match) {
        const numDice = parseInt(match[1]);
        const diceType = parseInt(match[2]);
        let modifierType = match[4]; // Operator (+, -, *, /)
        let modifierValue = match[5] ? parseInt(match[5].trim()) : 0; // Modifier value

        // Roll the dice
        let diceRolls = [];
        let total = 0; // Initialize total to 0
        for (let i = 0; i < numDice; i++) {
            const roll = Math.floor(Math.random() * diceType) + 1;
            diceRolls.push(roll);
            total += roll;
        }

        // Prepare the result message without modifier
        let resultMessage = `Rolled ${numDice}d${diceType} and got ${total} (${diceRolls.join(', ')})`;
        
        // Update UI with result without modifier
        diceRollResult.textContent = resultMessage;

        // If modifier exists, apply it
        if (modifierType) {
            switch (modifierType) {
                case '+':
                    total += modifierValue;
                    break;
                case '-':
                    total -= modifierValue;
                    break;
                case '*':
                    total *= modifierValue;
                    break;
                case '/':
                    if (modifierValue !== 0) {
                        total = Math.floor(total / modifierValue);
                    } else {
                        diceRollResult.textContent = 'Invalid dice notation. Division by zero.';
                        return;
                    }
                    break;
                default:
                    break;
            }

            // Prepare the result message with modifier
            resultMessage += ` (${modifierType}${modifierValue}) => Total: ${total}`;
            
            // Update UI with result including modifier
            diceRollResult.textContent = resultMessage;
            
        }
    } else {
        diceRollResult.textContent = 'Invalid dice notation. Please use format like "2d6 + 6".';
    }
});

function addRoll(skillName) {
    const diceNotation = prompt("Enter dice notation (e.g., 2d6 + 5):");
    if (diceNotation) {
        const skill = skills.find(s => s.name === skillName);
        skill.lastRoll = diceNotation;
        console.log(skills)
        console.log(skillName)
        console.log(skill.lastRoll)
        const escapedSkillName = skillName.replace("'", "\\'");
        console.log(escapedSkillName)
        document.getElementById(`perform-${escapedSkillName}`).style.display = "inline-block";
        // Set the display style for the edit button
        document.getElementById(`edit-${escapedSkillName}`).style.display = "inline-block";
        document.getElementById(`add-roll-${escapedSkillName}`).style.display = "none";
        console.log(`Dice notation added to ${skillName}: ${diceNotation}`);
        saveGameState();
    }
}

function editRoll(skillName) {
    const diceNotation = prompt("Enter new dice notation (e.g., 1d20 + 3):");
    if (diceNotation) {
        const skill = skills.find(s => s.name === skillName);
        skill.lastRoll = diceNotation;
        console.log(`Dice notation edited for ${skillName}: ${diceNotation}`);
        saveGameState();
    }
}

function performRoll(skillName) {
    const skill = skills.find(skill => skill.name === skillName);
    const diceNotation = skill.lastRoll;
    console.log(diceNotation);
    console.log(diceNotation)
    const match = diceNotation.match(/^(\d+)d(\d+)(\s*([\+\-\*\/])\s*(\d+))?$/);
    if (match) {
        const numDice = parseInt(match[1]);
        const diceType = parseInt(match[2]);
        let modifierType = match[4];
        let modifierValue = match[5] ? parseInt(match[5].trim()) : 0;

        // Perform the roll (using existing roll dice function)
        let total = rollDice(numDice, diceType, modifierType, modifierValue);

        // Display the result
        alert(`Performed ${numDice}d${diceType}${modifierType ? ` ${modifierType} ${modifierValue}` : ''} for ${skillName}. Result: ${total}`);
    } else {
        console.error('Invalid dice notation:', diceNotation);
    }
}

function rollDice(numDice, diceType, modifierType, modifierValue) {
    let total = 0;
    for (let i = 0; i < numDice; i++) {
        const roll = Math.floor(Math.random() * diceType) + 1;
        total += roll;
    }
    if (modifierType) {
        switch (modifierType) {
            case '+':
                total += modifierValue;
                break;
            case '-':
                total -= modifierValue;
                break;
            case '*':
                total *= modifierValue;
                break;
            case '/':
                if (modifierValue !== 0) {
                    total = Math.floor(total / modifierValue);
                } else {
                    console.error('Invalid dice notation: Division by zero.');
                }
                break;
            default:
                break;
        }
    }
    return total;
}

document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('.sidebar a');
    const sections = document.querySelectorAll('.section');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');

            sections.forEach(section => {
                section.style.display = 'none';
            });

            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.style.display = 'block';
            }
        });
    });

    // Show the first section by default
    if (sections.length > 0) {
        sections[0].style.display = 'block';
    }
});