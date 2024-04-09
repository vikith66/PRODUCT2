const menu = document.querySelector('.menu');
const navLinks = document.querySelector('.navlinks');
const bar1= document.querySelector('#bar1');
const bar2= document.querySelector('#bar2');
const bar3= document.querySelector('#bar3');


menu.addEventListener('click',()=>{
    navLinks.classList.toggle('close');
})

