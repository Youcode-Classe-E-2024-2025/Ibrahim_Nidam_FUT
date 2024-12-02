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

// DECLARATION OF SETS USED
const selected_player = new Set()
const reserve_selected_player = new Set()

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

// FORM HANDLING FUNCTION FOR ADDING AND EDITING THE PLAYERS START
form.addEventListener("submit", e =>{
    e.preventDefault()

    const name_input = document.getElementById("name").value.trim()
    const nationality_input = document.getElementById("nationality").value.trim()
    const club_input = document.getElementById("club").value.trim()

    // VALIDATION START
    const has_only_one_word = /^\w+$/
    const has_Numbers_Or_Special_Chars = /[^A-Za-z\s]/

    const name_test = has_Numbers_Or_Special_Chars.test(name_input)
    const club_test = has_Numbers_Or_Special_Chars.test(club_input)
    const nationality_test = has_Numbers_Or_Special_Chars.test(nationality_input)
    const nationality_one_word_test = has_only_one_word.test(nationality_input)

    if (!nationality_one_word_test){
        alert("Nationality should be one word")
        return
    }

    if (name_test || club_test || nationality_test){
        alert("name, club or nationality should not contain numbers or special characters.")
        return
    }
    // VALIDATION END

    // HANDLE EDIT START
    if (editIndex !== null){
        photo_div.classList.remove("hidden")
        logo_div.classList.remove("hidden")
        flag_div.classList.remove("hidden")
    }

    if(editIndex !== null){
        const original_player = dataArray[editIndex]
        const updated_player = {
            ...original_player,
            name: name_input,
            nationality: nationality_input,
            club: club_input,
            position: position_input.value,
            rating: rating_input.value,
        }

        // REASSIGN STATS BASED ON THE POSITION START
        if (position_input.value === "GK") {
            updated_player.diving = document.getElementById("pace").value;
            updated_player.handling = document.getElementById("shooting").value;
            updated_player.kicking = document.getElementById("passing").value;
            updated_player.reflexes = document.getElementById("dribbling").value;
            updated_player.speed = document.getElementById("defending").value;
            updated_player.positioning = document.getElementById("physical").value;
        } else {
            updated_player.pace = document.getElementById("pace").value;
            updated_player.shooting = document.getElementById("shooting").value;
            updated_player.passing = document.getElementById("passing").value;
            updated_player.dribbling = document.getElementById("dribbling").value;
            updated_player.defending = document.getElementById("defending").value;
            updated_player.physical = document.getElementById("physical").value;
        }
        // REASSIGN STATS BASED ON THE POSITION END

        selected_player.forEach(player => {
            if(player.name === original_player.name && player.position === original_player.position){
                selected_player.delete(player)

                // REMOVE FROM FIELD IF POSITION CHANGED START
                if(original_player.position !== updated_player.position){
                    const old_placeholder = document.getElementById(`${original_player.position.toLowerCase()}-placeholder`)
                    if(old_placeholder){
                        old_placeholder.innerHTML = `
                            <div class="relative items-center justify-center font-bold text-light_orange-500 hidden 680:flex">
                                <img src="assets/images/Player/Player_card.png" alt="Player Card" class="w-[90px] h-auto">
                                <div class="absolute flex items-center justify-center inset-0 cursor-pointer">
                                    <span class="flex items-center justify-center">
                                        <svg class="w-9 h-8" viewBox="0 0 36 42" fill="none">
                                            <path d="M18.6275 41.711L18.3137 41.0298C18.1146 41.1215 17.8854 41.1215 17.6863 41.0298L17.3726 41.711L17.6863 41.0298L1.18627 33.4311C0.920355 33.3087 0.75 33.0427 0.75 32.7499V8.7248C0.75 8.42506 0.928458 8.15411 1.20383 8.03575L17.7038 0.943648C17.8929 0.862375 18.1071 0.862375 18.2962 0.943648L34.7962 8.03575C35.0715 8.15411 35.25 8.42506 35.25 8.7248V32.7499C35.25 33.0427 35.0796 33.3087 34.8137 33.4311L18.3137 41.0298L18.6275 41.711Z" 
                                                stroke="currentColor" stroke-width="1.5"></path>
                                        </svg>
                                    </span>
                                    <div class="absolute text-xl font-bold text-center">+</div>
                                </div>
                            </div>
                        `
                        old_placeholder.classList.remove("flex")
                        old_placeholder.classList.add("hidden")
                    }
                    // REMOVE FROM FIELD IF POSITION CHANGED END
                } else {
                    // UPDATE WITH EDITED NEW INFORMATION START
                    const placeholder_card = document.getElementById(`${updated_player.position.toLowerCase()}-placeholder`)
                    if(placeholder_card && placeholder_card.classList.contains("flex")){
                        placeholder_card.innerHTML = `
                            <div class="relative text-light_orange-500 cursor-pointer text-[8px] font-normal hidden 680:block">
                                <img src="assets/images/Player/Player_card.png" alt="Player Card" class="w-[90px] h-auto">
                                <img class="w-14 h-14 absolute left-7 top-4" src="${updated_player.photo}" alt="">
                                <div class="flag w-2 h-2 absolute left-5 top-1/3" style="background-image: url(${updated_player.flag}); background-size: contain; background-repeat: no-repeat;"></div>
                                <p class="position absolute left-[19px] font-bold top-3">${updated_player.name} </p>
                                <p class="position absolute left-[18px] font-bold top-7">${updated_player.position}</p>
                                <p class="rating absolute left-5 top-[50px] font-bold">${updated_player.rating}</p>
                                <p class="shooting absolute left-4 top-[78px]">${updated_player.position == "GK" ? "DIV" : "SHO"} : <span>${updated_player.position == "GK" ? updated_player.diving : updated_player.shooting}</span></p>
                                <p class="pace absolute left-4 top-24">${updated_player.position == "GK" ? "HAN :" : "PAC : "}<span>${updated_player.position == "GK" ? updated_player.handling : updated_player.pace}</span></p>
                                <p class="passing absolute left-4 top-[87px]">${updated_player.position == "GK" ? "KIC : " : "PAS : "}<span>${updated_player.position == "GK" ? updated_player.kicking : updated_player.passing}</span></p>
                                <p class="dribbling absolute left-12 top-[78px]">${updated_player.position == "GK" ? "REF :" : "DRI : "}<span>${updated_player.position == "GK" ? updated_player.reflexes : updated_player.dribbling}</span></p>
                                <p class="defending absolute left-12 top-24">${updated_player.position == "GK" ? "SPD : " : "DEF : "}<span>${updated_player.position == "GK" ? updated_player.speed : updated_player.defending}</span></p>
                                <p class="physical absolute left-12 top-[87px]">${updated_player.position == "GK" ? "POS : " : "PHY : "}<span>${updated_player.position == "GK" ? updated_player.positioning : updated_player.physical}</span></p>
                            </div>
                        `
                        selected_player.add({name: updated_player.name, position: updated_player.position})
                    }
                    // UPDATE WITH EDITED NEW INFORMATION END
                }
            }
        })
        dataArray[editIndex] = updated_player
        save_button_form.innerText = "Save Player"
        h2.innerText = "Add Player"
        editIndex = null
        // HANDLE EDIT END

        // ADDING NEW PLAYER START
    }else{
        if(position_input.value == "GK"){
            new_player_card = {
                name : name_input,
                photo: photo_input.files[0] ? URL.createObjectURL(photo_input.files[0]) : "assets/images/default_images/default_profile.png",
                position : position_input.value,
                nationality : nationality_input,
                flag : flag_input.files[0] ? URL.createObjectURL(flag_input.files[0]) : "assets/images/default_images/default_flag.png",
                club : club_input,
                logo : logo_input.files[0] ? URL.createObjectURL(logo_input.files[0]) : null,
                rating : rating_input.value,
                diving : document.getElementById("pace").value,
                handling : document.getElementById("shooting").value,
                kicking : document.getElementById("passing").value,
                reflexes : document.getElementById("dribbling").value,
                speed : document.getElementById("defending").value,
                positioning : document.getElementById("physical").value,
            }
        }else{
            new_player_card = {
                name : name_input,
                photo : photo_input.files[0] ? URL.createObjectURL(photo_input.files[0]) : "assets/images/default_images/default_profile.png",
                position : position_input.value,
                nationality : nationality_input,
                flag : flag_input.files[0] ? URL.createObjectURL(flag_input.files[0]) : "assets/images/default_images/default_flag.png",
                club : club_input,
                logo : logo_input.files[0] ? URL.createObjectURL(logo_input.files[0]) : null,
                rating : rating_input.value,
                pace : document.getElementById("pace").value,
                shooting : document.getElementById("shooting").value,
                passing : document.getElementById("passing").value,
                dribbling : document.getElementById("dribbling").value,
                defending : document.getElementById("defending").value,
                physical : document.getElementById("physical").value,
            }
        }
        dataArray.push(new_player_card);
    }
    // ADDING NEW PLAYER END
    displayPlayers()
    form.reset()
    add_player_form.classList.add("hidden")
})
// FORM HANDLING FUNCTION FOR ADDING AND EDITING THE PLAYERS END

