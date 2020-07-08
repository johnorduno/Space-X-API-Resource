//Let me know my code is running
console.log('hello from spacex.js');

//Define elements
const latest = document.getElementById('latestMissionContainer');
const upcoming = document.getElementById('upcomingMissionContainer');
const body = document.getElementById('missionContainer');
const history = document.getElementById('historyContainer');
const home = document.getElementById('homeContainer');
const latestBtn = document.getElementById('latest');
const upcomingBtn = document.getElementById('upcoming');
const previousBtn = document.getElementById('previous');
const homeBtn = document.getElementById('home');
const pagDiv = document.getElementById('pagination');

//Pagination variables
let rows = 10;
let current_page = 1;
let pages = 0;

//Navigation button event listeners
latestBtn.addEventListener("click", (e) => {
    switchData(e);
});
upcomingBtn.addEventListener("click", (e) => {
    switchData(e);
}); 
previousBtn.addEventListener("click", (e) => {
    switchData(e);
    //pagination code
    let missions = []
    let missionList = document.getElementsByClassName('nonUpcoming');
    for(var i=0;i<missionList.length;i++) {missions.push(missionList[i])};
    for(var i=0;i<missions.length;i++){missions[i].style.display = "none"};
    let pages = Math.ceil(missions.length / rows);
    displayPage(current_page,missions,rows);
    setupPagination(pagDiv,pages,current_page,missions);
}); 
homeBtn.addEventListener("click", (e) => {
    switchData(e);
}); 

//Turn off latest page initially
latest.style.display = "none";

//Fetch single latest mission
fetch('https://api.spacexdata.com/v3/launches/latest')
    .then(results => results.json())
    .then(data => {
        latestMissionDiv = document.createElement('div');
        latestPatch = (data.links.mission_patch != null) ? data.links.mission_patch : "";
        payload = "";
        payloads = data.rocket.second_stage.payloads.forEach( item =>{
            payload += item.payload_type + ": " + item.payload_id + "  Weight: "+ item.payload_mass_lbs + " lbs.<br>";
        });
        date = parseDate(data);
        latestMissionDiv.innerHTML = `
            <div class="latest-heading">
                <h1>Space-X Flight No. ${data.flight_number}</h1><br>
                <h2>Mission:  ${data.mission_name}</h2>
                <img class="latestPatch" src="${latestPatch}">
            </div>
            <div class="bg-dark latest-details">
                <p>
                    <h4>Mission Details:</h4><br>
                    ${data.details}
                </p>
                <p>
                    <h5>Launch Site:</h5>
                    ${data.launch_site.site_name_long}<br><br>
                    <h5>Launch Date (Local):</h5>
                    ${date}<br><br>
                    <h5>Payloads:</h5>
                    ${payload}<br>
                    <h5>Rocket:</h5>
                    ${data.rocket.rocket_name}<br><br>
                    <h5>Links:</h5>
                    <a class="btn btn-dark" href="${data.links.wikipedia}"> Visit this launch's Wikipedia page.</a><br>
                    <a class="btn btn-dark" href="${data.links.reddit_launch}">Visit the official Reddit launch discussion.</a><br>
                </p>
                <div class="video-container">
                    <iframe width="300" height="300" 
                        src="https://www.youtube.com/embed/${data.links.youtube_id}" 
                        frameborder="0" allow="accelerometer; autoplay; 
                        encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen>
                    </iframe>
                </div>     
            </div>
        `
        latest.appendChild(latestMissionDiv);
    })

