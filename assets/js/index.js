// DECLARATION OF SECTIONS 
const seel_all_players_section = document.getElementById("all-players-section")
const players_reserve_section = document.getElementById("players-reserve")
const filtered_players_section = document.getElementById("players-filtered")
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