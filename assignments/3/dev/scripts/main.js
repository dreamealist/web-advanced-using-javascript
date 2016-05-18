window.onload = function () {
    'use strict';

    var menu = document.getElementById('menu-trigger--container');
    var content = document.getElementById('menu');


    function toggleVeggieburger () {
        if (menu.getAttribute('data-open')) {
            menu.removeAttribute('data-open');
            content.style.top = '-100vh';
        } else {
            menu.setAttribute('data-open', true);
            content.style.top = '0px';
        }
    }
    menu.addEventListener('click', toggleVeggieburger, false);

    var bg = document.getElementById('container');

    function change (e){
        var x = e.clientX - (screen.width/2);
        var y = e.clientY - (screen.height/2);

        var newvalueX = x * -0.05;
        var newvalueY = y * -0.05;
        
        bg.style.top = newvalueY + 'px';
        bg.style.left = newvalueX + 'px';   
    }

    bg.addEventListener('mousemove', change, false);

    var button = document.getElementById('data');
    var collection = document.getElementsByTagName('li')[1];
    var about = document.getElementById('about');

    function showCollection (){
        
        about.style.display = 'block';
        about.style.top = 0;
        about.style.marginTop = 0;
        about.style.zIndex = 10;
        if (menu.getAttribute('data-open')) {
            menu.removeAttribute('data-open');
            content.style.top = '-100vh';
        } 
        art.style.display = 'none';
    }

    button.addEventListener('click', showCollection, false);    
    collection.addEventListener('click', showCollection, false);

    var art = document.getElementById('artworks');
    var navArt = document.querySelectorAll('#menu > ul > li');
    var navSub = document.querySelectorAll('#artworks > ul > li');
    var pageLink = document.querySelectorAll('#artworks > div');

    function showArt (e){
        if (menu.getAttribute('data-open')) {
            menu.removeAttribute('data-open');
            content.style.top = '-100vh';
        }
        var clicked = e.target;
        var link = clicked.currentTarget;

        for(var i = 3; i < navArt.length; i++){
            if(i === link){
                art.style.display = 'block';
                art.style.top = 0;
                pageLink[i-3].style.visibility = 'visible';
                about.style.display = 'none';
            }else{
                pageLink[i-3].style.visibility = 'hidden';
            }           
        }
    }

    function showArt2 (e){
        var clicked = e.target;
        var link = clicked.currentTarget;

        for(var i = 0; i < navSub.length; i++){
            if(i === link){
                pageLink[i].style.visibility = 'visible';
                navSub[i].style.borderBottom = '1px solid black';
                navSub[i].style.width = '60px';    
                about.style.display = 'none';
                
            }else{
                pageLink[i].style.visibility = 'hidden';
                navSub[i].style.borderBottom = '1px solid transparent';
                navSub[i].style.width = '0px';
                
            }           
        }
    }

    for( var i = 0; i < navArt.length; i++){
        var nav = navArt[i];
        nav.addEventListener('click', showArt, false);
        nav.currentTarget = i;
    }
    for( var j = 0; j < navSub.length; j++){
        var nav2 = navSub[j];
        nav2.addEventListener('click', showArt2, false);
        nav2.currentTarget = j;
    }


    
};
