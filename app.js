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
const folders = [];


    // Helper Functions
    function updateCharacterSelects() {
        const characterOptions = characters.map(character => `<option value="${character}">${character}</option>`).join('');
        assignCharacterSelect.innerHTML = characterOptions;
        loadoutCharacterSelect.innerHTML = characterOptions;
        assignSkillCharacterSelect.innerHTML = characterOptions;
        characterDetailsSelect.innerHTML = characterOptions;
    }

    function updateItemSelect() {
        const itemOptions = items.map(item => `<option value="${item.name}">${item.name}</option>`).join('');
        assignItemSelect.innerHTML = itemOptions;
    }

    function updateSkillSelect() {
        const skillOptions = skills.map(skill => `<option value="${skill.name}">${skill.name}</option>`).join('');
        assignSkillSelect.innerHTML = skillOptions;
    }

    function updateInventoryDisplay(character) {
        if (!character) return;
        let inventoryHtml = '';
        inventory[character].forEach(item => {
            inventoryHtml += generateInventoryItemHtml(item);
        });

        folders.forEach(folder => {
            inventoryHtml += generateFolderHtml(folder.name, folder.items);
        });

        inventoryList.innerHTML = inventoryHtml ? `<ul>${inventoryHtml}</ul>` : 'No items';
        attachDragAndDropHandlers();
    }

    function updateSkillsDisplay(character) {
        if (!character) return;
        let skillsHtml = '';
        characterSkills[character].forEach(skill => {
            skillsHtml += `
                <li>
                    ${skill.name} - ${skill.description}
                    <button onclick="addNoteModalHandler('skills', '${skill.name}')">+</button>
                    <button onclick="readNotesModalHandler('skills', '${skill.name}')">Read Notes</button>
                </li>`;
        });
        skillsList.innerHTML = skillsHtml ? `<ul>${skillsHtml}</ul>` : 'No skills';
    }

    function updateCharacterDetails() {
        const selectedCharacter = characterDetailsSelect.value;
        updateInventoryDisplay(selectedCharacter);
        updateSkillsDisplay(selectedCharacter);
    }

    // Event Listeners
    addCharacterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const characterName = document.getElementById('character-name').value;
        if (!characters.includes(characterName)) {
            characters.push(characterName);
            inventory[characterName] = [];
            characterSkills[characterName] = [];
            updateCharacterSelects();
        }
        addCharacterForm.reset();
    });

    addItemForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const itemName = document.getElementById('item-name').value;
        const itemSlot = document.getElementById('item-slot').value.trim();
        const itemStat = document.getElementById('item-stat').value.trim();
        const itemValue = parseInt(document.getElementById('item-value').value, 10);
        const item = { name: itemName, slot: itemSlot, stat: itemStat, value: itemValue };
        if (itemSlot === '') item.slot = null;
        if (itemStat === '') item.stat = null;
        items.push(item);
        notes.items[itemName] = [];
        updateItemSelect();
        addItemForm.reset();
    });

    assignItemForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const character = assignCharacterSelect.value;
        const itemName = assignItemSelect.value;
        const item = items.find(i => i.name === itemName);
        inventory[character].push(item);
        if (characterDetailsSelect.value === character) {
            updateInventoryDisplay(character);
        }
    });

    addSkillForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const skillName = document.getElementById('skill-name').value;
        const skillDescription = document.getElementById('skill-description').value;
        const skill = { name: skillName, description: skillDescription };
        skills.push(skill);
        notes.skills[skillName] = [];
        updateSkillSelect();
        addSkillForm.reset();
    });

    assignSkillForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const character = assignSkillCharacterSelect.value;
        const skillName = assignSkillSelect.value;
        const skill = skills.find(s => s.name === skillName);
        characterSkills[character].push(skill);
        if (characterDetailsSelect.value === character) {
            updateSkillsDisplay(character);
        }
    });

    bestLoadoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const character = loadoutCharacterSelect.value;
        const stat = document.getElementById('loadout-stat').value;

        const bestItems = {};
        const bestPartyItems = {};

        // Find best item for the selected character per slot
        inventory[character].forEach(item => {
            if ((!item.slot || item.slot === '') && (!item.stat || item.stat === '')) return; // Skip items without slot and stat
            if (!bestItems[item.slot]) bestItems[item.slot] = item;
            else if (item.value > bestItems[item.slot].value) bestItems[item.slot] = item;
        });

        // Find best item in the entire party inventory per slot
        for (const char in inventory) {
            inventory[char].forEach(item => {
                if ((!item.slot || item.slot === '') && (!item.stat || item.stat === '')) return; // Skip items without slot and stat
                if (!bestPartyItems[item.slot]) bestPartyItems[item.slot] = item;
                else if (item.value > bestPartyItems[item.slot].value) bestPartyItems[item.slot] = item;
            });
        }

        let bestItemsHtml = '<h3>Best Items for ' + character + ' (' + stat + '):</h3>';
        for (const slot in bestItems) {
            bestItemsHtml += `<p>${slot}: ${bestItems[slot].name} (Value: ${bestItems[slot].value})</p>`;
        }

        let bestPartyItemsHtml = '<h3>Best Party Items for ' + character + ' (' + stat + '):</h3>';
        for (const slot in bestPartyItems) {
            bestPartyItemsHtml += `<p>${slot}: ${bestPartyItems[slot].name} (Value: ${bestPartyItems[slot].value})</p>`;
        }

        // Display the results
        bestLoadoutResult.innerHTML = bestItemsHtml + bestPartyItemsHtml;
    });

    addNoteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const noteTitle = document.getElementById('note-title').value;
        const noteContent = document.getElementById('note-content').value;
        if (!notes[currentNoteType][currentNoteItem]) {
            notes[currentNoteType][currentNoteItem] = [];
        }
        notes[currentNoteType][currentNoteItem].push({ title: noteTitle, content: noteContent });
        addNoteForm.reset();
        addNoteModal.style.display = "none";
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
    currentNoteType = type;
    currentNoteItem = item;
    addNoteModal.style.display = "block";
}