// DISPLAY ALL PLAYERS FUNCTION IN ALL PLAYERS SECTION START
function displayPlayers(){
    see_all_players.innerHTML=""
    dataArray.forEach((element,index) => {
        const div = document.createElement("div")
        div.classList.add("relative", "text-light_orange-500", "text-[8px]", "cursor-pointer")
        div.innerHTML = `
            <img src="assets/images/Player/Player_card.png" alt="Player Card" class="w-[90px] h-auto">
            <img class="w-14 h-14 absolute left-7 top-4" src="${element.photo}" alt="">
            <img class="flag w-2 h-2 absolute left-5 top-1/3" src="${element.flag}" alt="">
            <p class="position absolute left-[19px] font-bold top-3">${element.name} </p>
            <p class="position absolute left-[18px] font-bold  top-7">${element.position}</p>
            <p class="rating absolute left-5 top-[50px] font-bold ">${element.rating} </p>
            <p class="shooting absolute left-4 top-[78px]">${element.position == "GK" ? "DIV" : "SHO"} :<span>${element.position == "GK" ? element.diving : element.shooting} </span></p>
            <p class="pace absolute left-4 top-24">${element.position == "GK" ? "HAN :" : "PAC : "}<span>${element.position == "GK" ? element.handling : element.pace} </span></p>
            <p class="passing absolute left-4 top-[87px]">${element.position == "GK" ? "KIC : " : "PAS : "}<span>${element.position == "GK" ? element.kicking : element.passing} </span></p>
            <p class="dribbling absolute left-12 top-[78px]">${element.position == "GK" ? "REF :" : "DRI : "}<span>${element.position == "GK" ? element.reflexes : element.dribbling} </span></p>
            <p class="defending absolute left-12 top-24">${element.position == "GK" ? "SPD : " : "DEF : "}<span>${element.position == "GK" ? element.speed : element.defending} </span></p>
            <p class="physical absolute left-12 top-[87px]">${element.position == "GK" ? "POS : " : "PHY : "}<span>${element.position == "GK" ? element.positioning : element.physical} </span></p>
        `
        div.addEventListener("click",()=>{
            displayCardCentered(element,index)
        })
        see_all_players.appendChild(div)
    })
}
// DISPLAY ALL PLAYERS FUNCTION IN ALL PLAYERS SECTION END

