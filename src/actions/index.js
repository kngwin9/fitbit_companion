import axios from 'axios';
import $ from 'jquery';
import { browserHistory } from 'react-router';

import { AUTH_ERROR, AUTH_USER, UNAUTH_USER, FETCH_EVENTS, SAVE_LOCATION, FETCH_WEATHER, FETCH_FITBIT, LOAD_SPINNER, VIEW_ALL } from './types';
/**
 * @type {AxiosInstance}
 */
const instance = axios.create({
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
});
/**
 * @type {string}
 */
const base_url = './backend/server';
/**
 * @param username
 * @param password
 * @param email
 * @returns {Function}
 */
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
                        browserHistory.push('/select_interests');
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
/**
 * @param username
 * @param password
 * @returns {Function}
 */
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
/**
 * @returns {Function}
 */
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
/**
 * @type {string}
 */
const MU_KEY = '&key=1012337b1a2c2a5974255a4412b237a';
/**
 * @param coords
 * @returns {Function}
 */
export function fetchEvents(coords){
//  Cords for lat and long expected:
    const lat = coords.latitude;
    const long = coords.longitude;
    return function(dispatch){



        console.log("function run");
        instance.post(`${base_url}/get_interests.php`).then(resp=>{
            console.log("response from axios: ",resp);
            if(typeof resp.data !== 'string') {
                let meetup_url = 'https://api.meetup.com/2/open_events?and_text=False&offset=0&format=json&lon='+long+'&limited_events=False&text_format=plain&photo-host=public&page=10&radius=10&lat='+lat+'&desc=False&status=upcoming&category=';
                for (let i = 0; i < resp.data.length; i++) {
                    if(i===resp.data.length-1){
                        meetup_url+=resp.data[i].category_id+MU_KEY;
                    }
                    else{
                        meetup_url+=resp.data[i].category_id+"%2C";
                    }
                }
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
        }).catch(err=>{
            console.log("error catch: ", err)
        });
    };
}
//  START: FOR DISPLAYING ALL THE EVENTS IN VIEW ALL
/**
 * @param cat_id
 * @param coords
 * @param catIndex
 * @returns {Function}
 */
export function getEvent(cat_id, coords, catIndex){
    const lat = coords.latitude;
    const long = coords.longitude;
    let meetup_url = 'https://api.meetup.com/2/open_events?and_text=False&offset=0&format=json&lon='+long+'&limited_events=False&text_format=plain&photo-host=public&page=5&radius=10&lat='+lat+'&desc=False&status=upcoming&category='+cat_id+MU_KEY;
    return function (dispatch) {
        $.ajax({
            dataType: 'jsonp',
            crossDomain: true,
            method: 'GET',
            url: meetup_url,
            success: function(response){
                console.log('VIEW ALL SUCCESS RESPONSE: ', response);
                dispatch({
                    type: VIEW_ALL,
                    catIndex,
                    payload: response.results
                });
            },
            error: function(response){
                console.log('VIEW ALL ERROR RESPONSE: ', response);
            }
        });
    }
}
//  END: FOR DISPLAYING ALL THE EVENTS IN VIEW ALL
/**
 * @param location
 * @returns {{type, payload: *}}
 */
export function storeUserLocation(location){
        return {
            type: SAVE_LOCATION,
            payload: location
        };
}
/**
 * @param idArray
 * @returns {Function}
 */
export function submit_interests(idArray) {
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
/**
 * @param coords
 * @returns {Function}
 */
export function fetchWeather(coords){
    const WEATHER_KEY = 'cd2cd88ff4314ac744adc903f6f5a68d';
    const lat = coords.latitude;
    const long = coords.longitude;
    const WEATHER_URL = `https://api.darksky.net/forecast/${WEATHER_KEY}/${lat},${long}`;
    return function(dispatch){
        $.ajax({
            dataType: 'jsonp',
            crossDomain: true,
            method: 'GET',
            url: WEATHER_URL,
            success: function(response){
                dispatch({
                    type: FETCH_WEATHER,
                    payload: response
                });
            },
            error: function(response){
                console.log('Error: ', response);
            }
        });
    }
}
// const test_url = './backend/fitbit_library';
//
// export function get_fitbit() {
//     return function (dispatch) {
//         instance.get(`${test_url}/call_fitbit.php`).then(resp=>{
//             const user_state = resp.data;
//             console.log('User state: ', user_state);
//             dispatch({
//                 type: FETCH_FITBIT,
//                 payload: resp
//             });
//         }).catch(err=>{
//             console.log(err);
//         });
//     }
// }
//  END: TO CALCULATE ACTIVITY SCORE & TO GET USER INFO FROM FITBIT
/**
 * @param value
 * @returns {{type, payload: *}}
 */
export function loadSpinner(value){
    return {
        type: LOAD_SPINNER,
        payload: value
    }
}
