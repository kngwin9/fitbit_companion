import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import { get_fitbit } from '../../actions/index';
import FitbitHeader from './fitbit_header';

class FitbitLogin extends Component {

    get_fitbit_data(vals) {
        this.props.get_fitbit(vals);
        const testing = (vals);
        console.log('TESTING ', testing);
        browserHistory.push('/activity_note');
    }
    renderTextfield = ({label, input}) => (
            <TextField
                floatingLabelText={label}
                hintText={label}
                {...input}
            />
    );
    render(){
        const styles = {
            body: { margin: '15vh auto 0', width: '75vw', padding: '10%' },
            form: { margin: '0 auto' },
            button: { marginTop: '5%' },
            h1: { textAlign: 'center', color: '#444' }
        };
        const { handleSubmit } = this.props;
        return(
            <div>
                <FitbitHeader />
                <Paper style={styles.body}>
                    <h1 style={styles.h1}>Log in</h1>
                    <form style={styles.form}>
                        <div>
                            <Field name="email"
                                   component={this.renderTextfield}
                                   label="Email"
                                   type="text"
                            />
                            <Field name="password"
                                   component={this.renderTextfield}
                                   type="password"
                                   label="Password"
                                   floatingLabelText="Password"
                            />
                        </div>
                        <RaisedButton onClick={ handleSubmit((value) => {this.get_fitbit_data(value)}) }
                                      style={styles.button}
                                      label="Login"
                                      primary={true}
                                      fullWidth={true}
                                      type="submit"
                        />
                    </form>
                </Paper>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        fitbit: state.fitbit.fitbit[0]
    }
}
FitbitLogin = reduxForm({
    form: 'fitbitForm'
})(FitbitLogin);

export default connect(mapStateToProps, { get_fitbit })(FitbitLogin);