// FUNCTION TO DISPLAY CARDS CENTERED TO EDIT OR DELETE START
function displayCardCentered(element,index){
    const lay_over = document.createElement("div")
    lay_over.classList.add("fixed", "inset-0", "bg-black", "bg-opacity-50", "z-50","flex", "items-center", "justify-center", "p-4")

    const container = document.createElement("div")
    container.classList.add("flex", "items-center", "space-x-4")

    const enlarged_card_div = document.createElement("div")
    enlarged_card_div.classList.add("relative", "text-light_orange-500", "text-[8px]","transform", "scale-150", "origin-center")

    enlarged_card_div.innerHTML = `
        <img src="assets/images/Player/Player_card.png" alt="Player Card" class="w-[90px] h-auto">
        <img class="w-14 h-14 absolute left-7 top-4" src="${element.photo}" alt="">
        <img class="flag w-2 h-2 absolute left-5 top-1/3" src="${element.flag}" alt="">
        <p class="position absolute left-[19px] font-bold top-3">${element.name} </p>
        <p class="position absolute left-[18px] font-bold  top-7">${element.position}</p>
        <p class="rating absolute left-5 top-[50px] font-bold ">${element.rating} </p>
        <p class="shooting absolute left-4 top-[78px]">${element.position == "GK" ? "DIV" : "SHO"} :<span>${element.position == "GK" ? element.diving : element.shooting} </span></p>
        <p class="pace absolute left-4 top-24">${element.position == "GK" ? "HAN :" : "PAC : "}<span>${element.position == "GK" ? element.handling : element.pace} </span></p>
        <p class="passing absolute left-4 top-[87px]">${element.position == "GK" ? "KIC : " : "PAS : "}<span>${element.position == "GK" ? element.kicking : element.passing} </span></p>
        <p class="dribbling absolute left-12 top-[78px]">${element.position == "GK" ? "REF :" : "DRI : "}<span>${element.position == "GK" ? element.reflexes : element.dribbling} </span></p>
        <p class="defending absolute left-12 top-24">${element.position == "GK" ? "SPD : " : "DEF : "}<span>${element.position == "GK" ? element.speed : element.defending} </span></p>
        <p class="physical absolute left-12 top-[87px]">${element.position == "GK" ? "POS : " : "PHY : "}<span>${element.position == "GK" ? element.positioning : element.physical} </span></p>
    `
    const buttons_div = document.createElement("div")
    buttons_div.classList.add("flex", "flex-col", "space-y-2")

    // HANDLE EDIT BUTTON START
    const edit_button = document.createElement("button")
    edit_button.textContent = "Edit"
    edit_button.classList.add("ml-2","bg-denim-100","border-2","border-light_orange-400", "text-white", "p-2", "w-full", "transform", "active:scale-90", "transition" ,"duration-150")
    edit_button.addEventListener("click",() => {
        add_player_form.classList.remove("hidden")
        document.body.removeChild(lay_over)
        editIndex = index
        editPlayer(editIndex)
    })
    // HANDLE EDIT BUTTON END

    // HANDLE DELETE BUTTON START
    const delete_button = document.createElement("button")
    delete_button.textContent = "Delete"
    delete_button.classList.add("ml-2","bg-light_orange-400","border-2","border-denim-100" ,"text-white", "p-2", "w-full", "transform", "active:scale-90", "transition" ,"duration-150")
    delete_button.addEventListener("click",() => {
        dataArray.splice(index,1)
        document.body.removeChild(lay_over)
        displayPlayers()
    })
    // HANDLE DELETE BUTTON END

    // HANDLE IF PLAYER REMOVED IS IN THE FIELD START
    const deleted_player_position = element.position
    const deleted_player_name = element.name
    selected_player.forEach(player => {
        if(player.name === deleted_player_name && player.position === deleted_player_position){
            selected_player.delete(player)

            const placeholder_card = document.getElementById(`${deleted_player_position.toLowerCase()}-placeholder`)
            if(placeholder_card){
                placeholder_card.innerHTML = `
                    <div class="relative items-center justify-center font-bold text-light_orange-500 hidden 680:flex">
                        <img src="assets/images/Player/Player_card.png" alt="Player Card" class="w-[90px] h-auto">
                        <div class="absolute flex items-center justify-center inset-0 cursor-pointer">
                            <span class="flex items-center justify-center">
                                <svg class="w-9 h-8" viewBox="0 0 36 42" fill="none">
                                    <path d="M18.6275 41.711L18.3137 41.0298C18.1146 41.1215 17.8854 41.1215 17.6863 41.0298L17.3726 41.711L17.6863 41.0298L1.18627 33.4311C0.920355 33.3087 0.75 33.0427 0.75 32.7499V8.7248C0.75 8.42506 0.928458 8.15411 1.20383 8.03575L17.7038 0.943648C17.8929 0.862375 18.1071 0.862375 18.2962 0.943648L34.7962 8.03575C35.0715 8.15411 35.25 8.42506 35.25 8.7248V32.7499C35.25 33.0427 35.0796 33.3087 34.8137 33.4311L18.3137 41.0298L18.6275 41.711Z" 
                                        stroke="currentColor" stroke-width="1.5"></path>
                                </svg>
                            </span>
                            <div class="absolute text-xl font-bold text-center">+</div>
                        </div>
                    </div>
                `
                placeholder_card.classList.remove("flex")
                placeholder_card.classList.add("hidden")
            }
        }
        // HANDLE IF PLAYER REMOVED IS IN THE FIELD END
    })
    buttons_div.appendChild(edit_button)
    buttons_div.appendChild(delete_button)

    container.appendChild(enlarged_card_div)
    container.appendChild(buttons_div)

    lay_over.appendChild(container)
    lay_over.addEventListener("click", e => {
        if(e.target === lay_over){
            document.body.removeChild(lay_over)
        }
    })
    document.body.appendChild(lay_over)
}
// FUNCTION TO DISPLAY CARDS CENTERED TO EDIT OR DELETE END

