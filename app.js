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
const achievementsList = document.getElementById('achievement-list');
const titlesList = document.getElementById('title-list');
const statsList = document.getElementById('stat-list');
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


const addTitleForm = document.getElementById('add-title-form');
const assignTitleForm = document.getElementById('assign-title-form');
const assignTitleCharacterSelect = document.getElementById('assign-title-character');
const assignTitleSelect = document.getElementById('assign-title');

const addAchievementForm = document.getElementById('add-achievement-form');
const assignAchievementForm = document.getElementById('assign-achievement-form');
const assignAchievementCharacterSelect = document.getElementById('assign-achievement-character');
const assignAchievementSelect = document.getElementById('assign-achievement');
const addFolderButton = document.getElementById('add-folder-button');
const addFolderModal = document.getElementById('add-folder-modal');
const addFolderClose = document.getElementById('add-folder-close');
const addFolderForm = document.getElementById('add-folder-form');
const foldersList = document.getElementById('folders-list');
const statGraphSelect = document.getElementById('statGraphSelect');
const characterGraphSelect = document.getElementById('characterGraphSelect');
const modeGraphSelect = document.getElementById('modeGraphSelect');
const customFolders = [];
const headers = document.querySelectorAll(".toggle-header");
let savedState = localStorage.getItem('gameState');
let gameState = ""
let saves = ""
let saveFiles = {};
let currentSaveFile = ""
let savedSaves = localStorage.getItem('saves');

const titles = []; // Array to store titles
const achievements = []; // Array to store achievements
const characterTitles = {}; // Object to map characters to their titles
const characterAchievements = {}; // Object to map characters to their achievements
const characters = [];
const stats = [];
const characterStats = {};
const items = [];
const skills = [];
const inventory = {};
const characterSkills = {};
const itemNotes = [];
let note = '';
const notes = {
    items: {},
    skills: {},
    titles: {}, // Object to store notes for titles
    achievements: {}, // Object to store notes for achievements
    custom: {}
};

let currentNoteType = '';
let currentNoteItem = '';
let currentNoteId = '';
let lowest = ""
let highest = ""
let sortedRolls = ""
const customDice = {
    c: [1, 1, 1, 6, 6, 6],
    ca: [0,0]
    // You can add more custom dice here
    // example: 'anotherdice': [value1, value2, ..., valueN]
};

// Folder data structure
//const folders = [];
const characterFolders = {};
document.getElementById('title-list').style.display = "none";
document.getElementById('achievement-list').style.display = "none";
document.getElementById('inventory-list').style.display = "none";
document.getElementById('skills-list').style.display = "none";
document.getElementById('variableChecker').style.display = "none"
document.getElementById('add-stat-button').addEventListener('click', addStatHandler);
document.addEventListener('DOMContentLoaded', loadGameState);
const ctx = document.getElementById('myChart');
// Initial data
const initialData = {
    labels: [],
    datasets: [{
      label: 'My First Dataset', //TODO: Give this a different name, prefarbly something dynamically changeable.
      data: [],
      backgroundColor: [],
      hoverOffset: 4
    }]

  }

const colors = [
'rgb(75, 192, 192)',
'rgb(153, 102, 255)',
'rgb(255, 159, 64)',
'rgb(255, 99, 132)',
'rgb(54, 162, 235)',
'rgb(255, 205, 86)'
];
// Helper Functions
function saveGameState() {
    const gameState = {
        characters,
        items,
        skills,
        inventory,
        characterSkills,
        titles, 
        characterTitles,
        achievements,
        characterAchievements,
        stats, 
        characterStats,
        currentNoteType,
        currentNoteItem,
        currentNoteId,
        notes,
        itemNotes,
        characterFolders,
        selectedCharacter, 
        customFolders,
    };
    console.dir(notes, { depth: null });
    localStorage.setItem('gameState', JSON.stringify(gameState));
    localStorage.setItem('saves', JSON.stringify(saveFiles));
    console.log("Save-attempted")
    console.log(gameState)
    console.log("Saving notes:", JSON.stringify(notes, null, 2));

    console.dir(notes, { depth: null });
    logAllNotes()
}
//Strange occurence with game where adding a character like Ernhart back in the previously saved stuff came back, probaly due to the saveFiles?
function loadGameState(importStyle) {
    console.log("Loaded save " + JSON.stringify(saveFiles) + "BRENT" + savedState + "BART" + savedSaves)
    if (importStyle !== 'imported') {
        savedState = localStorage.getItem('gameState');
        savedSaves = localStorage.getItem('saves');
        console.log("LOADED, savedstate altered " + savedSaves)
    }
    
    logAllNotes();
    
     if (savedSaves) {
        try {
            saveFiles = JSON.parse(savedSaves); // Correctly parse and assign to saveFiles 
        } catch (e) {
            console.error("Error parsing savedSaves:", e);
            saveFiles = {}; // Initialize as empty object if parsing fails
        }
        console.log("BRENTISSIMO 1 " + JSON.stringify(savedSaves))
        console.log("AGAMEMNON" + JSON.stringify(saveFiles))
        for (let prop in saves) {
            console.log("PROP DETECTED!")
            if (saves.hasOwnProperty(prop)) {
                switch (prop) {
                    case 'saveFiles':
                        updateData(eval(prop), deepClone(saves[prop]));
                        break;
                    
                    
                    case 'currentSaveFile':
                        currentSaveFile = gameState[prop];
                        break;
                    default:
                        // Handle additional properties if needed
                        break;
                }
            }
        }
        console.log("BRENTISSIMO " + JSON.stringify(saveFiles))
        console.log("Loaded save files:", JSON.stringify(saveFiles, null, 2));
        updateSaveFileDropdown();
    }
    
    if (savedState) {
        gameState = JSON.parse(savedState);
        console.log("Loaded save" + gameState)
        
        // Helper function to deep clone an object or array
        function deepClone(source) {
            return JSON.parse(JSON.stringify(source));
        }

        // Update function to handle different types of data
        function updateData(target, source) {
            // Handle arrays
            if (Array.isArray(target)) {
                target.length = 0;  // Clear the existing array
                target.push(...source);  // Push new elements
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
                    case 'achievements':
                    case 'characterAchievements':
                    case 'characterTitles':
                    case 'titles':
                    case 'stats':
                    case 'characterStats':
                    case 'notes':
                    case 'itemNotes':
                    case 'customFolders':
                        updateData(eval(prop), deepClone(gameState[prop]));
                        break;
                    
                    case 'selectedCharacter':
                        selectedCharacter = gameState[prop];
                        break;
                    case 'currentNoteType':
                        currentNoteType = gameState[prop];
                        break;
                    case 'currentNoteItem':
                        currentNoteItem = gameState[prop];
                        break;
                    case 'currentNoteId':
                        currentNoteId = gameState[prop];
                        break;
                    default:
                        // Handle additional properties if needed
                        break;
                }
            }
        }

        console.dir(notes, { depth: null });
        // Update UI or perform additional actions as needed
        updateCharacterSelects();
        updateItemSelect();
        updateSkillSelect();
        updateAchievementSelect();
        updateTitleSelect();
        updateFoldersDisplay();
        if (selectedCharacter) {
            updateCharacterDetails();
        }
        

        console.log("Game state loaded successfully");
        if (itemNotes.length === 0) {
            console.log("itemNotes got RESET here upon reload." + JSON.stringify(notes));
        } else {
            console.log("Stuff" + currentNoteType + currentNoteItem + currentNoteId) //TODO: In this case both currentnotetype, item and id are empty, fix this somehow
            console.log("no reset" + JSON.stringify(itemNotes) + JSON.stringify(notes[currentNoteType][currentNoteItem][currentNoteId]) )
        }
    } else {
        console.log("No saved game state found");
    }
     

    console.log("Loading notes:", JSON.stringify(characterSkills));
    console.log("Loaded save 2" + JSON.stringify(saveFiles))

}
//TODO: Make it so that you don't need to reload the game to clear everything.
//TODO: Make it so that removing gameState doesn't remove the saveFiles, keep them stored somewhere else.
function eraseGameState() {
    console.log("Erasing saved game state");
    localStorage.removeItem('gameState');
    console.log("Saved game state erased successfully");
    loadGameState()
}
function eraseSaveState() {
    //TODO: For some reason this doesn't seem to erase the saves anymore. Find out why. It does remove newly added saves, if you press "add save" and then immediately erase saves that particular save will be gone.
    console.log("Erasing saved game state");
    localStorage.removeItem('saves');
    savedSaves = ""
    saves = ""
    // Clear the saveFiles object in memory
    saveFiles = {};
    currentSaveFile = null; 
    console.log("Saves erased successfully");
    updateSaveFileDropdown(); // Clear the dropdown menu
    loadGameState('imported')
}

// Event listener for opening the add folder modal
addFolderButton.addEventListener('click', () => {
    addFolderModal.style.display = 'block';
});

// Event listener for closing the add folder modal
addFolderClose.onclick = () => {
    addFolderModal.style.display = 'none';
};

// Event listener for adding a new folder
addFolderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const folderName = document.getElementById('folder-name').value;
    const folderDescription = document.getElementById('folder-description').value;
    const newFolder = { name: folderName, description: folderDescription, items: [] };
    notes.custom[folderName] = []
    customFolders.push(newFolder);
    updateFoldersDisplay();
    addFolderForm.reset();
    addFolderModal.style.display = 'none';
    saveGameState();
});

function updateFoldersDisplay() {
    foldersList.innerHTML = customFolders.map(folder => {
        //TODO: Change the skill stuff into item stuff)
        let itemsHTML = folder.items.map(item => `
            <li>${item.name} - ${item.description}
            <button onclick="console.log('Clicked + button for custom folder:', '${item.name.replace("'", "\\'")}'); addNoteModalHandler('custom', '${item.name.replace("'", "\\'")}', '${item.id}')">+</button>
            <button onclick="console.log('Clicked Read Notes button for custom folder:', '${item.name.replace("'", "\\'")}'); readNotesModalHandler('custom', '${item.name.replace("'", "\\'")}', '${item.id}')">Read Notes</button>
            
            </li>
        `).join('');

        // Determine initial visibility state based on folder's property

        return `
            <li>
                <span class="folder-toggle" onclick="toggleFolderContents('${folder.name}', 'custom')">
                    ${folder.name} - ${folder.description}
                </span>
                <ul class="folder-items collapsed" id="${folder.name}-items">
                    ${itemsHTML}
                </ul>
                <button onclick="addFolderItemHandler('${folder.name.replace("'", "\\'")}')">+</button>
            </li>
        `;
    }).join('');
}