function readNotesModalHandler(type, item) {
    currentNoteType = type;
    currentNoteItem = item;
    const itemNotes = notes[type][item] || [];
    notesList.innerHTML = itemNotes.map((note, index) => `<p class="note-title" onclick="showNoteDetails(${index})">${note.title}</p>`).join('');
    noteDetails.style.display = "none";
    readNotesModal.style.display = "block";
}

function showNoteDetails(index) {
    const itemNotes = notes[currentNoteType][currentNoteItem] || [];
    const note = itemNotes[index];
    noteTitleDisplay.innerHTML = note.title;
    noteContentDisplay.innerHTML = note.content;
    noteDetails.style.display = "block";
}

function generateInventoryItemHtml(item) {
    return `
        <li class="draggable" draggable="true" data-item-name="${item.name}">
            ${item.name} (Slot: ${item.slot ? item.slot : 'No Slot'}, Stat: ${item.stat ? item.stat : 'No Stat'}, Value: ${item.value})
            <button onclick="addNoteModalHandler('items', '${item.name}')">+</button>
            <button onclick="readNotesModalHandler('items', '${item.name}')">Read Notes</button>
        </li>`;
}

function generateFolderHtml(folderName, items) {
    return `
        <li class="folder" data-folder-name="${folderName}">
            <span class="folder-toggle" onclick="toggleFolderContents('${folderName}')">${folderName}</span>
            <ul class="folder-contents collapsed">
                ${items.map(item => generateInventoryItemHtml(item)).join('')}
            </ul>
        </li>`;
}

function toggleFolderContents(folderName) {
    const folderContents = document.querySelector(`.folder[data-folder-name="${folderName}"] .folder-contents`);
    folderContents.classList.toggle('collapsed');
}

function createFolder(folderName, itemsToAdd) {
    folders.push({ name: folderName, items: itemsToAdd });
    const selectedCharacter = characterDetailsSelect.value;
    itemsToAdd.forEach(item => {
        const index = inventory[selectedCharacter].findIndex(existingItem => existingItem.name === item.name);
        if (index !== -1) {
            inventory[selectedCharacter].splice(index, 1);
        }
    });

    updateInventoryDisplay(selectedCharacter);
}


function promptForFolderName(callback) {
    const folderName = prompt("Enter a name for the new folder:");
    if (folderName) {
        callback(folderName);
    }
}

// Drag and Drop Functions
function attachDragAndDropHandlers() {
    const draggables = document.querySelectorAll('.draggable');
    const folders = document.querySelectorAll('.folder');

    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', handleDragStart);
        draggable.addEventListener('dragover', handleDragOver);
        draggable.addEventListener('drop', handleDrop);
    });

    folders.forEach(folder => {
        folder.addEventListener('dragover', handleDragOver);
        folder.addEventListener('drop', handleDropOnFolder);
    });
}

function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.getAttribute('data-item-name'));
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDrop(e) {
    e.preventDefault();
    const draggedItemName = e.dataTransfer.getData('text/plain');
    const targetItemName = e.target.getAttribute('data-item-name');
    if (draggedItemName && targetItemName) {
        const folderName = prompt("Enter a name for the new folder:");
        if (folderName) {
            const draggedItemIndex = items.findIndex(item => item.name === draggedItemName);
            if (draggedItemIndex !== -1) {
                const targetItemIndex = items.findIndex(item => item.name === targetItemName);
                if (targetItemIndex !== -1) {
                    createFolder(folderName, [items[draggedItemIndex], items[targetItemIndex]]);
                    // Remove the dragged item from the original items array
                    items.splice(draggedItemIndex, 1);
                    updateItemSelect(); // Update the select dropdown without the removed item
                }
            }
        }
    }
}

function handleDropOnFolder(e) {
    e.preventDefault();
    const draggedItemName = e.dataTransfer.getData('text/plain');
    const folderName = e.target.closest('.folder').getAttribute('data-folder-name');
    if (draggedItemName && folderName) {
        const draggedItem = items.find(item => item.name === draggedItemName);
        const folder = folders.find(folder => folder.name === folderName);
        folder.items.push(draggedItem);
        updateInventoryDisplay(characterDetailsSelect.value);
    }
}

// Example of how to create a folder
function exampleFolderCreation() {
    createFolder('Example Folder', [
        { name: 'Item 1', slot: 'Head', stat: 'Strength', value: 10 },
        { name: 'Item 2', slot: 'Body', stat: 'Defense', value: 20 }
    ]);
}