// FUNCTION TO POPULATE THE EDIT FORM START
function editPlayer(index){
    const player = dataArray[index]
    
    updateLabel()

    document.getElementById("name").value = player.name;
    document.getElementById("nationality").value = player.nationality;
    document.getElementById("club").value = player.club;
    document.getElementById("position").value = player.position;
    document.getElementById("rating").value = player.rating;

    if (player.position !== "GK") {
        document.getElementById("pace").value = player.pace;
        document.getElementById("shooting").value = player.shooting;
        document.getElementById("passing").value = player.passing;
        document.getElementById("dribbling").value = player.dribbling;
        document.getElementById("defending").value = player.defending;
        document.getElementById("physical").value = player.physical;
    } else {
        document.getElementById("pace").value = player.diving;
        document.getElementById("shooting").value = player.handling;
        document.getElementById("passing").value = player.kicking;
        document.getElementById("dribbling").value = player.reflexes;
        document.getElementById("defending").value = player.speed;
        document.getElementById("physical").value = player.positioning;
    }

    // HIDE PICTURE INPUTS START
    photo_div.classList.add("hidden")
    logo_div.classList.add("hidden")
    flag_div.classList.add("hidden")
    // HIDE PICTURE INPUTS END

    save_button_form.innerText = "Save Edits"
    h2.innerText = "Edit Player"
}
// FUNCTION TO POPULATE THE EDIT FORM END

// FUNCTION TO FILTER THE PLAYERS FOR FILTERED SECTION START
function getPlayersByPosition(position){
    return dataArray.filter(player => player.position === position && !Array.from(selected_player).some(item => item.name === player.name) && !Array.from(reserve_selected_player).some(item => item.name === player.name))
}
// FUNCTION TO FILTER THE PLAYERS FOR FILTERED SECTION END

