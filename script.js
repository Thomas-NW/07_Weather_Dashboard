let localTime = $("#currentDay").text(moment().format('LLLL'));  // https://momentjs.com/

var API_KEY = "166a433c57516f51dfab1f7edaed8413";  // https://openweathermap.org/api
var API_KEY_5 = "3516c22912dbf7dbcec29f9ef443bced"; // https://home.openweathermap.org/api_keys

var searchhistory = JSON.parse(localStorage.getItem('history')) || [];

$(document).ready(function () {

    genbutton();
    $("#search-button").on("click", function () {
        // alert("Hello") works 
        let city = $("#search-value").val();    //#search-value == search field entrance value in markup
        searchhistory.push(city);
        genbutton();
        localStorage.setItem('history', JSON.stringify(searchhistory));
        searchCityWeather(city);                 //calls for the value in the ajax request.
        search5DayWeather(city);
    });


    function searchCityWeather(city) {
        $.ajax({             //https://www.tutorialspoint.com/ajax/what_is_ajax.htm
            type: "GET",     // [OpenWeather API](https://openweathermap.org/api)
            url: `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=imperial`,
            datatype: "json",
            success: function (data) {
                console.log(data);
                // addCity = $("#tw-city_name").text(data["name"] + " " + ["dt"]);
                var unixTime = data["dt"];
                var timeEL = new Date(unixTime * 1000);
                $("#tw-city_name").text(data["name"] + " " + timeEL);
                $("#tw-temp").text("Temperature: " + data["main"]["temp"]);
                $("#tw-humidity").text("Humidity: " + data["main"]["humidity"]);
                $("#tw-wind").text("Wind Speed: " + data["wind"]["speed"]);
                //    $("#tw-uv").text("UV Level: " + data["main"]["temp"]);
            }
        })
    }


    function search5DayWeather(list) {
        $.ajax({             //https://www.tutorialspoint.com/ajax/what_is_ajax.htm
            type: "GET",     // [OpenWeather API](https://openweathermap.org/api)
            url: `https://api.openweathermap.org/data/2.5/forecast?q=${list}&appid=${API_KEY_5}&units=imperial`,
            datatype: "json",
            success: function (data) {
                console.log(data);
                $("#weekday").empty();
                for (var i = 0; i < 5; i++) {
                    // var timeEL = $("<p></p>").text(data["list"][i]["dt"]); // for reference only! no conversion to standard time
                    var unixTime = data["list"][i]["dt"];
                    var timeEL = new Date(unixTime * 1000);
                    var iconEL = $("<img></img>").attr("src", `http://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png`);
                    var tempEL = $("<p></p>").text(data["list"][i]["main"]["temp"] + " F");
                    var humEL = $("<p></p>").text(data["list"][i]["main"]["humidity"] + " %");
                    var divcol = $("<div></div>");
                    divcol.addClass("weekday");
                    divcol.addClass("col");
                    divcol.append(timeEL);
                    divcol.append(iconEL);
                    divcol.append(tempEL);
                    divcol.append(humEL);
                    $("#weekday").append(divcol);

                }
            }
        })
    }

    function genbutton() {
        $(".history").empty();
        for (var i = 0; i < searchhistory.length; i++) {
            var cityButtonEL = $("<li></li>").text(searchhistory[i]);
            cityButtonEL.on("click", function () {
                searchCityWeather($(this).text());
                search5DayWeather($(this).text());
                //call the main search weather function - pass in this.text
            });
            $(".history").append(cityButtonEL);

        }
    }
});

