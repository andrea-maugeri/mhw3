let index;
let token;
const api_key = '27053672-e7ac5e828954a141a74294e33';
const client_secret= '039403ac04934579b3ca82fd9217827c';
const client_id= 'c898b078925d4e5f997afceb4cf7ca6d'; 

const tasti = document.querySelectorAll(".api_pixabay");
for(let tasto of tasti){
    tasto.addEventListener('click',api_pixabay);
}

const spotify_button = document.querySelector('#spotify_content');
spotify_button.addEventListener('click',spotifyHandler);



fetch('https://accounts.spotify.com/api/token', 
{
  method: "post",
  body: 'grant_type=client_credentials',
  headers:
  {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret)
  }
}
).then(onResponse).then(onTokenJson);

function api_pixabay(event){
    event.currentTarget.textContent= "HIDE IMAGES";
    const div_images= event.currentTarget.parentNode.querySelector('.images_hidden');
    div_images.classList.remove('images_hidden');
    div_images.classList.add('show_images');
    event.currentTarget.removeEventListener('click',api_pixabay);
    event.currentTarget.addEventListener('click',chiudi_images_box);
    const stringa_fetch = "https://pixabay.com/api/?key=" + api_key + "&q=" + div_images.dataset.keyword + "&per_page=6"
    index=div_images.dataset.index;
    fetch(stringa_fetch).then(onResponse).then(onJsonImage);
}

function onResponse(response){
    return response.json();
}
function onJsonImage(json){
    const imgs = json.hits;
    const str = "div[data-index='" + index + "']";
    const box= document.querySelector(str);
    for(const img of imgs){
      const image = document.createElement('img');
      image.src= img.webformatURL;
      box.appendChild(image);
    }
}

function chiudi_images_box(event){
    event.currentTarget.textContent= "GET MORE IMAGES";
    const div_images= event.currentTarget.parentNode.querySelector('.show_images');
    div_images.innerHTML="";
    div_images.classList.remove('show_images');
    div_images.classList.add('images_hidden');
    event.currentTarget.removeEventListener('click',chiudi_images_box);
    event.currentTarget.addEventListener('click',api_pixabay);
}

function chiudi_images_box_spotify(event){
    event.currentTarget.textContent= "CLICCA QUI PER OTTENERE CONSIGLI MUSICALI PER LE TUE VACANZE SICILIANE";
    const div_images_spotify= event.currentTarget.parentNode.querySelector('.show_images');
    div_images_spotify.innerHTML="";
    div_images_spotify.classList.remove('show_images');
    div_images_spotify.classList.remove('box_spotify');
    div_images_spotify.classList.add('images_hidden');
    event.currentTarget.removeEventListener('click',chiudi_images_box_spotify);
    event.currentTarget.addEventListener('click',spotifyHandler);
}

function onTokenJson(json){
    token = json.access_token;
}

function spotifyHandler(event){
  event.currentTarget.textContent= "NASCONDI CONSIGLI MUSICALI";
  const div_images_spotify= event.currentTarget.parentNode.querySelector('.images_hidden');
  div_images_spotify.classList.remove('images_hidden');
  div_images_spotify.classList.add('show_images');
  event.currentTarget.removeEventListener('click',spotifyHandler);
  event.currentTarget.addEventListener('click',chiudi_images_box_spotify);
  fetch("https://api.spotify.com/v1/playlists/1IlGG0JTFJSTE59wEgbGjA/tracks",
  {
    headers:
    {
      'Authorization': 'Bearer ' + token,
      'Content-Type' : 'application/json'
    }
  }
  ).then(onResponse).then(onSpotifyJsonHandler);
}

function onSpotifyJsonHandler(json){
  const box= document.querySelector('#spotify_box');
  box.classList.add('box_spotify');
  for(let i=0;i<5;i++){
    const div = document.createElement('div');
    box.appendChild(div);

    const image = document.createElement('img');
    image.classList.add('thumbnail');
    image.src= json.items[i].track.album.images[2].url;
    div.appendChild(image);

    const text1= document.createElement('div');
    text1.classList.add('text_content')
    const text2= document.createElement('div');
    const text3= document.createElement('div');
    text2.textContent = json.items[i].track.name;
    text3.textContent = json.items[i].track.artists[0].name;
    text2.classList.add('spotify_text1');
    text3.classList.add('spotify_text2');
    div.appendChild(text1);
    text1.appendChild(text2);
    text1.appendChild(text3);
    
    const link = document.createElement('a');
    link.href = json.items[i].track.external_urls.spotify;
  
    const play_button = document.createElement('img');
    play_button.classList.add('play_button');
    play_button.src = "./play_button.gif"
  
    link.appendChild(play_button);
    div.appendChild(link);

  }
}