// FUNCTION TO POPULATE FILTERED SECTION START
function populatePlayersSection(targetPosition){
    const players_container = filtered_players_section.querySelector(".filtered-players")
    players_container.innerHTML = ""

    const position_players = getPlayersByPosition(targetPosition)

    if(position_players.length === 0){
        filtered_players_section.classList.add("hidden")
        return
    }

    position_players.forEach(player => {
        const player_card = document.createElement("div")
        player_card.classList.add("relative", "text-light_orange-500", "text-[8px]", "cursor-pointer")

        player_card.innerHTML = `
            <img src="assets/images/Player/Player_card.png" alt="Player Card" class="w-[90px] h-auto">
            <img class="w-14 h-14 absolute left-7 top-4" src="${player.photo}" alt="">
            <div class="flag w-2 h-2 absolute left-5 top-11" style="background-image: url(${player.flag}); background-size: contain; background-repeat: no-repeat;"></div>
            <p class="position absolute left-[19px] font-bold top-3">${player.name} </p>
            <p class="position absolute left-[18px] font-bold  top-7">${player.position}</p>
            <p class="rating absolute left-5 top-[50px] font-bold ">${player.rating} </p>
            <p class="shooting absolute left-4 top-[78px]">${player.position == "GK" ? "DIV" : "SHO"} :<span>${player.position == "GK" ? player.diving : player.shooting} </span></p>
            <p class="pace absolute left-4 top-24">${player.position == "GK" ? "HAN :" : "PAC : "}<span>${player.position == "GK" ? player.handling : player.pace} </span></p>
            <p class="passing absolute left-4 top-[87px]">${player.position == "GK" ? "KIC : " : "PAS : "}<span>${player.position == "GK" ? player.kicking : player.passing} </span></p>
            <p class="dribbling absolute left-12 top-[78px]">${player.position == "GK" ? "REF :" : "DRI : "}<span>${player.position == "GK" ? player.reflexes : player.dribbling} </span></p>
            <p class="defending absolute left-12 top-24">${player.position == "GK" ? "SPD : " : "DEF : "}<span>${player.position == "GK" ? player.speed : player.defending} </span></p>
            <p class="physical absolute left-12 top-[87px]">${player.position == "GK" ? "POS : " : "PHY : "}<span>${player.position == "GK" ? player.positioning : player.physical} </span></p>
        `
        player_card.addEventListener("click", ()=>{
            const placeholder_card = document.getElementById(`${targetPosition.toLowerCase()}-placeholder`)
            const previous_player_for_position = Array.from(selected_player).find(player => player.position === targetPosition)

            if(previous_player_for_position){
                selected_player.delete(previous_player_for_position)
            }

            placeholder_card.innerHTML = `
                <div class="relative text-light_orange-500 cursor-pointer text-[8px] font-normal 680:block">
                    <img src="assets/images/Player/Player_card.png" alt="Player Card" class="w-[90px] h-auto">
                    <img class="w-14 h-14 absolute left-7 top-4" src="${player.photo}" alt="">
                    <div class="flag w-2 h-2 absolute left-5 top-1/3" style="background-image: url(${player.flag}); background-size: contain; background-repeat: no-repeat;"></div>
                    <p class="position absolute left-[19px] font-bold top-3">${player.name} </p>
                    <p class="position absolute left-[18px] font-bold top-7">${player.position}</p>
                    <p class="rating absolute left-5 top-[50px] font-bold">${player.rating}</p>
                    <p class="shooting absolute left-4 top-[78px]">${player.position == "GK" ? "DIV" : "SHO"} : <span>${player.position == "GK" ? player.diving : player.shooting}</span></p>
                    <p class="pace absolute left-4 top-24">${player.position == "GK" ? "HAN :" : "PAC : "}<span>${player.position == "GK" ? player.handling : player.pace}</span></p>
                    <p class="passing absolute left-4 top-[87px]">${player.position == "GK" ? "KIC : " : "PAS : "}<span>${player.position == "GK" ? player.kicking : player.passing}</span></p>
                    <p class="dribbling absolute left-12 top-[78px]">${player.position == "GK" ? "REF :" : "DRI : "}<span>${player.position == "GK" ? player.reflexes : player.dribbling}</span></p>
                    <p class="defending absolute left-12 top-24">${player.position == "GK" ? "SPD : " : "DEF : "}<span>${player.position == "GK" ? player.speed : player.defending}</span></p>
                    <p class="physical absolute left-12 top-[87px]">${player.position == "GK" ? "POS : " : "PHY : "}<span>${player.position == "GK" ? player.positioning : player.physical}</span></p>
                </div>
            `
            // FOR DESKTOP
            placeholder_card.classList.remove("hidden")
            placeholder_card.classList.add("flex")

            // FOR MOBILE
            placeholder_card.classList.remove("680:hidden")
            placeholder_card.classList.add("680:block")

            selected_player.add({name: player.name, position: player.position})
            filtered_players_section.classList.add("hidden")
            isFilteredPlayerSectionOpen = false
            updateOpenCloseSection()
        })
        players_container.appendChild(player_card)
    })
    filtered_players_section.classList.remove("hidden")
    isFilteredPlayerSectionOpen = true
    updateOpenCloseSection()
}
// FUNCTION TO POPULATE FILTERED SECTION END

// POSITION PLAYERS INSIDE THE FIELD FUNCTION START
const positions = ["LST", "RST", "LWM", "LCM", "RCM", "RWM", "LWB", "LCB", "RCB", "RWB", "GK"];

