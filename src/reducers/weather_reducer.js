import { FETCH_WEATHER } from '../actions/types';

const default_state = {
    weather: {
        iconID: '',
        main_description: '',
        location: 'Orange County',
        iconImg: ''
    }
};

export default function(state = default_state, action){
    switch(action.type){
        case FETCH_WEATHER:
            let bkgdImage = null;
            switch(action.payload.weather[0].icon) {
                case '11d':
                case '11n':
                    bkgdImage = 'thunderstorm.jpg';
                    break;
                case '09d':
                case '09n':
                    bkgdImage = 'drizzle.jpg';
                    break;
                case '10d':
                case '10n':
                    bkgdImage = 'rain.jpg';
                    break;
                case '13d':
                case '13n':
                    bkgdImage = 'snow.jpg';
                    break;
                case '50d':
                case '50n':
                    bkgdImage = 'mist.jpg';
                    break;
                case '01d':
                case '01n':
                    bkgdImage = 'clear.jpg';
                    break;
                case '02d':
                case '02n':
                case '03d':
                case '03n':
                case '04d':
                case '04n':
                    bkgdImage = 'cloudy.jpg';
                    break;
                default:
                    bkgdImage = '../components/imgs/weather/default.jpeg';
            }
            return {
                ...state,
                weather: {
                    iconID: action.payload.weather[0].icon,
                    main_description: action.payload.weather[0].main,
                    location: action.payload.name,
                    iconImg: 'https://openweathermap.org/img/w/'+action.payload.weather[0].icon+'.png',
                    background: bkgdImage
                }
            };
        default:
            return state;
    }
}