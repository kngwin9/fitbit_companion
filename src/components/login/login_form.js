import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { connect } from 'react-redux';
import { login_user } from '../../actions/index'
import { Link } from 'react-router';
import Paper from 'material-ui/Paper';
class LoginForm extends Component {
    /**
     * @param vals
     */
    submitForm(vals) {
        this.props.login_user(vals);
        console.log('Form submitted: ', vals);
    }
    /**
     * @param input
     * @param label
     * @param touched
     * @param error
     * @param custom
     */
    renderTextField = ({ input, label, meta: { touched, error }, ...custom }) => (
        <TextField hintText={label}
                   floatingLabelText={label}
                   errorText={touched && error}
                   {...input}
                   {...custom}
        />
    );
    render() {
        const { handleSubmit } = this.props;
        const styles = {
            register: { width: '100%', margin: '1% auto' },
            form: { width: '70vmin', margin: '0 auto' },
            signIn: { width: '100%', margin: '2% auto' },
            fields: { width: '100%' },
            centeredText: { textAlign: 'center', color: '#444' },
            body: { width: '90vw', margin:' 6vw auto 0', background: 'rgba(255, 255, 255, 0.93)', padding: '5%' }
        };
        return (
            <Paper style={styles.body} zDepth={4}>
                <h2 style={styles.centeredText}>Sign In</h2>
                <form style={styles.form} onSubmit={ handleSubmit( (formValue) => {this.submitForm(formValue)})}>
                    <div>
                        <Field name="username"
                               component={this.renderTextField}
                               type="text"
                               label="Username"
                               style={styles.fields}
                        />
                    </div>
                    <div className="form-group">
                        <Field name="password"
                               component={this.renderTextField}
                               type="password"
                               label="Password"
                               style={styles.fields}
                        />
                    </div>
                    <RaisedButton style={styles.signIn} type="submit" label="Sign In" secondary={true} />
                    <h3 style={styles.centeredText}>Don't Have an Account?</h3>
                    <RaisedButton label="Register" style={styles.register} containerElement={<Link to="/register"/>} secondary={true} />
                </form>
            </Paper>
        )
    }
}

LoginForm = reduxForm({
    form: 'loginForm'
})(LoginForm);
export default connect(null, { login_user })(LoginForm);