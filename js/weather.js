window.onload = function () {
  setTimeout (function () {
  scrollTo(0, 0);
  }, 20);
}

// main slider

let swiper = new Swiper('.swiper-container');

// weather_timezone effect

var tz_offset = $('#weather_timezone').offset();
$(window).scroll(function () {
    if ($(window).scrollTop() > tz_offset.top - 300) {
        $('#weather_main, #weather_sub')
            .css("opacity", "0")
            .css('transition', 'all 0.2s linear');
    } else {
        $('#weather_main, #weather_sub')
            .css("opacity", "1")
            .css('transition', 'all 0.8s ease');
    }
    if ($(window).scrollTop() === tz_offset.top) {
      $('#weather_timezone').css('background','rgba(0, 0, 0, 0.12)').css('transition','all 0.8s linear');
    } else {
      $('#weather_timezone').css('background','transparent').css('transition','all 0.2s linear');
    }
});

// rain effect

var nbDrop = 858; 

function randRange( minNum, maxNum) {
  return (Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum);
}

function createRain() {

	for( i=1;i<nbDrop;i++) {
	var dropLeft = randRange(0,2000);
	var dropTop = randRange(-1000,1400);

	$('.rain').append('<div class="drop" id="drop'+i+'"></div>');
	$('#drop'+i).css('left',dropLeft);
	$('#drop'+i).css('top',dropTop);
	}
}

createRain();

// now date
let now = new Date();
let year = now.getFullYear();
let month_arr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
let month = month_arr[now.getMonth()];
let date = now.getDate();
let day_arr = ['SUN', 'MON', 'TUE', 'THU', 'WEN', 'FRI', 'SAT'];
let day = day_arr[now.getDay()];
let hours = now.getHours();
let minutes = ('00' + now.getMinutes()).slice(-2);
let fullDate = year + '.' + month + '.' + date + '.' + day;
let fullTime = hours + ':' + minutes;

// GPS