positions.forEach(position => {
    const placeholder_card = document.getElementById(`${position.toLowerCase()}-placeholder`)
    const text_label = document.querySelector(`.${position}-TEXT`)

    // FOR DESKTOP
    placeholder_card.addEventListener("click", () =>{
        currentPosition = position
        isAllPlayersSectionOpen = false
        isFilteredPlayerSectionOpen = true
        isReservePlayerSectionOpen = false
        populatePlayersSection(position)
        updateOpenCloseSection()
    })
    // FOR MOBILE
    text_label.addEventListener("click", () =>{
        currentPosition = position
        isAllPlayersSectionOpen = false
        isFilteredPlayerSectionOpen = true
        isReservePlayerSectionOpen = false
        populatePlayersSection(position)
        updateOpenCloseSection()
    })
})
// POSITION PLAYERS INSIDE THE FIELD FUNCTION END

// HANDLE LABLE CLICK FOR MOBILE START
positions.forEach(position => {
    handleLabelClick(position)
})

function handleLabelClick(targetPosition){
    const placeholder_card = document.getElementById(`${targetPosition.toLowerCase()}-placeholder`);
    const player_card = document.getElementById(`${targetPosition.toLowerCase()}-player-card`);
    const label = document.querySelector(`.${targetPosition}-TEXT`);

    label.addEventListener("click",event => {
        event.stopPropagation()
        if(placeholder_card.classList.contains("hidden")){
            placeholder_card.classList.remove("hidden")
            placeholder_card.classList.add("flex")
            
            if(player_card){
                player_card.classList.add("hidden")
            }
        } else {
            placeholder_card.classList.add("hidden")
            placeholder_card.classList.remove("flex")
        }
    })

    // HIDE CARDS ON CLICK OUTSIDE START
    document.addEventListener("click", event => {
        const is_outside_placeholder = !placeholder_card.contains(event.target)
        const is_outside_player_card = !player_card || !player_card.contains(event.target)
        const is_outside_label = !label.contains(event.target)
        if(is_outside_placeholder && is_outside_label && is_outside_player_card){
            placeholder_card.classList.add("hidden")
            placeholder_card.classList.remove("flex")
            if(player_card){
                player_card.classList.add("hidden")
            }
        }
    })
    // HIDE CARDS ON CLICK OUTSIDE END
}
// HANDLE LABLE CLICK FOR MOBILE END

// HANDLE TOGGLE SECTIONS START
function updateOpenCloseSection(){
    if (isAllPlayersSectionOpen) {
        see_all_players_section.classList.remove("hidden");
        filtered_players_section.classList.add("hidden");
        players_reserve_section.classList.add("hidden");
        isFilteredPlayerSectionOpen = false
        isReservePlayerSectionOpen = false
    } else if (isFilteredPlayerSectionOpen) {
        filtered_players_section.classList.remove("hidden");
        see_all_players_section.classList.add("hidden");
        players_reserve_section.classList.add("hidden");
        isReservePlayerSectionOpen = false
        isAllPlayersSectionOpen = false
    } else if (isReservePlayerSectionOpen) {
        players_reserve_section.classList.remove("hidden");
        see_all_players_section.classList.add("hidden");
        filtered_players_section.classList.add("hidden");
        isAllPlayersSectionOpen = false
        isFilteredPlayerSectionOpen = false
    } else {
        see_all_players_section.classList.add("hidden");
        filtered_players_section.classList.add("hidden");
        players_reserve_section.classList.remove("hidden");
        isAllPlayersSectionOpen = false
        isFilteredPlayerSectionOpen = false
        isReservePlayerSectionOpen = true
    }
}
// HANDLE TOGGLE SECTIONS END

