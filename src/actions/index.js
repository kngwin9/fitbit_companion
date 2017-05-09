import axios from 'axios';
import $ from 'jquery';
import { browserHistory } from 'react-router';
import { AUTH_ERROR, AUTH_USER, UNAUTH_USER, FETCH_EVENTS, SAVE_LOCATION, FETCH_WEATHER, STORE_INTERESTS } from './types';


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

//const MEETUP_URL = 'https://api.meetup.com/2/open_events?and_text=False&offset=0&format=json&lon=-117.79&limited_events=False&text_format=plain&photo-host=public&page=50&radius=10&lat=33.68&desc=False&status=upcoming&category=32';
const MU_KEY = '&key=1012337b1a2c2a5974255a4412b237a';
const category_id = 5;

export function fetchEvents(coords){
    console.log('Coords: ', coords);

    const lat = coords.latitude;
    const long = coords.longitude;

    return function(dispatch){

        $.ajax({
            dataType: 'jsonp',
            crossDomain: true,
            method: 'GET',
            url: 'https://api.meetup.com/2/open_events?and_text=False&offset=0&format=json&lon='+long+'&limited_events=False&text_format=plain&photo-host=public&page=50&radius=10&lat='+lat+'&desc=False&status=upcoming&category='+category_id+MU_KEY,
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
    const WEATHER_URL = 'http://api.openweathermap.org/data/2.5/weather?APPID='+WEATHER_KEY+'&lat='+lat+'&lon='+long;
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