let longitude,latitude;

  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    console.log("Geolocation is not supported by this browser.");
  } 

  function showPosition(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;


    console.log(latitude);
    console.log(longitude);


    // API ?????? URL ?????? 

let url = 'http://api.openweathermap.org/data/2.5/weather?lat=' + latitude + '&lon=' + longitude + '&units=metric&appid=1f5db96c55e3ed2d7c867bd727652038';

$.getJSON(url, function (data) {

  let sys = data.sys; // ?????????, ??????/??????
  let city = data.name; // ?????????
  let city_id = data.id; // ????????? id ??????
  let weather = data.weather; // ?????? ??????
  let main = data.main; // ?????? ?????? ?????? ??????
  let wmain = weather[0].main; // ?????? ??????(Cloudiness)
  let w_id = weather[0].id; // ?????? ?????? id ??????
  let icon = weather[0].icon; // ?????? ????????? ??????
  let country = sys.country; // ?????????
  let temp = main.temp; // ?????? ??????
  let temp_max = main.temp_max; // ?????? ??????
  let temp_min = main.temp_min; // ?????? ??????
  let feelsLike = main.feels_like; // ?????? ??????
  let humidity = main.humidity; // ??????
  let icon_url = "https://openweathermap.org/img/wn/" + icon;
  let sunrise = sys.sunrise; // ??????
  let todaySunrise = sunInfoResult(sunrise);
  let sunset = sys.sunset; // ??????
  let todaySunset = sunInfoResult(sunset);
  let windDeg = data.wind.deg; // ??????
  let windSpeed = data.wind.speed; // ??????
  let lat = data.coord.lat; // ??????
  let lon = data.coord.lon; // ??????

  console.log(lat + ' , ' + lon);

  function sunInfoResult(ft) {
    let st = new Date(ft * 1000);
    let cHours = st.getHours();
    let cMinutes = ('00' + st.getMinutes()).slice(-2);
    return `${cHours}:${cMinutes}`;
  }
  

  let timezone_url = 'https://api.openweathermap.org/data/2.5/onecall?lat='+ lat +'&lon='+ lon +'&units=metric&appid=1f5db96c55e3ed2d7c867bd727652038';
  
  $.getJSON(timezone_url, function (c) {
    
    let rainFall = c.hourly[0].pop; // ????????????
    // console.log(parseInt(rain * 100));
    $('.rainFall>p').append(parseInt(rainFall) * 100 + '%');

    function convertTime(t) {
      let st = new Date(t * 1000);
      let cHours = st.getHours();
      return cHours;
    }

    function convertDay(d) {
      let st = new Date(d * 1000);
      let cDay = st.getDay();
      return cDay;
    }

    for (let i = 0; i < 48; i++) {
      let hTime = c.hourly[i].dt;
      let hTemp = c.hourly[i].temp;
      let hIcon = c.hourly[i].weather[0].icon;

      let currentTime = convertTime(hTime);

      if (i === 0) {
        currentTime = 'Now';
      }

      let hourly = '<div id="weather_hourly">' + '<p class="hourly_time">' + currentTime + '</p>' + '<figure class="hourly_icon">' + '<img src="images/' + hIcon + '.png">' + '</figure>' + '<p class="hourly_temp">' + parseInt(hTemp) + '&deg' + '</p>' + '</div>';
      
      $('.hourly_tab').append(hourly);


    }

    for (let j = 0; j <= 5; j++) {
      let dTime = c.daily[j].dt;
      let dIcon = c.daily[j].weather[0].icon;
      let dTemp_max = c.daily[j].temp.max;
      let dTemp_min = c.daily[j].temp.min;

      let currentDay = convertDay(dTime);
      let dDay = day_arr[currentDay];
      
      if (j === 0) {
        dDay = 'Today';
      }

      let daily = '<div id="weather_daily"> <div class="daily_day">' + dDay + '</div> <div class="daily_icon">' + '<img src="images/' + dIcon + '.png">' + '</div> <div class="daily_temp_max">' + parseInt(dTemp_max)+'&deg max' + '</div> <div class="daily_temp_min">' + parseInt(dTemp_min)+ '&deg min' + '</div> </div>';
      
      $('.daily_wrap').append(daily);

    }

  });
  
$('#bg').html("<img src='images/" + icon + "_bg.jpg'>");
$('#bg_intro').css('display','none');
$('.time .fullDate').html(fullDate);
$('.time .fullTime').html(fullTime);
$('#weather_main>.city').html(city + '/' + country);
$('#weather_main .icon').html("<img src='images/" + icon + ".png'>");
$('#weather_main .w_id').html(wmain);
$('#weather_main .temp').html(parseInt(temp) + '&deg;');
$('.sunrise>p').append(todaySunrise);
$('.sunset>p').append(todaySunset);
$('.temp_max>p').append(parseInt(temp_max) + '&deg;');
$('.temp_min>p').append(parseInt(temp_min) + '&deg;');
$('.feelsLike>p').append(parseInt(feelsLike) + '&deg;');
$('.humidity>p').append(humidity + '%');
$('.wind>p').append(parseInt(windSpeed) + 'm/s');




    
    if (icon.charAt(2) === 'n') {
      $('#weather_main, #weather_sub').css('color','#fff');
      $('.star').css('display','block');
      $('.wind_black').css('display','none');
      $('.wind_white').css('display','block');
      $('.feelsLike_black').css('display','none');
      $('.feelsLike_white').css('display','block');
    } else {
      $('#weather_main #weather_sub').css('color','#000');
      $('.star').css('display','none');
      $('.wind_black').css('display','block');
      $('.wind_white').css('display','none');
      $('.feelsLike_black').css('display','block');
      $('.feelsLike_white').css('display','none');
    }

    if (icon === '01d' || icon === '02d') {
      $('.sun').css('display','block');
    } else {
      $('.sun').css('display','none');
    }

    if (icon === '02d' || icon === '02n' || icon === '03d' || icon === '03n' || icon === '10d' || icon === '10n') {
      $('.clouds').css('display','block');
    } else {
      $('.clouds').css('display','none');
    }

    if (icon === '04d' || icon === '04n' || icon === '09d' || icon === '09n' || icon === '11d' || icon === '11n' || icon === '13d' || icon === '13n' || icon === '50d' || icon === '50n') {
      $('.d_clouds').css('display','block');
    } else {
      $('.d_clouds').css('display','none');
    }

    if (icon === '50d' || icon === '50n') {
      $('.smog').css('display','block');
    } else {
      $('.smog').css('display','none');
    }

    if (icon === '09d' || icon === '09n' || icon === '10d' || icon === '10n') {
      $('.rain').css('display','block');
    } else {
      $('.rain').css('display','none');
    }

    if (icon === '13d' || icon === '13n') {
      $('.snowflakes').css('display','block');
    } else {
      $('.snowflakes').css('display','none');
    }

    $('#weather_info').css('opacity','1')
    .css('transition','all 0.6s linear');


    $('.text_logo').css('opacity','0').css('transition','all 0.3s ease-in-out');
    $('.symbol_logo').css('opacity','1').css('transition','all 0.8s ease-in-out 1s');

    
});
   
}