// Function to handle adding an item to a folder
function addFolderItemHandler(folderName) {
    const customFolder = customFolders.find(f => f.name === folderName);
    const itemName = prompt('Enter note name:');
    const itemDescription = prompt('Enter note description:');
    if (itemName && itemDescription) {
        customFolder.items.push({ name: itemName, description: itemDescription, id: folderName });
        console.log(JSON.stringify(customFolder) + "CustomFolder" + JSON.stringify(customFolders))
        notes.custom[itemName] = []
        updateFoldersDisplay();
        saveGameState();
    }
}
function updateCharacterSelects() {
    console.log("A")
    const characterOptions = characters.map(character => `<option value="${character}">${character}</option>`).join('');
    assignCharacterSelect.innerHTML = characterOptions;
    loadoutCharacterSelect.innerHTML = characterOptions;
    assignSkillCharacterSelect.innerHTML = characterOptions;
    characterDetailsSelect.innerHTML = characterOptions;
    assignAchievementCharacterSelect.innerHTML = characterOptions;
    assignTitleCharacterSelect.innerHTML = characterOptions;
    updateCharacterStatsSelect();
    console.log(assignAchievementCharacterSelect)
    console.log(assignTitleCharacterSelect)

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
    console.log("AttachingDragAndDropHandlers2")
    //attachDragAndDropHandlers(); TODO: Removing this fixed the issue of having three popups for itemnamingprompts.
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
    console.log("AttachingDragAndDropHandlers1")
    
}

function updateCharacterDetails() {
    console.log("F")
    console.log("Change detected")
    selectedCharacter = characterDetailsSelect.value;
    updateInventoryDisplay(selectedCharacter);
    updateSkillsDisplay(selectedCharacter);
    updateTitlesDisplay(selectedCharacter) 
    updateAchievementsDisplay(selectedCharacter)
    updateCharacterStatsDisplay(selectedCharacter);
    attachDragAndDropHandlers();
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
        characterAchievements[characterName] = [];
        characterTitles[characterName] = [];
        initializeCharacterStats(characterName)
        updateCharacterStatsSelect();
        updateCharacterSelects();
    }
    addCharacterForm.reset();
    saveGameState();
});

addItemForm.addEventListener('submit', (e) => {
    console.log("YES")
    e.preventDefault();
    const itemName = document.getElementById('item-name').value;
    const itemSlot = document.getElementById('item-slot').value.trim();
    const itemStat = document.getElementById('item-stat').value.trim();
    const itemValue = document.getElementById('item-value').value.trim();
    const itemRarity = document.getElementById('item-rarity').value.trim(); // Capture rarity
    let itemQuantity = 1;
    let itemId = 0

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
        id: itemId,
        slot: itemSlot === '' ? null : itemSlot, 
        stats: statArray, 
        rarity: itemRarity,  // Include rarity in the item object
        quantity: itemQuantity
        
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
    //TODO: If there is already an item with a certain name in the person's inventory add a number id to the item that will be added so the game does not get confused.
    const character = assignCharacterSelect.value;
    const itemName = assignItemSelect.value;
    const removeItem = document.getElementById('remove-item-checkbox').checked;
    let item = items.find(i => i.name === itemName);
    // Check if there are items with the same name in the character's inventory
    const sameNameItems = inventory[character].filter(i => i.name === itemName);
    let itemsToAssignId = items.filter(i => i.name === itemName && i.id === 0);
    
    // Determine the new item's ID
    let newId;
    if (sameNameItems.length > 0) {
        // Find the highest ID among the same-name items
        const maxId = Math.max(...sameNameItems.map(i => parseInt(i.id.split('_')[0])));
        newId = maxId + 1;
        console.log(maxId + "MAX")
        console.log(sameNameItems)
        console.log("COPPY ADDED")
    } else {
        // This is the first item with this name
        newId = 1;
    }
    // Assign the new ID to the item TODO: This should only update the item.id that is zero but it just works once and then stops. 
    itemsToAssignId.forEach((item, index) => {
        let clonedItem = {...item}; // Shallow clone
        
        // Update the cloned item's ID
        clonedItem.id = `${newId + index}_${character}`;
        
        // Push the cloned item with updated ID to inventory
        inventory[character].push(clonedItem);
    });
    console.log("Id " + item.id)
    if (removeItem) {
        removefromSelect(item, "items");
    }
    notes.items[itemName][newId] = []; //TODO: Check if this works
    //inventory[character].push(item);
    
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
    let skillId = ``;
    const skill = { name: skillName, id: skillId, description: skillDescription, lastRoll: null};
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
    const removeSkill = document.getElementById('remove-skill-checkbox').checked;
    const skillId = `${character}`;
    skill.id = skillId; // Assign the generated ID to the skill
    console.log(skill.id + "SkillId")
    //notes.skills[skillName][skillId] = [];
    characterSkills[character].push(skill);
    if (removeSkill) {
        removefromSelect(skill, "skills");
    }
    if (characterDetailsSelect.value === character) {
        updateSkillsDisplay(character) //TODO: Keep checking if this acts like it should.
    }
    saveGameState();
});

function updateTitleSelect() {
    const selectElement = document.getElementById('assign-title');
    selectElement.textContent = ''; // Clear existing options

    titles.forEach(title => {
        const option = document.createElement('option');
        option.value = title.name;
        option.textContent = title.name;
        selectElement.appendChild(option);
    });
}

function updateAchievementSelect() {
    const selectElement = document.getElementById('assign-achievement');
    selectElement.textContent = ''; // Clear existing options

    achievements.forEach(achievement => {
        const option = document.createElement('option');
        option.value = achievement.name;
        option.textContent = achievement.name;
        console.log(achievement.name + "Achievo")
        selectElement.appendChild(option);

        
    });
}

addTitleForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const titleName = document.getElementById('title-name').value;
    const titleDescription = document.getElementById('title-description').value;
    let titleId = "";
    const title = { name: titleName, description: titleDescription, id: titleId};
    // Add validation if necessary
    titles.push(title);
    console.log(titles)
    notes.titles[titleName] = [];
    updateTitleSelect();
    addTitleForm.reset();
    saveGameState();
});



assignTitleForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const character = assignTitleCharacterSelect.value;
    const titleName = assignTitleSelect.value;
    const title = titles.find(t => t.name === titleName);
    const removeTitle = document.getElementById('remove-title-checkbox').checked;
    const titleId = `${character}`;
    title.id = titleId; // Assign the generated ID to the skill
    characterTitles[character].push(title);
    if (removeTitle) {
        removefromSelect(title, "titles");
    }
    saveGameState();
    if (characterDetailsSelect.value === character) {
        updateTitlesDisplay(character);
    }
});


console.log (addAchievementForm + "Achievement")
addAchievementForm.addEventListener('submit', (e) => {
    console.log("EE")
    e.preventDefault();
    const achievementName = document.getElementById('achievement-name').value;
    const achievementDescription = document.getElementById('achievement-description').value;
    let achievementId = "";
    const achievement = { name: achievementName, description: achievementDescription, id: achievementId};
    
    // Add validation if necessary
    achievements.push(achievement);
    // Add validation if necessary
    notes.achievements[achievementName] = [];
    updateAchievementSelect();
    addAchievementForm.reset();
    saveGameState();
    
});



assignAchievementForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const character = assignAchievementCharacterSelect.value;
    const achievementName = assignAchievementSelect.value;
    const achievement = achievements.find(a => a.name === achievementName);
    const removeAchievement = document.getElementById('remove-achievement-checkbox').checked;
    const achievementId = `${character}`;
    achievement.id = achievementId; // Assign the generated ID to the skill
    characterAchievements[character].push(achievement);
    if (removeAchievement) {
        removefromSelect(achievement, "achievements");
    }
    saveGameState();
    if (characterDetailsSelect.value === character) {
        updateAchievementsDisplay(character);
    }
});

function updateTitlesDisplay(character) {
    if (!character) return;

    let titlesHtml = '';

    characterTitles[character].forEach(title => {
        titlesHtml += generateTitleItemHtml(title);
    });
    console.log(titlesHtml + "Titleshtml")
    characterFolders[character].forEach(folder => {
        if (folder.type === 'titles') {
            titlesHtml += generateFolderHtml(folder.name, folder.items, 'titles');
        }
    });

    // Update the titles list with the generated HTML
    titlesList.innerHTML = titlesHtml ? `<ul>${titlesHtml}</ul>` : 'No titles';
}

function updateAchievementsDisplay(character) {
    if (!character) return;

    let achievementsHtml = '';

    characterAchievements[character].forEach(achievement => {
        achievementsHtml += generateAchievementItemHtml(achievement);
    });

    characterFolders[character].forEach(folder => {
        if (folder.type === 'achievements') {
            achievementsHtml += generateFolderHtml(folder.name, folder.items, 'achievements');
        }
    });

    // Update the achievements list with the generated HTML
    achievementsList.innerHTML = achievementsHtml ? `<ul>${achievementsHtml}</ul>` : 'No achievements';
}

// Function to generate the HTML for a single title item
function generateTitleItemHtml(title) {
    // Example HTML structure for a title item
    //TODO: Fully convert the below stuff to titles instead of skills.
    return `
        <li class="draggable-title" draggable="true" data-title-name="${title.name}">
            ${title.name} - ${title.description}
            <button onclick="console.log('Clicked + button for skill:', '${title.name.replace("'", "\\'")}'); addNoteModalHandler('titles', '${title.name.replace("'", "\\'")}', '${title.id}')">+</button>
            <button onclick="console.log('Clicked Read Notes button for skill:', '${title.name.replace("'", "\\'")}'); readNotesModalHandler('titles', '${title.name.replace("'", "\\'")}', '${title.id}')">Read Notes</button>
        </li>`;
}

