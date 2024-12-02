// DECLARATION OF SECTIONS 
const see_all_players_section = document.getElementById("all-players-section")
const players_reserve_section = document.getElementById("players-reserve")
const filtered_players_section = document.getElementById("players-filtered");
const see_all_players = document.querySelector(".see-all-players")

// DECLARATION OF BUTTONS
const see_all_players_button = document.getElementById("all-players")
const add_player_button = document.getElementById("add-player")
const close_form_button = document.getElementById("close-form")
const save_button_form = document.getElementById("save-player-button")
const clear_player_card = document.getElementById("empty-card")
const clear_all_cards_button = document.getElementById("clear-cards")

// DECLARATION OF FORM
const add_player_form = document.getElementById("add-player-form")
const form_layover = document.querySelector(".layover")
const form = document.getElementById("form")
const h2 = document.getElementById("h2")
const photo_input = document.getElementById("photo")
const position_input = document.getElementById("position")
const flag_input = document.getElementById("flag")
const logo_input = document.getElementById("logo")
const logo_div = document.getElementById("logo-div")
const flag_div = document.getElementById("flag-div")
const photo_div = document.getElementById("photo-div")
const rating_input = document.getElementById("rating");
const pace_input = document.querySelector('label[for="pace"]');
const shooting_input =  document.querySelector('label[for="shooting"]');
const passing_input = document.querySelector('label[for="passing"]');
const dribbling_input = document.querySelector('label[for="dribbling"]');
const defending_input = document.querySelector('label[for="defending"]');
const physical_input = document.querySelector('label[for="physical"]');

// DECLARATION OF VARIABLES
let dataArray = null
let editIndex = null
let currentPosition = null
let isAllPlayersSectionOpen = false
let isFilteredPlayerSectionOpen = false
let isReservePlayerSectionOpen = false
let isReserve = false
let new_player_card

// FETCHING DATA USING JSON START
async function getData(){
    try{
        const response = await fetch("assets/Data/players.json")
        if(!response.ok){
            throw new Error (`Response status: ${response.status}`)
        }
        const data = await response.json()
        dataArray = data.players
    }
    catch (error){
        console.error(error.message)
    }
}
// FETCHING DATA USING JSON END

// HANDLE TOGGLE OF ALL PLAYERS SECTION START
see_all_players_button.addEventListener("click",()=>{
    if(isAllPlayersSectionOpen == false){
        see_all_players_section.classList.remove("hidden")
        see_all_players_section.classList.add("flex")
        isAllPlayersSectionOpen = true
        displayPlayers()
    }else{
        see_all_players_section.classList.remove("flex")
        see_all_players_section.classList.add("hidden")
        isAllPlayersSectionOpen = false
    }
    updateOpenCloseSection()
})
// HANDLE TOGGLE OF ALL PLAYERS SECTION END

//HANDLE TOGGLE OF FORM START
add_player_button.addEventListener("click",()=>{
    form.reset()
    editIndex = null
    save_button_form.innerText = "Save Player"
    h2.innerText = "Add Player"
    if(editIndex == null){
        photo_div.classList.remove("hidden")
        logo_div.classList.remove("hidden")
        flag_div.classList.remove("hidden")
    }
    add_player_form.classList.remove("hidden")
})

close_form_button.addEventListener("click",()=>{
    add_player_form.classList.add("hidden")
})

form_layover.addEventListener("click",()=>{
    add_player_form.classList.add("hidden")
})

form.addEventListener("click", e => e.stopPropagation())
//HANDLE TOGGLE OF FORM END

// LABEL UPDATE FOR GOAL KEEPER CASE START
function updateLabel(){
    if(position_input.value == "GK"){
        pace_input.innerText = "Diving"
        shooting_input.innerText = "Handling"
        passing_input.innerText = "Kicking"
        dribbling_input.innerText = "Reflexes"
        defending_input.innerText = "Speed"
        physical_input.innerText = "Positioning"
    } else {
        pace_input.innerText = "Pace"
        shooting_input.innerText = "Shooting"
        passing_input.innerText = "Passing"
        dribbling_input.innerText = "Dribbling"
        defending_input.innerText = "Defending"
        physical_input.innerText = "Physical"
    }
}
position_input.addEventListener("change",updateLabel)
// LABEL UPDATE FOR GOAL KEEPER CASE END