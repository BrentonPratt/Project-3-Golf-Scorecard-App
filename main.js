let courseList;
let myCourse;
let numholes = 18;
let outHoles = 9;
let inHoles = 18;
let numPlayers;
let globalTee;
let parSum = 0;
let yardSum = 0;
let myOutScore = 0;


function getInfo(){
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            courseList = JSON.parse(this.responseText);
            console.log(courseList);
            for (let i = 0; i < courseList.courses.length; i++){
                $("#courseSelect").append("<option value = '"+ courseList.courses[i].id +"'>"+ courseList.courses[i].name +"</option>")
            }
        }
    };
    xhttp.open("GET", "https://golf-courses-api.herokuapp.com/courses", true);
    xhttp.send();
}

function loadCourse(courseID) {
    console.log(courseID);
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200){
            myCourse = JSON.parse(this.responseText);
            console.log(myCourse);

            let teeArray = myCourse.data.holes[0].teeBoxes;
            for (let i = 0; i < teeArray.length; i++){
                $("#teeSelect").append("<option value='"+ i +"'>"+ teeArray[i].teeType +"</option>")
            }
        }
    };
    xhttp.open("GET", "https://golf-courses-api.herokuapp.com/courses/"+courseID, true);
    xhttp.send();
}

function hideModal() {
    $(".modal").hide();
    makeCard();
}

function chooseTee(teeValue) {
    globalTee = teeValue;

}

function makeCard() {
    $(".players").append("<div class='names'>Players</div>");
    for (let i = 1; i <= outHoles; i++){
        $(".leftCard").append("<div id='col"+ i +"' class='column'>" + i +"</div>");
    }
    $(".leftCard").append("<div id='outCol' class='column'>Out</div>");
    for (let n = 10; n <= inHoles; n++){
        $(".rightCard").append("<div id='col"+ n +"' class='column'>" + n +"</div>");
    }
    $(".rightCard").append("<div id='inCol' class='column'>In</div>");
    $(".rightCard").append("<div id='totalCol' class='column'>Total</div>");
    addHoles();
}

function addHoles() {
    numPlayers = $(".numInput").val();
    for(let p = 1; p <= numPlayers; p++){
        $(".players").append("<div class='playerBox'><span contenteditable='true'>Player "+ p +"</span><i class=\"Trash fas fa-trash-alt\""+ p +"></i></div>");
        $("#outCol").append("<div class='out' id='out"+ p +"'></div>");
        $("#inCol").append("<div class='in' id='in"+ p +"'></div>");
        $("#totalCol").append("<div class='total' id='total"+ p +"'></div>");
        for(let h = 1; h <= numholes; h++){
            $("#col"+ h).append("<input class='hole"+ p +"' type='number' id='p"+ p +"h"+ h +"'>");
        }
    }
    $(".players").append('<div class="infoBox" id="par">Par</div>');
    $(".players").append('<div class="infoBox" id="yardage">Yardage</div>');
    $(".players").append('<div class="infoBox" id="handicap">Handicap</div>');
    $("#totalCol").append('<div class="totalBox" id="parTotal"></div>');
    $("#totalCol").append('<div class="totalBox" id="yardTotal"></div>');
    $(".content").css("filter", "blur(0)");
    $(".Trash").click(function(){
        $(this).parent().animate({
            opacity: 0,
        }, 1000, function(){
            $(this).remove();

        });
    });
    for(let h = 0; h < numholes; h++){
        $("#col"+ (h + 1)).append('<div class="parBox">'+ myCourse.data.holes[h].teeBoxes[globalTee].par +'</div>');
        $("#col"+ (h + 1)).append('<div class="yardBox">'+ myCourse.data.holes[h].teeBoxes[globalTee].yards +'</div>');
        $("#col"+ (h + 1)).append('<div class="hcpBox">'+ myCourse.data.holes[h].teeBoxes[globalTee].hcp +'</div>');
    }
    $('.parBox').each(function () {
        parSum += (+ $(this).text());
    });

    $('#parTotal').text(parSum);

    $('.yardBox').each(function () {
        yardSum += (+ $(this).text());
    });

    $('#yardTotal').text(yardSum);

    $('.hole')
}

function addOutScore(myid) {
    let myOutScore = 0;
    myid = $('.hole').attr('id').match(/\d+/)[0];
    for(let i = 1; i <= outHoles; i++){
        let scoreItem = $('#p' + myid + 'h' + i).val();
        myOutScore += scoreItem;
    }
    console.log('p'+ myid +' out score is: '+ myOutScore);
    return myOutScore;
}