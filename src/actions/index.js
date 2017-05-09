import axios from 'axios';
import $ from 'jquery';
import { browserHistory } from 'react-router';
import { AUTH_ERROR, AUTH_USER, UNAUTH_USER, FETCH_EVENTS, SAVE_LOCATION, FETCH_WEATHER, FETCH_FITBIT, STORE_INTERESTS } from './types';


const instance = axios.create({
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
});

//const base_url = 'http://localhost:8888/server';
const base_url = './backend/server';


export function register_user({ username, password, email }) {
    return function (dispatch) {
        instance.post(`${base_url}/register.php`, {username, password, email}).then(resp=> {
            dispatch({
                type: AUTH_USER
            });
            console.log('Our response from register.php ', resp.data);
            if(resp.data["error"]){
                console.log("registration failed")
            }
            else {
                instance.post(`${base_url}/login.php`, {username, password}).then(resp => {
                    console.log('Our response from login.php ', resp.data);
                    if (resp.data === 0) {
                        console.log('Invalid Username/Password');
                    }
                    else if(resp.data === 1){
                        console.log('User logged in');
                        browserHistory.push('/welcome_user');
                    }
                    else{
                        console.log("user already logged in");
                    }
                }).catch(err => {
                    console.log('error:', err);
                    dispatch({
                        type: AUTH_ERROR,
                    });
                });
            }
        });
    }
}

export function login_user({ username, password}) {
    return function (dispatch) {
        instance.post(`${base_url}/login.php`, {username, password}).then(resp=>{
            console.log(resp);
            dispatch({
                type: AUTH_USER
            });
            if(resp.data === 0){
                console.log('Invalid Username');
            }
            else if(resp.data === 1){
                console.log('User logged in');
                browserHistory.push('/welcome_user');
            }
            else{
                console.log("user already logged in");
            }
        }).catch(err=>{
            console.log(err);
        });
    }
}

export function logout_user(){
    return function(dispatch){
        instance.post(`${base_url}/logout.php`).then(resp=>{
            console.log("response from logout ",resp);
            dispatch({
                type: UNAUTH_USER
            })
        }).catch(err=>{
            console.log("error from logout ",err)
        })
    }
}

const MU_KEY = '&key=1012337b1a2c2a5974255a4412b237a';

export function fetchEvents(coords){
    console.log('Coords: ', coords);

    const lat = coords.latitude;
    const long = coords.longitude;

    return function(dispatch){

        function findCookie(cookie){
            const score = cookie.substr((cookie.indexOf("activity_score")+15),1);
            console.log(score);
            return score;
        }

        let activity_score;

        if(!isNaN(findCookie(document.cookie))){
            activity_score = parseInt(findCookie(document.cookie));
        }else{
            activity_score = false
        }

        axios.post(`${base_url}/get_interests.php`,{activity_score}).then(resp=>{
            if(typeof resp.data !== 'string') {
                // +category_id+MU_KEY
                let meetup_url = 'https://api.meetup.com/2/open_events?and_text=False&offset=0&format=json&lon='+long+'&limited_events=False&text_format=plain&photo-host=public&page=50&radius=10&lat='+lat+'&desc=False&status=upcoming&category=';
                for (let i = 0; i < resp.data.length; i++) {
                    console.log(resp.data[i]);
                    if(i===resp.data.length-1){
                        meetup_url+=resp.data[i].category_id+MU_KEY;
                    }
                    else{
                        meetup_url+=resp.data[i].category_id+"%2C";
                    }
                }
                console.log(meetup_url);
                $.ajax({
                    dataType: 'jsonp',
                    crossDomain: true,
                    method: 'GET',
                    url: meetup_url,
                    success: function(response){
                        console.log('Success Response: ', response);
                        dispatch({
                            type: FETCH_EVENTS,
                            payload: response.results
                        });
                    },
                    error: function(response){
                        console.log('Error: ', response);
                    }
                });
            }
            else{
                console.log(resp.data);
            }
        });
    };
}

export function storeUserLocation(location){
        return {
            type: SAVE_LOCATION,
            payload: location
        };
}

export function submit_interests( idArray ) {
    return function () {
        if(idArray.length >= 3) {
            instance.post(`${base_url}/insert_interests.php`, {idArray}).then(resp => {
                console.log('Interests sent ', resp);

            }).catch(err => {
                console.log('not sent ', err);
            });
        }
    }
}

export function fetchWeather(coords){
    const WEATHER_KEY = '0cb0c630afe33bff7e69f24de512c0f0';
    const lat = coords.latitude;
    const long = coords.longitude;
    const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather?APPID='+WEATHER_KEY+'&lat='+lat+'&lon='+long;
    return function(dispatch){
        axios.get(WEATHER_URL).then((response) => {
            dispatch({
                type: FETCH_WEATHER,
                payload: response.data
            });
        }).catch((err) => {
            console.log('Weather Error:', err);
        });
    }

}

export function storeInterests(interests){
    return {
        type: STORE_INTERESTS,
        payload: interests
    }
}

//  START: TO CALCULATE ACTIVITY SCORE & TO GET USER INFO FROM FITBIT
function getActivityScore(fatBurnMin, cardioMin, peakMin){
    const fatBurnScore = fatBurnMin*2;
    const cardioScore = cardioMin*3;
    const peakScore = peakMin*4;
    const totalScore = (fatBurnScore+cardioScore+peakScore);
    const totalMin = 60+(fatBurnMin+cardioMin+peakMin);
    let activityScore = totalScore/totalMin;
    if (activityScore >= 0 && activityScore < 2){
        activityScore = Math.round(activityScore);
    }
    else if(activityScore > 2){
        activityScore = 2;
    }
    else{
        activityScore = 'Invalid Inputs'
    }
    return activityScore
}

const test_url = './backend/mock_data';
// const email = "braxton@beativities.com";

export function get_fitbit({email}) {
    return function (dispatch) {
        instance.get(`${test_url}/mockData.json`, {email}).then(resp=>{
            const user_state = resp.data[email];
            console.log('User state: ', user_state);
            dispatch({
                type: FETCH_FITBIT,
                payload: resp
            });
            const fatBurnMin = parseInt(user_state.fatBurn);
            const cardioMin = parseInt(user_state.cardio);
            const peakMin = parseInt(user_state.peak);
            document.cookie = "activity_score="+getActivityScore(fatBurnMin, cardioMin, peakMin);
        }).catch(err=>{
            console.log(err);
        });
    }
}
//  END: TO CALCULATE ACTIVITY SCORE & TO GET USER INFO FROM FITBIT