// Function to generate the HTML for a single achievement item
function generateAchievementItemHtml(achievement) {
    console.log(achievement)
    // Example HTML structure for an achievement item
    //TODO: Fully convert the below stuff to achievements instead of skills.
    return `
        <li class="draggable-achievement" draggable="true" data-achievement-name="${achievement.name}">
            ${achievement.name} - ${achievement.description}
            <button onclick="console.log('Clicked + button for skill:', '${achievement.name.replace("'", "\\'")}'); addNoteModalHandler('achievements', '${achievement.name.replace("'", "\\'")}', '${achievement.id}')">+</button>
            <button onclick="console.log('Clicked Read Notes button for skill:', '${achievement.name.replace("'", "\\'")}'); readNotesModalHandler('achievements', '${achievement.name.replace("'", "\\'")}', '${achievement.id}')">Read Notes</button>
        </li>`;
}
//TODO: Problems fix them.
bestLoadoutForm.addEventListener('submit', (e) => {
    console.log("L");
    e.preventDefault();
    const character = loadoutCharacterSelect.value;
    const stat = document.getElementById('loadout-stat').value;

    let bestItems = {};
    let bestPartyItems = {};

    // Function to find the best item considering items in inventory and in folders
    function findBestItem(itemsArray) {
        let bestItem = {};

        itemsArray.forEach(item => {
            if ((!item.slot || item.slot === '') && (!item.stat || item.stat === '')) return; // Skip items without slot and stat
            const statObj = item.stats.find(s => s.stat === stat); // Find the correct stat in the item stats
            if (!statObj) return; // Skip if the item doesn't have the stat we're looking for
            
            if (!bestItem[item.slot]) bestItem[item.slot] = { ...item, value: statObj.value }; // Assign item with value
            else if (statObj.value > bestItem[item.slot].value) bestItem[item.slot] = { ...item, value: statObj.value };
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
            const statObj = item.stats.find(s => s.stat === stat); // Find the correct stat in the item stats
            if (!statObj) return; // Skip if the item doesn't have the stat we're looking for
            
            if (!bestPartyItems[item.slot]) bestPartyItems[item.slot] = { ...item, value: statObj.value }; // Assign item with value
            else if (statObj.value > bestPartyItems[item.slot].value) bestPartyItems[item.slot] = { ...item, value: statObj.value };
        });

        // Also include items from characterFolders[selectedCharacter] of other characters in the party
        if (char !== character) {
            characterFolders[selectedCharacter].filter(folder => folder.type === 'items').forEach(folder => {
                const folderBestItem = findBestItem(folder.items);
                Object.keys(folderBestItem).forEach(slot => {
                    if (!bestPartyItems[slot] || folderBestItem[slot].value > bestPartyItems[slot].value) {
                        bestPartyItems[slot] = folderBestItem[slot];
                    }
                });
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
    if (currentNoteType && currentNoteItem && currentNoteId) {
        const noteId = generateNoteId(currentNoteType, currentNoteItem, currentNoteId);
        itemNotes.push({ id: noteId, title: noteTitle, content: noteContent });
        console.log( "RESET TEST" + JSON.stringify(notes[currentNoteType][currentNoteItem][currentNoteId]) + JSON.stringify(notes[currentNoteType]) + currentNoteType + currentNoteItem + currentNoteId)
        console.dir(notes, { depth: null });
        
        // Update UI to reflect the newly added note
        if (currentNoteType === 'items') {
            updateInventoryDisplay(characterDetailsSelect.value);
        } else if (currentNoteType === 'skills') {
            updateSkillsDisplay(characterDetailsSelect.value);
        } else if (currentNoteType === 'titles') {
            updateTitlesDisplay(characterDetailsSelect.value);
        } else if (currentNoteType === 'achievements') {
            updateAchievementsDisplay(characterDetailsSelect.value);
        }
        // Reset the form and hide the modal
        addNoteForm.reset();
        saveGameState();
        addNoteModal.style.display = "none";
    } else {
        console.error('Error adding note: Current note type or item not set.');
    }
});

function generateNoteId(noteType, noteItem, noteId) {
    return `${noteType}-${noteItem}-${noteId}`;
}


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

function addNoteModalHandler(type, item, itemId) {
    
    console.log(typeof itemId + "TYPE OF ID")
    console.log("ITEMTEST" + JSON.stringify(itemNotes))
    currentNoteType = type;
    currentNoteItem = item;
    currentNoteId = itemId;
    currentNoteCharacter = selectedCharacter
    if(currentNoteId === undefined){
        currentNoteId = 1
    }
    addNoteModal.style.display = "block";
    console.log('Adding note modal handler called.' + JSON.stringify(itemNotes));
    console.log("ITEMTEST" + JSON.stringify(itemNotes))
    console.log("NOTETEST" + JSON.stringify(notes[currentNoteType][currentNoteItem][currentNoteId]))
    saveGameState();
    
}

function readNotesModalHandler(type, item, itemId) {
    console.log('Reading notes modal handler called.');
    currentNoteType = type;
    currentNoteItem = item;
    currentNoteId = itemId;
    currentNoteCharacter = selectedCharacter
    
    if(currentNoteId === undefined){
        currentNoteId = 1
    }
    console.log (selectedCharacter)
    console.log("itemNotes got RESET here. Read" + JSON.stringify(itemNotes) + currentNoteType + currentNoteItem + currentNoteId + "Notes" + JSON.stringify(notes[currentNoteType][currentNoteItem][currentNoteId]))
    const noteId = generateNoteId(currentNoteType, currentNoteItem, currentNoteId);
    const notesToDisplay = itemNotes.filter(note => note.id === noteId);
    
    // Prepare HTML for displaying notes
    notesList.innerHTML = notesToDisplay.map((note, index) => `<p class="note-title" onclick="showNoteDetails(${index})">${note.title}</p>`).join('');
    
    // Show the read notes modal
    noteDetails.style.display = "none"; // Ensure details are initially hidden
    readNotesModal.style.display = "block";
    saveGameState();
}

function showNoteDetails(index) {
    console.log("M")

    const noteId = generateNoteId(currentNoteType, currentNoteItem, currentNoteId);
    const notesToDisplay = itemNotes.filter(note => note.id === noteId);
    const note = notesToDisplay[index];
    
    noteTitleDisplay.innerHTML = note.title;
    noteContentDisplay.innerHTML = note.content;
    noteDetails.style.display = "block";
    noteDetails.setAttribute('data-note-index', index);
    saveGameState();
}

function editNote() {
    const index = noteDetails.getAttribute('data-note-index');
    const noteId = generateNoteId(currentNoteType, currentNoteItem, currentNoteId);
    const notesToDisplay = itemNotes.filter(note => note.id === noteId);
    const note = notesToDisplay[index];

    // Populate the add note form with the current note details for editing
    console.log(note.title + note.content)
    document.getElementById('note-title').value = note.title;
    document.getElementById('note-content').value = note.content;

    // Show the add note modal
    readNotesModal.style.display = "none";
    addNoteModal.style.display = "block";

    // Remove the note from the list so it can be replaced by the edited version
    const originalIndex = itemNotes.findIndex(n => n.id === noteId && n.title === note.title && n.content === note.content);
    if (originalIndex !== -1) {
        itemNotes.splice(originalIndex, 1);
    }
    saveGameState();

    // Optionally, store the index in a global variable if you need to keep track of the original position
}

function deleteNote() {
    const index = noteDetails.getAttribute('data-note-index');
    const noteId = generateNoteId(currentNoteType, currentNoteItem, currentNoteId);
    const notesToDisplay = itemNotes.filter(note => note.id === noteId);
    const note = notesToDisplay[index];
    
    // Remove the note from the original array
    const originalIndex = itemNotes.findIndex(n => n.id === noteId && n.title === note.title && n.content === note.content);
    if (originalIndex !== -1) {
        itemNotes.splice(originalIndex, 1);
    }

    // Hide the note details section
    noteDetails.style.display = "none";
    readNotesModalHandler(currentNoteType, currentNoteItem, currentNoteId);
    noteDetails.style.display = "none";

    // Save the updated game state
    saveGameState();
}

// Ensure the modals close on clicking outside
window.onclick = (event) => {
    if (event.target == addNoteModal) {
        addNoteModal.style.display = "none";
    }
    if (event.target == readNotesModal) {
        readNotesModal.style.display = "none";
    }
}



function generateInventoryItemHtml(item) {
    console.log("N" + JSON.stringify(item));
    console.log(item.stats); //TODO: For now this reads the given apples as null because it got deleted, probably add a fix for that, maybe don't delete the apples but just cut them or something?
    console.log(Array.isArray(item.stats)); // Verify if it's an array
    const statHtml = item.stats.map(s => `${s.stat}: ${s.value}`).join(', ');
    
    

    return `
         <li class="draggable" draggable="true" data-item-name="${item.name}">
            ${item.name.replace("'", "\\'")} (Slot: ${item.slot ? item.slot : 'No Slot'}, Stats: ${statHtml}, Rarity: ${item.rarity})
            <input type="number" min="0" value="${item.quantity}" onchange="handleQuantityChange(event, '${item.name.replace("'", "\\'")}', '${item.id}')">
            <button onclick="addNoteModalHandler('items', '${item.name.replace("'", "\\'")}', '${item.id}')">+</button>
            <button onclick="readNotesModalHandler('items', '${item.name.replace("'", "\\'")}', '${item.id}')">Read Notes</button>
            <button onclick="console.log('Clicked give item:', '${item.name.replace("'", "\\'")}'); giveItem('${item.name.replace("'", "\\'")}', '${item.id}')">Give item</button>
        </li>`;
}

// Assume these functions are defined elsewhere in your code
function deleteItemFromInventory(itemName) {
    const selectedCharacter = characterDetailsSelect.value;
    if (inventory[selectedCharacter]) {
        const itemIndex = inventory[selectedCharacter].findIndex(item => item.name === itemName);
        if (itemIndex !== -1) {
            inventory[selectedCharacter].splice(itemIndex, 1);
            if (characterDetailsSelect.value === selectedCharacter) {
                updateInventoryDisplay(selectedCharacter);
            }
            saveGameState();
        }
    }
    console.log(`Deleting item: ${itemName}`);
}

function setItemQuantity(itemName, itemId, quantity) {
    // Logic to set the item quantity
    const selectedCharacter = characterDetailsSelect.value;
    if (inventory[selectedCharacter]) {
        const itemIndex = inventory[selectedCharacter].findIndex(item => item.name === itemName && item.id === itemId) ;
        const indexTest = inventory[selectedCharacter].findIndex(item => item.id === itemId) ; //TODO: For some reason there are 0 entries for this one. Find out why.
        const indexTest2 = inventory[selectedCharacter].findIndex(item => item.name === itemName) ;
        console.log(itemIndex + "INDEX")
        console.log(itemId + "ITEMID")
        console.log(indexTest)
        console.log(indexTest2)
        if (itemIndex !== -1) {
            // Update the quantity of the existing item
            inventory[selectedCharacter][itemIndex].quantity = quantity;
            console.log("ITEMTEST" + JSON.stringify(inventory[selectedCharacter][itemIndex]) + JSON.stringify(inventory[selectedCharacter]))
        } else {
            // If the item does not exist, you can add it or handle it accordingly
            console.log(`Item ${itemName} does not exist in the inventory of ${selectedCharacter}`);
        }
        
        if (characterDetailsSelect.value === selectedCharacter) {
            updateInventoryDisplay(selectedCharacter);
        }
        saveGameState();
    } else {
        console.log(`Character ${selectedCharacter} does not have an inventory`);
    }
    console.log(`Setting quantity of ${itemName} ${itemId} to ${quantity}`);
    
    
}

function handleQuantityChange(event, itemName, itemId) {
    const newQuantity = event.target.value;
    if (newQuantity == 0) {
        if (confirm("Quantity is 0. Do you want to delete the item from the inventory?")) {
            // Delete the item from the inventory
            deleteItemFromInventory(itemName, itemId);
        } else {
            // Set the quantity to 0
            setItemQuantity(itemName, itemId, 0);
        }
    } else {
        // Update the quantity
        setItemQuantity(itemName, itemId, newQuantity);
    }
}

function generateSkillItemHtml(skill) {
    const escapedSkillName = skill.name.replace("'", "\\'");
    const hasLastRoll = !!skill.lastRoll;

    return `
         <li class="draggable-skill" draggable="true" data-skill-name="${skill.name}">
            ${skill.name} - ${skill.description}
            <button onclick="console.log('Clicked + button for skill:', '${escapedSkillName}', '${skill.id}'); addNoteModalHandler('skills', '${escapedSkillName}', '${skill.id}')">+</button>
            <button onclick="console.log('Clicked Read Notes button for skill:', '${escapedSkillName}', '${skill.id}'); readNotesModalHandler('skills', '${escapedSkillName}', '${skill.id}')">Read Notes</button>
            
            <button id="add-roll-${escapedSkillName}" onclick="console.log('Clicked Add Roll button for skill:', '${escapedSkillName}'); addRoll('${escapedSkillName}')" style="${hasLastRoll ? 'display:none;' : 'display:inline-block;'}">Add Roll</button>
            <label style="${hasLastRoll ? 'display:none;' : 'display:inline-block;'}">
                <input type="checkbox" id="global-add-roll-${escapedSkillName}" /> Add to all asigned versions of this ability
            </label>
            
            <button id="perform-${escapedSkillName}" style="${hasLastRoll ? 'display:inline-block;' : 'display:none;'}" onclick="console.log(this.id + 'Clicked Perform button for skill:', '${escapedSkillName}'); performRoll('${escapedSkillName}', '${skill.lastRoll}')">Perform</button>
            <button id="edit-${escapedSkillName}" style="${hasLastRoll ? 'display:inline-block;' : 'display:none;'}" onclick="editRoll('${escapedSkillName}')">Edit Roll</button>
            <label style="${hasLastRoll ? 'display:inline-block;' : 'display:none;'}">
                <input type="checkbox" id="global-edit-roll-${escapedSkillName}" /> Apply edit to all
            </label>
        </li>`;
}

function generateFolderHtml(folderName, items, type = 'items') {
    console.log("O")
    //TODO: Add a remove button.
    return `
        <li class="folder" data-folder-name="${folderName}" data-folder-type="${type}" data-character="${selectedCharacter}">
            <span class="folder-toggle" onclick="toggleFolderContents('${folderName}', '${type}')">${folderName}</span>
            <ul class="folder-contents collapsed">
                ${items.map(item => type === 'items' ? generateInventoryItemHtml(item) : generateSkillItemHtml(item)).join('')}
            </ul>
        </li>`;
}

function toggleFolderContents(folderName, type) {
    if (type === "custom") {
        console.log("CUSTOMFOLDER")
        const folderItems = document.getElementById(`${folderName}-items`);
        if (folderItems) {
            folderItems.classList.toggle('collapsed');
            
            // Update folder object in customFolders array to reflect current state
            const folder = customFolders.find(f => f.name === folderName);
            folder.expanded = folderItems.classList.contains('visible');
        }
    } else {
    console.log("TOGGLE ATTEMPTED")
    const selectedCharacter = characterDetailsSelect.value;
    const folderContents = document.querySelector(`.folder[data-folder-name="${folderName}"][data-folder-type="${type}"] .folder-contents`);
    folderContents.classList.toggle('collapsed');
    }
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
        } else if (type === 'titles') {
            const index = characterTitles[selectedCharacter].findIndex(existingTitle => existingTitle.name === item.name);
            if (index !== -1) {
                characterTitles[selectedCharacter].splice(index, 1);
            }
        } else if (type === 'achievements') {
            const index = characterAchievements[selectedCharacter].findIndex(existingAchievement => existingAchievement.name === item.name);
            if (index !== -1) {
                characterAchievements[selectedCharacter].splice(index, 1);
            }
        }
    });

    if (type === 'items') {
        console.log("DANGER")
        updateInventoryDisplay(selectedCharacter);
    } else if (type === 'skills') {
        console.log("DANGER")
        updateSkillsDisplay(selectedCharacter);
    } else if (type === 'titles') {
        console.log("DANGER")
        updateTitlesDisplay(selectedCharacter);
    } else if (type === 'achievements') {
        console.log("DANGER")
        updateAchievementsDisplay(selectedCharacter);
    } else {
        console.log("No type detected")
    }
}

function promptForFolderName(callback) {
    console.log("S")
    const folderName = prompt("Enter a name for the new folder:");
    if (folderName) {
        console.log("Help")
        callback(folderName);
    }
}

function attachDragAndDropHandlers() {
    console.log("T");
    const draggables = document.querySelectorAll('.draggable');
    const skillDraggables = document.querySelectorAll('.draggable-skill');
    const achievementDraggables = document.querySelectorAll('.draggable-achievement');
    const titleDraggables = document.querySelectorAll('.draggable-title');
    const folders = document.querySelectorAll('.folder');

    addDragHandlers(draggables, 'items');
    addDragHandlers(skillDraggables, 'skills');
    addDragHandlers(achievementDraggables, 'achievements');
    addDragHandlers(titleDraggables, 'titles');

    folders.forEach(folder => {
        folder.addEventListener('dragover', handleDragOver);
        folder.addEventListener('drop', handleDropOnFolder);
    });
}

function addDragHandlers(draggables, type) {
    console.log("Drag" + draggables) 
    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', (e) => handleDragStart(e, type));
        draggable.addEventListener('dragover', handleDragOver);
        draggable.addEventListener('drop', (e) => handleDrop(e, type));
    });
}