// FUNCTION TO POPULATE THE RESERVE SECTION START
function populateReservePlayersSection(targetPosition){
    const players_container = filtered_players_section.querySelector(".filtered-players")
    players_container.innerHTML = ""

    const position_players = getPlayersByPosition(targetPosition)
    if(position_players.length === 0){
        filtered_players_section.classList.add("hidden")
        return
    }

    position_players.forEach(player => {
        const player_card = document.createElement("div")
        player_card.classList.add("relative", "text-light_orange-500", "text-[8px]", "cursor-pointer")

        player_card.innerHTML = `
            <img src="assets/images/Player/Player_card.png" alt="Player Card" class="w-[90px] h-auto">
            <img class="w-14 h-14 absolute left-7 top-4" src="${player.photo}" alt="">
            <div class="flag w-2 h-2 absolute left-5 top-11" style="background-image: url(${player.flag}); background-size: contain; background-repeat: no-repeat;"></div>
            <p class="position absolute left-[19px] font-bold top-3">${player.name} </p>
            <p class="position absolute left-[18px] font-bold  top-7">${player.position}</p>
            <p class="rating absolute left-5 top-[50px] font-bold ">${player.rating} </p>
            <p class="shooting absolute left-4 top-[78px]">${player.position == "GK" ? "DIV" : "SHO"} :<span>${player.position == "GK" ? player.diving : player.shooting} </span></p>
            <p class="pace absolute left-4 top-24">${player.position == "GK" ? "HAN :" : "PAC : "}<span>${player.position == "GK" ? player.handling : player.pace} </span></p>
            <p class="passing absolute left-4 top-[87px]">${player.position == "GK" ? "KIC : " : "PAS : "}<span>${player.position == "GK" ? player.kicking : player.passing} </span></p>
            <p class="dribbling absolute left-12 top-[78px]">${player.position == "GK" ? "REF :" : "DRI : "}<span>${player.position == "GK" ? player.reflexes : player.dribbling} </span></p>
            <p class="defending absolute left-12 top-24">${player.position == "GK" ? "SPD : " : "DEF : "}<span>${player.position == "GK" ? player.speed : player.defending} </span></p>
            <p class="physical absolute left-12 top-[87px]">${player.position == "GK" ? "POS : " : "PHY : "}<span>${player.position == "GK" ? player.positioning : player.physical} </span></p>
        `
        player_card.addEventListener("click", ()=> {
            const reserve_placeholder_card = document.querySelector(`.reserve-${targetPosition.toLowerCase()}-placeholder`)
            const previous_reserve_player = Array.from(reserve_selected_player).find(player => player.position === targetPosition)
            if(previous_reserve_player){
                reserve_selected_player.delete(previous_reserve_player)
            }

            reserve_placeholder_card.innerHTML = `
                <div class="relative text-light_orange-500 cursor-pointer text-[8px] font-normal 680:block">
                    <img src="assets/images/Player/Player_card.png" alt="Player Card" class="w-[90px] h-auto">
                    <img class="w-14 h-14 absolute left-7 top-4" src="${player.photo}" alt="">
                    <div class="flag w-2 h-2 absolute left-5 top-1/3" style="background-image: url(${player.flag}); background-size: contain; background-repeat: no-repeat;"></div>
                    <p class="position absolute left-[19px] font-bold top-3">${player.name} </p>
                    <p class="position absolute left-[18px] font-bold top-7">${player.position}</p>
                    <p class="rating absolute left-5 top-[50px] font-bold">${player.rating}</p>
                    <p class="shooting absolute left-4 top-[78px]">${player.position == "GK" ? "DIV" : "SHO"} : <span>${player.position == "GK" ? player.diving : player.shooting}</span></p>
                    <p class="pace absolute left-4 top-24">${player.position == "GK" ? "HAN :" : "PAC : "}<span>${player.position == "GK" ? player.handling : player.pace}</span></p>
                    <p class="passing absolute left-4 top-[87px]">${player.position == "GK" ? "KIC : " : "PAS : "}<span>${player.position == "GK" ? player.kicking : player.passing}</span></p>
                    <p class="dribbling absolute left-12 top-[78px]">${player.position == "GK" ? "REF :" : "DRI : "}<span>${player.position == "GK" ? player.reflexes : player.dribbling}</span></p>
                    <p class="defending absolute left-12 top-24">${player.position == "GK" ? "SPD : " : "DEF : "}<span>${player.position == "GK" ? player.speed : player.defending}</span></p>
                    <p class="physical absolute left-12 top-[87px]">${player.position == "GK" ? "POS : " : "PHY : "}<span>${player.position == "GK" ? player.positioning : player.physical}</span></p>
                </div>
            `
            reserve_selected_player.add({nam: player.name, position: player.position})
            filtered_players_section.classList.add("hidden");
            isFilteredPlayerSectionOpen = false
            isReserve = false
            updateOpenCloseSection()
        })
        players_container.appendChild(player_card)
    })
    filtered_players_section.classList.remove("hidden");
    isFilteredPlayerSectionOpen = true;
    isReserve = true
    updateOpenCloseSection()
}
// FUNCTION TO POPULATE THE RESERVE SECTION END

// FUNCTION THAT FILLS RESERVE FUNCTION WITH PLACEHOLDERS AND HANDLES CLICKS START
function reserveSection() {
    const reserve_section = document.querySelector(".reserve-players");

    positions.forEach(position => {
        const card_container = document.createElement("div");
        card_container.classList.add("reserve-" + position.toLowerCase() + "-placeholder", "relative","flex","flex-col","items-center","justify-center","m-2","font-bold","text-light_orange-500","cursor-pointer","transition");
        
        const card_image = document.createElement("img");
        card_image.src = "assets/images/Player/Player_card.png";
        card_image.alt = "Player Card";
        card_image.classList.add("w-[90px]", "h-auto");
        
        const position_label = document.createElement("p");
        position_label.setAttribute("data-position",position)
        position_label.textContent = position;
        position_label.classList.add("text-xs", "text-center", "text-black", "mt-1");
        
        card_container.appendChild(card_image);
        card_container.appendChild(position_label);
        
        card_container.addEventListener("click", () => {
            currentPosition = position;
            isAllPlayersSectionOpen = false;
            isReservePlayerSectionOpen = true;
            isFilteredPlayerSectionOpen = false;
            populateReservePlayersSection(position);
            updateOpenCloseSection();
        });
        
        reserve_section.appendChild(card_container);
    });
}
// FUNCTION THAT FILLS RESERVE FUNCTION WITH PLACEHOLDERS AND HANDLES CLICKS END

