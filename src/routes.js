import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './components/app';
import Home from './components/home/home'
import About from './components/aboutus/about_us';
import Blog from './components/blog/blog';
import SelectInterests from './components/select_interests/select_interests_form';
import RegisterForm from './components/register_new_user/register_new_user';
import LoginForm from './components/login/login_form';
import ViewAllList from './components/view_all_events/view_all';
import require_auth from './components/auth/require_auth';
import RecommendedEventList from './components/recommended_events/recommended_events';
import ActivityNote from './components/activity_note/activity_note';
import WelcomeNote from './components/welcome_new_user/welcome_new_user';
import FitbitLogin from './components/mock_fitbit_login/fitbit_login';
import EventCard from './components/event_card/event_card';
import ReturningUser from './components/returning_user/returning_user';

export default  (
    <div>
    <Route path="/" component={ App }>
            <Route path="home" component={ Home }/>
            <Route path="about" component={ About }/>
            <Route path="blog" component={ Blog }/>

        {/*Need to reroute, currently added to app in order to navigate easier. The below should not have a header and footer*/}
            {/*<Route path="select_interests" component={ SelectInterests }/>*/}
            <Route path="register" component={ RegisterForm }/>
            <Route path="login" component={ LoginForm }/>


            {/* Commented out for Testing */}
            {/*<Route path="view_all" component={ require_auth(ViewAllList) }/>*/}
            {/*<Route path="recommended_events" components={ require_auth(RecommendedEventList) }/>*/}
            <Route path="view_all" component={ ViewAllList }/>
            <Route path="recommended_events" components={ RecommendedEventList }/>


            <Route path="activity_note" component={ ActivityNote } />
            <Route path="welcome_user" components={ WelcomeNote }/>
            <Route path="returning_user" components={ ReturningUser }/>
            <Route path="event_card" component={ EventCard } />
    </Route>
            <Route path="fitbit_login" component={ FitbitLogin } />
            <Route path="select_interests" component={ SelectInterests }/>
    </div>

);