function handleDragStart(e, type) {
    let dataName = '';
    dataName = e.target.getAttribute(`data-${type.slice(0, -1)}-name`);
    e.dataTransfer.setData('text/plain', dataName);
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDrop(e, type) {
    console.log (type + "Dropped")
    e.preventDefault();
    const draggedName = e.dataTransfer.getData('text/plain');
    const targetName = e.target.getAttribute(`data-${type.slice(0, -1)}-name`);
    console.log (draggedName + " OOO " + targetName)
    if (draggedName && targetName) {
        console.log("drag and target")
        promptForFolderName(folderName => {
            // Dynamically get the correct array based on the type
            let array;
            switch (type) {
                case 'skills':
                    array = skills;
                    break;
                case 'achievements':
                    array = achievements;
                    break;
                case 'titles':
                    array = titles;
                    break;
                case 'items':
                    array = items;
                    break;
                default:
                    console.error('Unknown type:', type);
                    return;
            }

            const draggedIndex = array.findIndex(item => item.name === draggedName);
            if (draggedIndex !== -1) {
                console.log("TESTTEST")
                const targetIndex = array.findIndex(item => item.name === targetName);
                console.log(targetIndex)
                if (targetIndex !== -1) {
                    createFolder(folderName, [array[draggedIndex], array[targetIndex]], type);
                    // Remove the dragged item from the original array
                    array.splice(draggedIndex, 1);
                    updateSelect(type); // Update the select dropdown without the removed item
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
    if (draggedItemName && folderName && draggedName !== targetName) {
        const array = window[folderType];
        const draggedItem = array.find(item => item.name === draggedItemName);
        const folder = characterFolders[selectedCharacter].find(folder => folder.name === folderName && folder.type === folderType);
        folder.items.push(draggedItem);
        if (folderType === 'items') {
            updateInventoryDisplay(characterDetailsSelect.value);
        } else if (folderType === 'skills') {
            updateSkillsDisplay(characterDetailsSelect.value);
        }
    }
}

function updateSelect(type) {
    if (type === 'items') {
        updateItemSelect();
    } else if (type === 'skills') {
        updateSkillSelect();
    } else if (type === 'achievements') {
        updateAchievementSelect();
    } else if (type === 'titles') {
        updateTitleSelect();
    }
}



rollDiceForm.addEventListener('submit', (e) => {
    e.preventDefault();
    diceLogic('noSkill')
  
});

function diceLogic(skillCalled) {
    let diceInput = "";
    let resultValue = 0;

    if (skillCalled === 'noSkill') {
        diceInput = document.getElementById('dice-input').value.trim();
    } else {
        const skill = characterSkills[selectedCharacter].find(s => s.name === skillCalled);
        diceInput = skill.lastRoll;
    }

    // Updated regex to include all dice notations and modifiers
    //const diceNotationRegex = /(\d+d\d+)([khld][hld]?\d+|[khld][><=]=?\d+)?(cs[><=]=?\d+)?(cf[><=]=?\d+)?(ccs[><=]=?\d+)?(ccf[><=]=?\d+)?(m\d+)?(e[><=]=?\d+)?/g;
    
    //const diceNotationRegex = /(\d+d\d+)((?:[khld][><=]?\d+|[khld][hld]\d+|m\d+)+)?(cs[><=]=?\d+)?(cf[><=]=?\d+)?(ccs[><=]=?\d+)?(ccf[><=]=?\d+)?(e[><=]=?\d+)?/g;
    //const diceNotationRegex = /(\d+d\d+|\d+dF)((?:[khld][><=]?\d+|[khld][hld]\d+|m\d+)+)?(cs[><=]=?\d+)?(cf[><=]=?\d+)?(ccs[><=]=?\d+)?(ccf[><=]=?\d+)?(e[><=]=?\d+)?/g;
    //const diceNotationRegex = /(\d*d\d+|\d+dF|[a-zA-Z_][a-zA-Z0-9_]*)([khld][><=]?(\d+)|[khld][hld]\d+|m\d+)?(cs[><=]?(\d+))?(cf[><=]?(\d+))?(ccs[><=]?(\d+))?(ccf[><=]?(\d+))?(e[><=]?(\d+))?/g;
    const diceNotationRegex = /(\d*d[a-zA-Z_][a-zA-Z0-9_]*|\d+dF|\d+d\d+)([khld][><=]?(\d+)|[khld][hld]\d+|m\d+)?(cs[><=]?(\d+))?(cf[><=]?(\d+))?(ccs[><=]?(\d+))?(ccf[><=]?(\d+))?(e[><=]?(\d+))?/g;


    // Regex to match character attributes (e.g., Ernhart.charisma)
    const attributeRegex = /(\w+)\.(\w+)/g;

    // Regex to match variable assignments (e.g., v_x = 2d6)
    const variableRegex = /v_(\w+)\s*=\s*([^;]+);?/g;

    let endsOnMultiple = false;

    // Replace character attributes with their corresponding values
    let modifiedInput = diceInput.replace(attributeRegex, (match, character, stat) => {
        if (character === 'selectedCharacter') {
            if (characterStats[selectedCharacter] && characterStats[selectedCharacter][stat] !== undefined) {
                return characterStats[selectedCharacter][stat];
            } else {
                throw new Error(`Invalid attribute for selectedCharacter: ${stat}`);
            }
        } else {
            if (characterStats[character] && characterStats[character][stat] !== undefined) {
                return characterStats[character][stat];
            } else {
                throw new Error(`Invalid attribute: ${match}`);
            }
        }
    });

    function rollDice(numDice, diceType) {
        console.log('CUSTOM!')
        console.log(diceType)
        console.log(customDice[diceType])
        if (customDice[diceType]) {
            console.log('CUSTOM!')
            return rollCustomDice(numDice, diceType);
        }

        // Check if the diceType is a string and specifically handle 'F'
        if (diceType === 'F') {
            return Array.from({ length: numDice }, () => {
                return Math.floor(Math.random() * 3) - 1; // Generates -1, 0, or +1
            });
        }
    
        // Ensure other dice types are numeric
        if (isNaN(diceType)) {
            throw new Error(`Invalid dice type: ${diceType}`);
        }
    
        return Array.from({ length: numDice }, () => Math.floor(Math.random() * diceType) + 1);
    }


    function rollCustomDice(numDice, diceName) {
        if (!customDice[diceName]) {
            throw new Error(`Custom dice "${diceName}" is not defined.`);
        }
        
        const sides = customDice[diceName];
        const rolls = [];
    
        for (let i = 0; i < numDice; i++) {
            // Roll a random index from the custom dice array
            const rollIndex = Math.floor(Math.random() * sides.length);
            rolls.push(sides[rollIndex]);
        }
    
        return rolls;
    }
    
    // Function to evaluate dice notation with modifiers
    function evaluateDiceNotation(diceNotation) {
        console.log(diceNotation);
        
        // Regular expression to match number of dice and dice type (standard or custom)
        const regex = /^(\d*)d(\d+|[a-zA-Z_][a-zA-Z0-9_]*)$/;
        const match = diceNotation.match(regex);
        
        if (!match) {
            throw new Error("Invalid dice notation");
        }
    
        // Get the number of dice (default to 1 if not specified)
        const numDiceParsed = match[1] ? Number(match[1]) : 1;
        let initialDiceType = match[2];  // This can be a number, custom name, or 'F' for fudge dice
        let diceType = ""
        
        console.log("Initial Dice Type: " + initialDiceType);
    
        // Step 1: Find the longest matching custom dice name
        let longestMatch = "";
        Object.keys(customDice).forEach(customName => {
            if (diceType.includes(customName) && customName.length > longestMatch.length) {
                longestMatch = customName;
            }
        });
        
        if (longestMatch) {
            diceType = longestMatch; // Use the longest custom dice name
            console.log("Using custom dice: " + initialDiceType);
        } else if (initialDiceType.includes('F')) {
            diceType = 'F'; // Handle fudge dice separately
            console.log("Using fudge dice");
        } else if (isNaN(initialDiceType)) {
            throw new Error(`Invalid dice type: ${diceType}`);
        } else {
            console.log("Using regular numeric dice: d" + diceType);
            diceType = initialDiceType
            
        }
        console.log("Finished diceType: " + diceType);
        // Roll the dice based on the numDiceParsed and diceType (custom, fudge, or numeric)
        if (initialDiceType !== diceType) {
            // Extract any modifiers after the initial dice type
            remainingModifiers = initialDiceType.replace(diceType, '');
            console.log("MODIF" + remainingModifiers)

        }
        const rolls = rollDice(numDiceParsed, diceType);
        
        return rolls;
    }
    


    // Function to apply a single modifier and return the modified rolls
    function applySingleModifier(rolls, modifier) {
        let modifiedRolls = [...rolls].sort((a, b) => a - b);
        console.log("Modification set: " + modifier);

        const match = modifier.match(/([khld])([><=]=?)(\d+)/);
        const matchOldStyle = modifier.match(/([khld])([hld])(\d+)/);

        if (match) {
            const action = match[1];
            const operator = match[2];
            const value = parseInt(match[3], 10);

            switch (action) {
                case 'k': // Keep
                    modifiedRolls = modifiedRolls.filter(roll => compare(roll, operator, value));
                    break;
                case 'd': // Discard
                    modifiedRolls = modifiedRolls.filter(roll => !compare(roll, operator, value));
                    break;
            }
        }
        if (matchOldStyle) {
            const action = matchOldStyle[1] + matchOldStyle[2]; // 'kh', 'kl', 'dh', 'dl'
            const count = parseInt(matchOldStyle[3], 10);

            switch (action) {
                case 'kh': // Keep highest
                    modifiedRolls = modifiedRolls.slice(-count);
                    break;
                case 'kl': // Keep lowest
                    modifiedRolls = modifiedRolls.slice(0, count);
                    break;
                case 'dh': // Discard highest
                    modifiedRolls = modifiedRolls.slice(0, -count);
                    break;
                case 'dl': // Discard lowest
                    modifiedRolls = modifiedRolls.slice(count);
                    break;
            }
        }
        console.log("Modified: " + modifiedRolls);
        endsOnMultiple = false
        return modifiedRolls;
    }
    function applyModifiers(rolls, modifierString) {
        if (!modifierString) return rolls;
    
        // Split the modifier string into individual modifiers
        const modifiers = modifierString.match(/([khld][><=]?\d+|[khld][hld]\d+|m\d+)/g);
    
        let modifiedRolls = [...rolls];
        if (modifiers) {
            // Apply modifiers in the order they appear
            modifiers.forEach(modifier => {
                if (modifier.startsWith('m')) {
                    // Handle multiples (m2) before modifying rolls, so they are applied last if other modifiers are present
                    modifiedRolls = applyMultiples(modifiedRolls, modifier);
                    console.log("Kane" + modifiedRolls + modifier + resultValue)
                } else {
                    // Apply keep/discard modifiers
                    modifiedRolls = applySingleModifier(modifiedRolls, modifier);
                }
            });
        }
    
        return modifiedRolls;
    }
    
    function applyMultiples(rolls, multipleModifier) {
        let modifiedRolls = [...rolls];
        const multipleMatch = multipleModifier.match(/m(\d+)/);
        
        if (multipleMatch) {
            const numMultiples = parseInt(multipleMatch[1], 10);
            console.log("Multiples modifier: " + multipleModifier);
    
            // Count the occurrences of each roll value
            const rollCounts = rolls.reduce((counts, roll) => {
                counts[roll] = (counts[roll] || 0) + 1;
                return counts;
            }, {});
    
            // Initialize total multiples counter and modified roll list
            let totalMultiples = 0;
            modifiedRolls = [];
    
            // Loop through each roll count and calculate how many multiples can be made
            for (const [roll, count] of Object.entries(rollCounts)) {
                const multiplesOfRoll = Math.floor(count / numMultiples); // How many full groups of numMultiples
                totalMultiples += multiplesOfRoll; // Add the number of multiples for this roll
    
                // Add the roll to the modifiedRolls array based on how many multiples there are
                for (let i = 0; i < multiplesOfRoll * numMultiples; i++) {
                    modifiedRolls.push(parseInt(roll)); // Push the roll value as part of a valid multiple
                }
            }
            resultValue = totalMultiples
            endsOnMultiple = true
            console.log("Roll counts: ", rollCounts);
            console.log("Total multiples that appear " + numMultiples + " or more times: " + totalMultiples);
    
            // Return the modified rolls that contribute to complete multiples
            return modifiedRolls; 
        }
        
        return modifiedRolls;
    }
    
    

    

    // Function to evaluate the entire expression
    function evaluateExpression(expression, variables) {
        // Evaluate variable expressions first
        expression = expression.replace(variableRegex, (match, varName, varExpression) => {
            const value = evaluateExpression(varExpression, variables);
            variables[`v_${varName}`] = value;
            return '';
        });

        // Replace variables with their values
        expression = expression.replace(/\b(v_\w+)\b/g, (match) => {
            const varValue = variables[match];
            if (varValue === undefined) {
                throw new Error(`Undefined variable: ${match}`);
            }
            return varValue;
        });

        let modifiedRolls = [];
        

        // Process dice notations one by one
        while (diceNotationRegex.test(expression)) {
            expression = expression.replace(diceNotationRegex, (match, diceNotation, modifier, successCriteria, failureCriteria, criticalSuccessCriteria, criticalFailureCriteria, multiples, exploding) => {
                const rolls = evaluateDiceNotation(diceNotation);
                let tempRolls = rolls;

                // Apply all parts of the modifier
                if (modifier) {
                    console.log("Modi" + modifier)
                    tempRolls = applyModifiers(tempRolls, modifier);
                }

                // Use the modified rolls for further criteria
                if (successCriteria || failureCriteria || criticalSuccessCriteria || criticalFailureCriteria || multiples) {
                    modifiedRolls = tempRolls;
                    console.log("Modified: " + modifiedRolls);
                }

                // Prepare result for success/failure checks
                if (endsOnMultiple == false) {
                    resultValue = tempRolls.reduce((sum, roll) => sum + roll, 0);
                }
                // Handle success criteria
                if (successCriteria) {
                    const successMatch = successCriteria.match(/cs([><=]=?)(\d+)/);
                    if (successMatch) {
                        const operator = successMatch[1];
                        const value = parseInt(successMatch[2], 10);
                        resultValue = tempRolls.filter(roll => compare(roll, operator, value)).length;
                        modifiedRolls = tempRolls.filter(roll => compare(roll, operator, value));
                        console.log("Mod" + modifiedRolls)
                    }
                }

                // Handle failure criteria
                if (failureCriteria) {
                    const failureMatch = failureCriteria.match(/cf([><=]=?)(\d+)/);
                    if (failureMatch) {
                        const operator = failureMatch[1];
                        const value = parseInt(failureMatch[2], 10);
                        resultValue = tempRolls.filter(roll => compare(roll, operator, value)).length;
                        modifiedRolls = tempRolls.filter(roll => compare(roll, operator, value));
                    }
                }

                // Handle critical success criteria
                if (criticalSuccessCriteria) {
                    const criticalSuccessMatch = criticalSuccessCriteria.match(/ccs([><=]=?)(\d+)/);
                    if (criticalSuccessMatch) {
                        const operator = criticalSuccessMatch[1];
                        const value = parseInt(criticalSuccessMatch[2], 10);
                        resultValue = tempRolls.filter(roll => compare(roll, operator, value)).length;
                        modifiedRolls = tempRolls.filter(roll => compare(roll, operator, value));
                    }
                }

                // Handle critical failure criteria
                if (criticalFailureCriteria) {
                    const criticalFailureMatch = criticalFailureCriteria.match(/ccf([><=]=?)(\d+)/);
                    if (criticalFailureMatch) {
                        const operator = criticalFailureMatch[1];
                        const value = parseInt(criticalFailureMatch[2], 10);
                        resultValue = tempRolls.filter(roll => compare(roll, operator, value)).length;
                        modifiedRolls = tempRolls.filter(roll => compare(roll, operator, value));
                        
                    }
                }

                // Handle multiples criteria
                if (multiples) {
                    const multipleMatch = multiples.match(/m(\d+)/);
                    console.log("Mult" + multiples)
                    if (multipleMatch) {
                        const numMultiples = parseInt(multipleMatch[1], 10);
                        const rollCounts = tempRolls.reduce((counts, roll) => {
                            counts[roll] = (counts[roll] || 0) + 1;
                            return counts;
                        }, {});
                        resultValue = Object.values(rollCounts).filter(count => count >= numMultiples).length;
                    }
                }
                //tempRolls = modifiedRolls TODO: This makes all modified stuff be displayed correctly ecept for multiples which seem to break, probaly because modifiedrolls is set empty for them
                
                //tempRolls = modifiedRolls
                console.log("Kanus" + tempRolls)
                let detailedResult = `${diceNotation}${modifier ? ' ' + modifier : ''}${successCriteria ? ' ' + successCriteria : ''}${failureCriteria ? ' ' + failureCriteria : ''}${criticalSuccessCriteria ? ' ' + criticalSuccessCriteria : ''}${criticalFailureCriteria ? ' ' + criticalFailureCriteria : ''}${multiples ? ' ' + multiples : ''}${exploding ? ' ' + exploding : ''} → Rolls: ${rolls.join(', ')} → Modified: ${tempRolls.join(', ')} → Final: ${resultValue}`;

                breakdown.push(detailedResult);
                
                console.log("Temp" + tempRolls)
                return resultValue;
            });
        }

        return eval(expression);
    }

    // Helper function to compare values based on operator
    function compare(roll, operator, value) {
        switch (operator) {
            case '>':
                return roll > value;
            case '>=':
                return roll >= value;
            case '<':
                return roll < value;
            case '<=':
                return roll <= value;
            case '=':
            case '==':
                return roll === value;
            default:
                return false;
        }
    }

    let variables = {};
    let finalTotal = 0;
    let breakdown = [];

    try {
        const evaluatedExpression = evaluateExpression(modifiedInput, variables);
        console.log("Evaluatecheck" + modifiedInput)
        finalTotal = evaluatedExpression;
    } catch (error) {
        console.log(error + "Error" + modifiedInput + JSON.stringify(variables));
        diceRollResult.textContent = 'Invalid dice notation or math expression.';
        return;
    }

    let finalResultMessage = `${breakdown.join(' | ')} => Total: ${finalTotal}`;
    const maxLength = 200;

    if (finalResultMessage.length > maxLength) {
        breakdown = breakdown.map(message => {
            const rollsMatch = message.match(/Rolls: ([^ ]+)/);
            if (rollsMatch) {
                const rollsString = rollsMatch[1];
                const rolls = rollsString.split(', ').map(Number);
                const summary = summarizeRolls(rolls);
                return message.replace(/Rolls: [^ ]+/, `Rolls: ${summary}`);
            }
            return message;
        });
        finalResultMessage = `${breakdown.join(' | ')} => Total: ${finalTotal}`;
    }

    if (finalResultMessage.length > maxLength) {
        breakdown = breakdown.map(message => {
            const rollsMatch = message.match(/Rolls: ([^ ]+)/);
            if (rollsMatch) {
                const rolls = rollsMatch[1].split(', ').map(Number);
                const extremes = `Lowest: ${Math.min(...rolls)}, Highest: ${Math.max(...rolls)}`;
                return message.replace(/Rolls: [^ ]+/, `Rolls: ${extremes}`);
            }
            return message;
        });
        finalResultMessage = `${breakdown.join(' | ')} => Total: ${finalTotal}`;
    }

    if (finalResultMessage.length > maxLength) {
        finalResultMessage = `Total: ${finalTotal}`;
    }

    if (skillCalled === 'noSkill') {
        diceRollResult.textContent = finalResultMessage;
    } else {
        alert(`${skillCalled}: ` + finalResultMessage);
    }
}

function summarizeRolls(rolls) {
    let counts = {};
    rolls.forEach(roll => {
        counts[roll] = (counts[roll] || 0) + 1;
    });
    return Object.entries(counts).map(([roll, count]) => `${roll}: ${count}`).join(', ');
}

function addRoll(skillName) {
    const diceNotation = prompt("Enter dice notation (e.g., 2d6 + 5):");
    if (diceNotation) {
        const applyToAll = document.getElementById(`global-add-roll-${skillName}`).checked; //Bug when skill is cleared from skill list: Uncaught TypeError TypeError: Cannot read properties of null (reading 'checked')
        if (applyToAll) {
            // Apply to all characters
            for (let character in characterSkills) {
                const skill = characterSkills[character].find(s => s.name === skillName);
                if (skill) {
                    skill.lastRoll = diceNotation;
                }
            }
        } else {
            // Apply to selected character only
            const skill = characterSkills[selectedCharacter].find(s => s.name === skillName);
            skill.lastRoll = diceNotation;
        }
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
    // Determine the current dice notation
    let currentDiceNotation;
    const applyToAll = document.getElementById(`global-edit-roll-${skillName}`).checked;
    if (applyToAll) {
        // Get the dice notation for the first character's skill (assume all characters have the same notation)
        for (let character in characterSkills) {
            const skill = characterSkills[character].find(s => s.name === skillName);
            if (skill) {
                currentDiceNotation = skill.lastRoll;
                break;
            }
        }
    } else {
        // Get the dice notation for the selected character's skill
        const skill = characterSkills[selectedCharacter].find(s => s.name === skillName);
        if (skill) {
            currentDiceNotation = skill.lastRoll;
        }
    }

    // Prompt the user with the current dice notation as the default value
    const diceNotation = prompt("Enter new dice notation (e.g., 1d20 + 3):", currentDiceNotation);
    if (diceNotation) {
        if (applyToAll) {
            // Apply to all characters
            for (let character in characterSkills) {
                const skill = characterSkills[character].find(s => s.name === skillName);
                if (skill) {
                    skill.lastRoll = diceNotation;
                }
            }
        } else {
            // Apply to selected character only
            const skill = characterSkills[selectedCharacter].find(s => s.name === skillName);
            skill.lastRoll = diceNotation;
        }
        console.log(`Dice notation edited for ${skillName}: ${diceNotation}`);
        saveGameState();  // Save state after modification
        updateSkillSelect();  // Refresh the skill list UI
    }
}

function performRoll(skillName) {
    diceLogic(skillName)
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

function removefromSelect(name, type) {
    console.log("REMOVE ATTEMPTED")
    if (type === "items") {
       
    } 
    switch (type) {
        case "items":
            const itemIndex = items.findIndex(i => i.name === name.name);
            if (itemIndex !== -1) {
                items.splice(itemIndex, 1);
                console.log("REMOVED")
            }
            break;
        case "skills":
            const skillIndex = skills.findIndex(s => s.name === name.name);
            if (skillIndex !== -1) {
                skills.splice(skillIndex, 1);
            }
            break;
        case "titles":
            const titleIndex = titles.findIndex(t => t.name === name.name);
            if (titleIndex !== -1) {
                titles.splice(titleIndex, 1);
            }
            break;
        case "achievements":
            const achievementIndex = achievements.findIndex(a => a.name === name.name);
            if (achievementIndex !== -1) {
                achievements.splice(achievementIndex, 1);
            }
            break;
        default:
            console.error("Unknown type:", type);
    }
    // Add similar logic for skills, achievements, titles if necessary
    updateItemSelect();
    updateSkillSelect();
    updateTitleSelect();
    updateAchievementSelect();
    saveGameState(); // Save the game state after removal
}

document.querySelectorAll('.sidebar a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.section').forEach(section => section.style.display = 'none');
        const target = link.getAttribute('data-target');
        if (target) {
            document.getElementById(target).style.display = 'block';
        }
    });
});



document.addEventListener("DOMContentLoaded", function() {
    // Your existing code here
    //TODO: Make sure all things that are clickable also react to touches, just like here.
    headers.forEach(header => {
        header.addEventListener("click", function() {
            const targetId = header.getAttribute("data-target");
            const target = document.getElementById(targetId);
            characterDetailRevealList(target)
        });

        header.addEventListener("touchstart", function(event) {
            // Prevent the default click behavior on touch devices
            event.preventDefault(target);

            const targetId = header.getAttribute("data-target");
            const target = document.getElementById(targetId);
        });
    });
});

function characterDetailRevealList(target) {
    

    if (!target) return; // Exit early if target element is not found

    if (target.style.display === "none") {
        target.style.display = "block";
        console.log("Now it works.")
    } else {
        target.style.display = "none";
        console.log ("You are right!")
    }
}

function initializeCharacterStats(character) {
    if (!characterStats[character]) {
        characterStats[character] = {};
        stats.forEach(stat => {
            if (!(stat in characterStats[character])) {
                characterStats[character][stat] = 0;
            }
        });
    }
}

function initializeCharacterStats(character) {
    if (!characterStats[character]) {
        characterStats[character] = {};
        stats.forEach(stat => {
            if (!(stat in characterStats[character])) {
                characterStats[character][stat] = 0;
            }
        });
    }
}

function addStatHandler() {
    const statName = document.getElementById('stat-name').value.trim();
    let statValue = parseInt(document.getElementById('stat-value').value.trim(), 10);
    
    if (!statName || isNaN(statValue)) return;
    
    if (stats.includes(statName)) {
        alert('Stat name already exists');
        return;
    }
    
    stats.push(statName);
    for (let character in characterStats) {
        characterStats[character][statName] = 0;
    }
    
    initializeCharacterStats(selectedCharacter);
    characterStats[selectedCharacter][statName] = statValue;
    
    updateCharacterStatsDisplay(selectedCharacter);
    updateCharacterStatsSelect()
    saveGameState();
}

function updateCharacterStatsDisplay(character) {
    console.log("Test1")
    if (!character) return;
    console.log("Test2")
    initializeCharacterStats(character);
    
    let statsHtml = '';
    stats.forEach(stat => {
        console.log("Test3")
        let value = characterStats[character][stat];
        statsHtml += generateStatItemHtml(stat, value);
    });
    
    statsList.innerHTML = statsHtml ? `<ul>${statsHtml}</ul>` : 'No stats';
    console.log("No stats")
}

function generateStatItemHtml(stat, value) {
    return `
        <li class="stat-item">
            ${stat}: <input type="number" value="${value}" onchange="updateStat('${stat}', this.value)">
        </li>`;
}

function updateStat(stat, value) {
    if (!selectedCharacter || !characterStats[selectedCharacter]) return;
    console.log("Selected Char" + selectedCharacter)
    characterStats[selectedCharacter][stat] = parseInt(value, 10);
    updateCharacterStatsDisplay(selectedCharacter);
    saveGameState();
}

function createGraph() {
    updateCharacterStatsDisplay()
    console.log("Created Graph")
    console.log(modeGraphSelect.value)
    myChart.data.labels = [];
    myChart.data.datasets[0].data = [];
    myChart.data.datasets[0].backgroundColor = [];
    colorIndex = 0
    if (modeGraphSelect.value === "charactersStat") {
        characters.forEach(character => {
            console.log("Stats" + characterStats[character][statGraphSelect.value])
            console.log(statGraphSelect.value)
            console.log(document.getElementById('statGraphSelect').value)
            console.log(document.getElementById('statGraphSelect').text)
            addData(character, characterStats[character][statGraphSelect.value], getNextColor())
        })
    } else if (modeGraphSelect.value === "characterStats") {
        console.log("Character name: " + characterStats[characterGraphSelect.value]);
        console.log("Character name: " + JSON.stringify(characterStats[characterGraphSelect.value]));

        let characterStatsObj = characterStats[characterGraphSelect.value];
        for (let stat in characterStatsObj) {
            if (characterStatsObj.hasOwnProperty(stat)) {
                addData(stat, characterStatsObj[stat], getNextColor());
            }
        }
    }
}

function getNextColor() {
    const color = colors[colorIndex]; // Get the color at the current index
    colorIndex = (colorIndex + 1) % colors.length; // Increment index and reset if it exceeds the length of the colors array
    return color;

  }

  function addData(label, data, color) {
    console.log("Added data to graph")
    // Add label to the labels array
    myChart.data.labels.push(label);
    // Add data to the data array
    myChart.data.datasets[0].data.push(data);
    // Add color to the backgroundColor array
    myChart.data.datasets[0].backgroundColor.push(color);
    // Update the chart
    myChart.update();
  }

  
  function updateCharacterStatsSelect() {
    const selectElement = document.getElementById('statGraphSelect');
    const selectElement2 = document.getElementById('characterGraphSelect');
    selectElement.textContent = ''; // Clear existing options

    stats.forEach(stat => {
        const option = document.createElement('option');
        console.log(stat)
        option.value = stat;
        option.textContent = stat;
        selectElement.appendChild(option);
        console.log("Stat assigned")
    });

    characters.forEach(character => {
        const option = document.createElement('option');
        console.log(character)
        option.value = character;
        option.textContent = character;
        selectElement2.appendChild(option);
        console.log("Name assigned")
    });

  }

  function logAllNotes() {
    console.log('Logging all notes:');
    for (const itemType in note) {
        if (notes.hasOwnProperty(itemType)) {
            console.log(`ItemType: ${itemType}`);
            for (const itemName in notes[itemType]) {
                if (notes[itemType].hasOwnProperty(itemName)) {
                    console.log(`  ItemName: ${itemName}`);
                    for (const itemId in notes[itemType][itemName]) {
                        if (notes[itemType][itemName].hasOwnProperty(itemId)) {
                            console.log(`    ItemId: ${itemId}`);
                            const itemNotes = notes[itemType][itemName][itemId];
                            itemNotes.forEach((note, index) => {
                                console.log(`      Note ${index + 1}: ${note.title} - ${note.content}`);
                            });
                        }
                    }
                }
            }
        }
    }
}


//TODO: Convert this import and export code from dicecube to the dnd tool, it should mostly wpork, objects might act a little funky. Bytother than that it should mostly be fine.
function importGameDataPrompt() {
    var textarea = document.getElementById("variableChecker");
    textarea.style.display = "inline-block";
    document.getElementById("importData").style.display = "";
    document.getElementById("exportToClipboard").style.display = "none";

  }
  function importGameData() {
    var importData = document.getElementById("variableChecker").value;
    savedState = JSON.parse(importData)
    document.getElementById("importData").style.display = "none";
    document.getElementById("variableChecker").style.display = "none";
    loadGameState('imported');
  }

  function exportGameDataClipboard() {
    var importData = document.getElementById("variableChecker").value;
    navigator.clipboard.writeText(importData);
    }

    function checkVariables() {
        saveGameState();
        loadGameState();
        var textarea = document.getElementById("variableChecker");
        var json = JSON.stringify(savedState);
        textarea.value = json;
        textarea.style.display = "inline-block";
        document.getElementById("importData").style.display = "none";
        document.getElementById("exportToClipboard").style.display = "";

    }
    
   function createSaveFilePrompt() {
    const saveFileName = prompt("Enter save name:");
    if (saveFileName) {
        createSaveFile(saveFileName);
    }
}

// Function to create a new save file
function createSaveFile(saveFileName) {
    if (!saveFiles[saveFileName]) {
        saveFiles[saveFileName] = []; // Initialize with an empty array for save
        updateSaveFileDropdown();
        alert('Save file created: ' + saveFileName);
        currentSaveFile = saveFileName
        saveToSelectedFile(); // Save the current state into the new file
    } else {
        alert('Save file already exists: ' + saveFileName);
    }
}

// Function to select a save file from dropdown
function selectSaveFile() {
    const dropdown = document.getElementById('saveFileDropdown');
    currentSaveFile = dropdown.value;
    if (currentSaveFile) {
        alert('Selected save file: ' + currentSaveFile)
    } else {
        alert('No save file selected.');
    }
}

// Function to update the dropdown list of save files
//TODO: This doesn't seem to be persistent anymore, except for when the createsavefile calls savetoselectedfile and it actually saves something, check the savetoslected file function out to find what makes this work.
function updateSaveFileDropdown() {
    const dropdown = document.getElementById('saveFileDropdown');
    dropdown.innerHTML = '<option value="">-- Select --</option>';
    for (const saveFileName in saveFiles) {
        console.log("Bernardo" + saveFileName)
        const option = document.createElement('option');
        option.value = saveFileName;
        option.textContent = saveFileName;
        dropdown.appendChild(option);
    }
}

// Function to save the current game state to the selected save file
//For some reason saving to a selected file twice, the same content, seems to properly protect it from being erased upon reload, find out why.
function saveToSelectedFile() {
    if (currentSaveFile) {
        if (saveFiles[currentSaveFile]) {
            for (const saveFileName in saveFiles) {
                console.log("Coooompare" + saveFileName + "BABA " + saveFiles[saveFileName])
            }
            saveGameState();
            const saveToFile = localStorage.getItem('gameState');
            if (saveToFile === "") {
                console.log("MY susicions are right, the localStorage somehow gets set to nothing, thus making it push nothing to the savefiles.")
            }
            //TODO: Saving twice for some reason seems to be the only way to truly have persistent saves? It might just be that the savefiles don't get properly initialized like in the if block below, and that having the array emptied and then pushed to somehow fixes that issue, might be worth looking
            if (saveFiles[currentSaveFile] && saveFiles[currentSaveFile].length > 0) {
                // Clear the existing saves
                saveFiles[currentSaveFile] = [];
                console.log("Emptied Save File")
            }
            // Add the new save to the file
            saveFiles[currentSaveFile].push(saveToFile);
            alert('Game state saved to: ' + currentSaveFile + JSON.stringify(saveToFile));
            saveGameState();
        } else {
            alert('Save file does not exist.');
        }
    } else {
        alert('No save file selected.');
    }
}

// Function to load the latest game state from the selected save file
function loadSelectedFile() {
    if (currentSaveFile) {
        for (const saveFileName in saveFiles) {
            console.log("Compare Maestro" + saveFileName + "BABA " + saveFiles[saveFileName])
        }
        if (saveFiles[currentSaveFile] && saveFiles[currentSaveFile].length > 0) {
            const latestSave = saveFiles[currentSaveFile].slice(-1)[0]; // Load the latest save
            localStorage.setItem('gameState', latestSave)
            alert('Game state loaded from: ' + currentSaveFile + JSON.stringify(latestSave) );
            loadGameState()
        } else {
            alert('Save file is empty or does not exist.');
            console.log(saveFiles[currentSaveFile] + "Length" + saveFiles[currentSaveFile].length)
        }
    } else {
        alert('No save file selected.');
    }
}
function giveItem(itemN, itemI) {
    // Prompt the user to filter recipients
    let possibleRecipients = characters;

    // Function to display a filtered list based on user input
    function filterRecipients(input) {
        return possibleRecipients.filter(name => name.toLowerCase().startsWith(input.toLowerCase()));
    }

    // Simulate user typing a few characters and selecting the recipient
    let userInput = prompt("Who would you like to give the item to?");
    let filteredRecipients = filterRecipients(userInput);
    
    if (filteredRecipients.length === 0) {
        console.log("No valid recipients found.");
        return;
    }

    // Simulate user selecting the recipient from the filtered list
    const reciever = filteredRecipients
   

    // Assuming the selected character and item name have been initialized elsewhere
    
    itemName = itemN;
    itemId = itemI;

    const itemIndex = inventory[selectedCharacter]?.findIndex(item => item.name === itemName && item.id === itemId);
    if (itemIndex === -1 || !inventory[selectedCharacter] || !inventory[selectedCharacter][itemIndex]) {
        console.log(`${selectedCharacter} doesn't have any ${itemName}(s) to give.`);
        return;
    }

    let availableQuantity = inventory[selectedCharacter][itemIndex].quantity;
    console.log(`Available quantity: ${availableQuantity}`);

    // Ask how many to give if more than 1
    let quantityToGive = 1;
    if (availableQuantity > 1) {
        quantityToGive = parseInt(prompt(`How many ${itemName}(s) would you like to give? (Max: ${availableQuantity})`), 10);
        if (isNaN(quantityToGive) || quantityToGive < 1) {
            console.log("Invalid quantity.");
            return;
        }
        if (quantityToGive > availableQuantity) {
            quantityToGive = availableQuantity;
        }
    }

    // Initialize the recipient's inventory if necessary
    if (!inventory[reciever]) {
        inventory[reciever] = [];
    }

    // Find if the receiver has the same item
    let recieverItemIndex = inventory[reciever].findIndex(item => {
        const recieverItemStatsString = JSON.stringify(item.stats || {});  // Empty object if stats are undefined
        const selectedItemStatsString = JSON.stringify(inventory[selectedCharacter][itemIndex].stats || {});
        
        // Log stats comparison for debugging
        console.log("Comparing item stats:");
        console.log("Recipient's item stats:", recieverItemStatsString);
        console.log("Selected item's stats:", selectedItemStatsString);

        return item.name === itemName && recieverItemStatsString === selectedItemStatsString;
    });

   
   
    
    if (recieverItemIndex !== -1) {
        console.log("Compare: copies found")
        // If the recipient has the same item, stack the quantity
        inventory[reciever][recieverItemIndex].quantity += quantityToGive;
        //TODO: Add a prompt to keep or delete the notes for the other person.
        //TODO: check if the note stuff works.
        let selectedCharacterNoteId = generateNoteId("items", itemName, itemId);
        let selectedItemNotes = itemNotes.filter(note => note.id === selectedCharacterNoteId);

        if (selectedItemNotes.length > 0) {
            let copyNotePrompt = prompt("Do you want to add extra notes from the given item to the recieved item? y/n")
            if (copyNotePrompt === "y") {
                selectedItemNotes.forEach(note => {
                    let newNoteId = generateNoteId("items", itemName, inventory[reciever][recieverItemIndex].id);
                    
                    // Check if a note with the same content already exists for the recipient
                    let duplicateNoteExists = itemNotes.some(existingNote => 
                        existingNote.id === newNoteId && existingNote.content === note.content
                    );
    
                    if (!duplicateNoteExists) {
                        let clonedNote = { ...note, id: newNoteId };  // Clone the note and update its ID
                        itemNotes.push(clonedNote);  // Add the cloned note to the itemNotes array
                    }
                });
            }
            
        }
        
    } else {
        console.log("Compare: no copies found")
        // Create a new item with the lowest possible unique ID for the recipient
        //TODO: Add a prompt to merge the notes or remove either one of them.
        let idNumbers = inventory[reciever]
            .filter(item => item.name === itemName)  // Only consider items with the same name
            .map(item => parseInt(item.id.split("_")[0], 10));  // Extract the numeric part before "_reciever"

        let newIdNumber = 1;
        while (idNumbers.includes(newIdNumber)) {
            newIdNumber++;  // Increment until we find the lowest available number
        }

        let newId = `${newIdNumber}_${reciever}`;
        let newItem = { ...inventory[selectedCharacter][itemIndex] };  // Clone the item from the sender
        newItem.id = newId;  // Assign the new unique ID
        newItem.quantity = quantityToGive;

        inventory[reciever].push(newItem);
        // Clone the notes to the new item
        let selectedCharacterNoteId = generateNoteId("items", itemName, itemId);
        let selectedItemNotes = itemNotes.filter(note => note.id === selectedCharacterNoteId);

        //TODO: check if the notestuff works. (It works but it creates a lot of duplicates as you move it back and forth, I should probably fix that.)
        if (selectedItemNotes.length > 0) {
           
            let copyNotePrompt = prompt("Do you want to copy the notes over alongside the given item? y/n")
            if (copyNotePrompt === "y") {
                selectedItemNotes.forEach(note => {
                    let newNoteId = generateNoteId("items", itemName, newId);
    
                    // Check if a note with the same content already exists for the recipient
                    let duplicateNoteExists = itemNotes.some(existingNote => 
                        existingNote.id === newNoteId && existingNote.content === note.content
                    );
    
                    if (!duplicateNoteExists) {
                        let clonedNote = { ...note, id: newNoteId };  // Clone the note and update its ID
                        itemNotes.push(clonedNote);  // Add the cloned note to the itemNotes array
                    }
                });
            }
            
        }

        console.log("Cloned notes for the new item:", JSON.stringify(selectedItemNotes));
    }

    // Subtract the given quantity from the sender's inventory
    inventory[selectedCharacter][itemIndex].quantity -= quantityToGive;
    if (inventory[selectedCharacter][itemIndex].quantity <= 0) {
        inventory[selectedCharacter].splice(itemIndex, 1);  // Remove the item if none left
        //TODO: Maybe ask if you should remove the item, in case it's like gold coins or something, you already have a function for this
    }

    // Save the game state
    saveGameState();
    
    console.log(`Gave ${quantityToGive} ${itemName}(s) to ${reciever}.`);
    console.log(JSON.stringify(itemNotes) + "NOTESNOTES2")
    updateCharacterDetails();
}


// TODO: Probably only make text appear after typing atleast 1 letter, maybe 2. Also add achievements, titles etc. But also add the ability to search all types or 1 type.

function searchData() {
    const searchValue = document.getElementById("searchInput").value.toLowerCase().trim();
    const resultsDiv = document.getElementById("results");
    let results = '';
    const searchState = JSON.parse(savedState);
    const selectedCategory = document.getElementById("searchCategory").value; // Get selected category

    // Check if the characters array exists and is not undefined
    if (selectedCategory === "all" || selectedCategory === "characters") {
        if (searchState.characters && Array.isArray(searchState.characters)) {
            results += '<h2>Characters</h2>';
            searchState.characters.forEach(character => {
                const words = character.toLowerCase().split(" ");
                if (words.some(word => word.startsWith(searchValue))) {
                    results += `<p>${character}</p>`;
                }
            });
        } else {
            results += '<p>Characters data not found.</p>';
        }
    }

    // Search inventory items
    if (selectedCategory === "all" || selectedCategory === "inventory") {
        results += '<h2>Inventory</h2>';
        for (const character in searchState.inventory) {
            searchState.inventory[character].forEach(item => {
                const words = item.name.toLowerCase().split(" ");
                if (words.some(word => word.startsWith(searchValue))) {
                    results += `<p>${item.name} (Owned by: ${character})</p>`;
                }
            });
        }
    }

    // Search item notes
    if (selectedCategory === "all" || selectedCategory === "itemNotes") {
        results += '<h2>Item Notes</h2>';
        searchState.itemNotes.forEach(note => {
            const titleWords = note.title.toLowerCase().split(" ");
            const contentWords = note.content.toLowerCase().split(" ");
            if (titleWords.some(word => word.startsWith(searchValue)) || contentWords.some(word => word.startsWith(searchValue))) {
                results += `<p>Item: ${note.title} - Note: ${note.content}</p>`;
            }
        });
    }

    // Search skills
    if (selectedCategory === "all" || selectedCategory === "skills") {
        results += '<h2>Skills</h2>';
        for (const character in searchState.characterSkills) {
            searchState.characterSkills[character].forEach(skill => {
                const words = skill.name.toLowerCase().split(" ");
                if (words.some(word => word.startsWith(searchValue))) {
                    results += `<p>${skill.name} (Owned by: ${character})</p>`;
                }
            });
        }
    }

    // Search achievements
    if (selectedCategory === "all" || selectedCategory === "achievements") {
        results += '<h2>Achievements</h2>';
        for (const character in searchState.characterAchievements) {
            searchState.characterAchievements[character].forEach(achievement => {
                const words = achievement.name.toLowerCase().split(" ");
                if (words.some(word => word.startsWith(searchValue))) {
                    results += `<p>${achievement.name} (Owned by: ${character})</p>`;
                }
            });
        }
    }

    // Search titles
    if (selectedCategory === "all" || selectedCategory === "titles") {
        results += '<h2>Titles</h2>';
        for (const character in searchState.characterTitles) {
            searchState.characterTitles[character].forEach(title => {
                const words = title.name.toLowerCase().split(" ");
                if (words.some(word => word.startsWith(searchValue))) {
                    results += `<p>${title.name} (Owned by: ${character})</p>`;
                }
            });
        }
    }

    // Show results or 'no results found'
    resultsDiv.innerHTML = results ? results : '<p>No results found</p>';
    console.log(JSON.stringify(searchState.characterAchievements) + " Achievements." + JSON.stringify(searchState.characterTitles) + " Titles" + JSON.stringify(searchState.characterSkills) + " Skills.");
}