//Fetch list of all flights
fetch('https://api.spacexdata.com/v3/launches')
    .then(results => results.json())
    .then(data => data.forEach(flight =>{
        missionDiv = document.createElement('div');
        missionDiv.className = "missionDiv bg-dark";
        patch = (flight.links.mission_patch != null) ? flight.links.mission_patch : "";
        details = (flight.details != null)?flight.details:"No mission details are available.";
        payload = "";
        payloads = flight.rocket.second_stage.payloads.forEach( item =>{
            payload += item.payload_type + ": " + item.payload_id + "  Weight: "+ item.payload_mass_lbs + " lbs.<br>";
        });
        date = parseDate(flight);
        missionDiv.innerHTML = `
            <div class="homeTitle">
                <img class="patch" src="${patch}">
                <h1>Flight No. ${flight.flight_number} <br> Mission: ${flight.mission_name}</h1>
            </div>
            <br><h4>Mission Details:</h4>
            ${details}
            <h5>Launch Site:</h5>
            ${flight.launch_site.site_name_long}<br><br>
            <h5>Launch Date (Local):</h5>
            ${date}<br><br>
            <h5>Payloads:</h5>
            ${payload}<br>
            <h5>Rocket:</h5>
            ${flight.rocket.rocket_name}<br><br>
            <h5>Links:</h5>
            <a class="btn btn-dark" href="${flight.links.wikipedia}"> Visit this launch's Wikipedia page.</a><br>
            ${(flight.links.reddit_launch != null) ? '<a class="btn btn-dark" href="' + 
                flight.links.reddit_launch + 
                '">Visit the official Reddit launch discussion.</a><br>' : ""}
            <a class="btn btn-dark" href="${flight.links.video_link}"> Visit this launch's YouTube video.</a><br>
        `
        if (!flight.upcoming) {
            //list in previous missions
            missionDiv.className = "missionDiv bg-dark nonUpcoming"
            body.appendChild(missionDiv)  
        }else{
        //List in upcoming missions    
            missionDiv.innerHTML = `
                <div class="homeTitle">
                    <h1>Flight No. ${flight.flight_number}
                    <br>Mission:  ${flight.mission_name}</h1><br>
                </div>
                <br><h5>Mission Details:</h5><br>
                ${details}
            `
            upcoming.appendChild(missionDiv);
        }
    }))

//********************************************************************************** Functions

//parse date function
function parseDate(data){
        dateRaw = data.launch_date_local.split("-");
        dayTime = dateRaw[2].split("T");
        dt = dayTime[1].split("+");
        if(dt.length > 1){
            time = dt[1];
        }else{
            time = dayTime[1];
        }
        //dayTime = dayTime[0];
        year = dateRaw[0];
        month = dateRaw[1];
        day = dayTime[0];
        date = `${month}/${day}/${year} ${time}`;
        return date;
}

//Function to change the data displayed when a button is clicked
function switchData(e) {
    if(e.target.id == "latest"){
        changeStyle("none","block","none","none","none");
    }else if(e.target.id == "upcoming"){
        changeStyle("none","none","block","none","none");
    }else if(e.target.id == "previous"){
        changeStyle("none","none","none","block","block");
    }else {
        changeStyle("block","none","none","none","none");
     }
}

function changeStyle(a,b,c,d,e){
    home.style.display = a;
    latest.style.display = b;
    upcoming.style.display = c;
    body.style.display = d;
    pagDiv.style.display = e;
    scroll(0,0);
}

//pagination functions
function displayPage(page,missions,rows) {
    for(let i=0;i<missions.length;i++){missions[i].style.display = "none"};
    page -= 1;
    let start = rows * page;
    let end = start + rows;
    let paginatedItems = missions.slice(start,end);
    for(let i = 0;i<paginatedItems.length;i++){paginatedItems[i].style.display = "block"};
}

function setupPagination(wrapper,numPages,currentPage,items) {
    wrapper.innerHTML = "";
    let numButtons = numPages;
    for(var i = 1;i < numButtons+1; i++){
        let btn = createButton(i,items);
        btn.className = "btn btn-dark pagButton";
        if(i == currentPage){btn.className = "btn btn-dark pagButton active"}
        wrapper.appendChild(btn);
    }
}

function createButton(page,items){
    let button = document.createElement('button');
    button.innerText = page;
    button.addEventListener('click',(e)=>{
        let pages = Math.ceil(items.length / rows)
        displayPage(page,items,rows)
        setupPagination(pagDiv,pages,page,items);
        scroll(0,0);
    });
    return button;
}

