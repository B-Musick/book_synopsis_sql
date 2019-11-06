let foldableMenuButton = document.getElementById('fold-down-menu-icon-nav');
let navBarItems = document.getElementById('nav-bar-items');

let menuShown = false;

foldableMenuButton.addEventListener('click',()=>{
    if(!menuShown){
        navBarItems.style.display = 'inline-table';
        menuShown = true;
    }else{
        navBarItems.style.display = 'none';
        menuShown = false;
    }

})