// FUNCTION THAT HANDLES THE CLEAR BUTTONS START 
function clearButtons(){
    // CLEAR SELECTED PLAYER START
    clear_player_card.addEventListener("click",()=> {
        if(!currentPosition) return
        const placeholder_card_selector = isReserve ? `.reserve-${currentPosition.toLowerCase()}-placeholder` : `#${currentPosition.toLowerCase()}-placeholder`
        const placeholder_card = document.querySelector(placeholder_card_selector)

        placeholder_card.innerHTML = isReserve ? `
        <img src="assets/images/Player/Player_card.png" alt="Player Card" class="w-[90px] h-auto">
        <p class="text-xs text-center text-black mt-1">${currentPosition}</p>
        ` : 
        `
        <img src="assets/images/Player/Player_card.png" alt="Player Card" class="w-[90px] h-auto">
            <div class="absolute flex items-center justify-center inset-0 cursor-pointer">
                <span class="flex items-center justify-center">
                    <svg class="w-9 h-8" viewBox="0 0 36 42" fill="none">
                        <path d="M18.6275 41.711L18.3137 41.0298C18.1146 41.1215 17.8854 41.1215 17.6863 41.0298L17.3726 41.711L17.6863 41.0298L1.18627 33.4311C0.920355 33.3087 0.75 33.0427 0.75 32.7499V8.7248C0.75 8.42506 0.928458 8.15411 1.20383 8.03575L17.7038 0.943648C17.8929 0.862375 18.1071 0.862375 18.2962 0.943648L34.7962 8.03575C35.0715 8.15411 35.25 8.42506 35.25 8.7248V32.7499C35.25 33.0427 35.0796 33.3087 34.8137 33.4311L18.3137 41.0298L18.6275 41.711Z" 
                            stroke="currentColor" stroke-width="1.5"></path>
                    </svg>
                </span>
            <div class="absolute text-xl font-bold text-center">+</div>
        </div>
        `
        const selected_set = isReserve ? reserve_selected_player : selected_player
        const player_to_remove = Array.from(selected_set).find(player => player.position === currentPosition)
        if(player_to_remove){
            selected_player.delete(player_to_remove)
        }
        currentPosition = null
        const players_section = isReserve ? document.getElementById("players-reserve") : filtered_players_section
        players_section.classList.add("hidden")
        if(isReserve){
            isReserve = false
        }
        isFilteredPlayerSectionOpen = false
        updateOpenCloseSection()
    })
    // CLEAR SELECTED PLAYER END
    
    // CLEAR ALL CARDS START
    clear_all_cards_button.addEventListener("click",()=>{
        const main_placeholders = document.querySelectorAll('[id$="-placeholder"]')
        main_placeholders.forEach(placeholder_card => {
            placeholder_card.innerHTML = `
                <img src="assets/images/Player/Player_card.png" alt="Player Card" class="w-[90px] h-auto">
                <div class="absolute flex items-center justify-center inset-0 cursor-pointer">
                    <span class="flex items-center justify-center">
                        <svg class="w-9 h-8" viewBox="0 0 36 42" fill="none">
                            <path d="M18.6275 41.711L18.3137 41.0298C18.1146 41.1215 17.8854 41.1215 17.6863 41.0298L17.3726 41.711L17.6863 41.0298L1.18627 33.4311C0.920355 33.3087 0.75 33.0427 0.75 32.7499V8.7248C0.75 8.42506 0.928458 8.15411 1.20383 8.03575L17.7038 0.943648C17.8929 0.862375 18.1071 0.862375 18.2962 0.943648L34.7962 8.03575C35.0715 8.15411 35.25 8.42506 35.25 8.7248V32.7499C35.25 33.0427 35.0796 33.3087 34.8137 33.4311L18.3137 41.0298L18.6275 41.711Z" 
                                stroke="currentColor" stroke-width="1.5"></path>
                        </svg>
                    </span>
                    <div class="absolute text-xl font-bold text-center">+</div>
                </div>
            `
        })
        selected_player.clear()
        const reserve_placeholders = document.querySelectorAll('.reserve-players [class*="-placeholder"]')
        reserve_placeholders.forEach(placeholder_card => {
            const position = placeholder_card.querySelector('.position:nth-of-type(2)').textContent
            placeholder_card.innerHTML = `
                <img src="assets/images/Player/Player_card.png" alt="Player Card" class="w-[90px] h-auto">
                <p class="text-xs text-center text-black mt-1">${position}</p>
            `
        })
        reserve_selected_player.clear()
        document.getElementById("players-reserve").classList.add("hidden")
        filtered_players_section.classList.add('hidden');
        isReservePlayerSectionOpen = false;
        isFilteredPlayerSectionOpen = false;
        updateOpenCloseSection();
    })
    // CLEAR ALL CARDS END

}
// FUNCTION THAT HANDLES THE CLEAR BUTTONS END

// FUNCTIONS TO START WITH PAGE LOAD START
document.addEventListener("DOMContentLoaded", () => {
    getData()
    updateOpenCloseSection()
    clearButtons()
    reserveSection()
})
// FUNCTIONS TO START WITH PAGE LOAD END