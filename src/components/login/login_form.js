import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { connect } from 'react-redux';
import { login_user } from '../../actions/index'
import { Link } from 'react-router';

class LoginForm extends Component {
    submitForm(vals) {
        this.props.login_user(vals);
        console.log('Form submitted: ', vals);
    }

    renderTextField = ({ input, label, meta: { touched, error }, ...custom }) => (
        <TextField hintText={label}
                   floatingLabelText={label}
                   errorText={touched && error}
                   {...input}
                   {...custom}
        />
    );
    render() {
        const button_style = { marginLeft: '2%', marginRight: '2%', marginTop: '1%'};
        const { handleSubmit } = this.props;
        return (
            <div>
                <form onSubmit={ handleSubmit( (formValue) => {this.submitForm(formValue)})}>

                    <div className="form-group">
                        <Field name="username"
                               component={this.renderTextField}
                               type="text"
                               label="Username"
                        />
                    </div>
                    <div className="form-group">
                        <Field name="password"
                               component={this.renderTextField}
                               type="password"
                               label="Password"
                        />
                    </div>
                    <RaisedButton style={button_style} type="submit" label="Sign In" containerElement={<Link to="/returning_user"/>} primary={true} />
                    <RaisedButton label="Register" containerElement={<Link to="/register"/>} secondary={true} />
                </form>
            </div>
        )
    }
}

LoginForm = reduxForm({
    form: 'loginForm'
})(LoginForm);

export default connect(null, { login_user })(LoginForm);