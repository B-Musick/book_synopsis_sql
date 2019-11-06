let dropdownButton = document.getElementById('fold-down-menu-icon');
let dropdownMenu = document.getElementById('i-books-left-column');
let synopsisText = document.getElementById('books-previews-container');
let synopsisContainer = document.getElementById('books-previews-nav-container');

let turnedOn = false;
dropdownButton.addEventListener('click', ()=>{
    if(!turnedOn){
        /* When click sandwich, want the menu to toggle on and off */
        dropdownMenu.style.display = 'block';
        synopsisContainer.style.display = 'grid';
        /* So text doesnt move right when select dropdown*/
        synopsisText.style.marginLeft = '0';
        turnedOn = true;
    }else{
        /* When click sandwich, want the menu to toggle on and off */
        dropdownMenu.style.display = 'none';
        synopsisContainer.style.display = 'block';
        /* So text doesnt move right when select dropdown*/
        synopsisText.style.marginLeft = '15vw';
        turnedOn = false;
    }


});