import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Link, browserHistory } from 'react-router'
import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox'
import { connect } from 'react-redux';
import getIds from './ids';
import { submit_interests, storeInterests } from '../../actions/index';

class SelectInterests extends Component {

    submitForm(vals) {
        //console.log('Form submitted: ', vals);
        const idArray = getIds(vals);
        this.props.submit_interests(idArray);
        browserHistory.push('/welcome_user');
        //console.log('ID Array:', idArray);
    }
    componentWillReceiveProps(nextProps){
        const values = nextProps.inputForm.values;

        let categoryArray = [];

        if(values !== undefined) {
            for (let key in values) {
                if (values[key] === true) {
                    categoryArray.push(key);
                }
            }
        }
        this.props.storeInterests(categoryArray);
    }
    renderCheckbox({ input: {name, onChange}, label }) {
        return (
            <Checkbox label={label}
                  name={name}
                  onCheck={onChange}/>
        )
    };
    render() {
        const button_style = { marginLeft: '2%', marginRight: '2%', marginTop: '1%'};
        const { handleSubmit } = this.props;
        return (
            <div>
                <h1>Please Select At Least 3 Interests:</h1>
                <form onSubmit={ handleSubmit( (formValue) => {this.submitForm(formValue)})}>
                    <div>
                        <Field name="Sports & Fitness" component={this.renderCheckbox} label="Sports & Fitness"/>
                        <Field name="Dance" component={this.renderCheckbox} label="Dance"/>
                        <Field name="Outdoors & Adventures" component={this.renderCheckbox} label="Outdoors & Adventures"/>
                        <Field name="Health & Wellness" component={this.renderCheckbox} label="Health & Wellness"/>
                        <Field name="Music" component={this.renderCheckbox} label="Music"/>
                        <Field name="Pets" component={this.renderCheckbox} label="Pets"/>
                        <Field name="Social" component={this.renderCheckbox} label="Social"/>
                        <Field name="Photography" component={this.renderCheckbox} label="Photography"/>
                        <Field name="Arts" component={this.renderCheckbox} label="Arts"/>
                        <Field name="Hobbies & Crafts" component={this.renderCheckbox} label="Hobbies & Crafts"/>
                        <Field name="Sci-Fi & Games" component={this.renderCheckbox} label="Sci-Fi & Games"/>
                        <Field name="Film" component={this.renderCheckbox} label="Film"/>
                    </div>
                    <RaisedButton style={button_style} type="submit" label="Submit" primary={true}/>
                </form>
            </div>
        )
    }
}
SelectInterests = reduxForm({
    form: 'selectInterests'
})(SelectInterests);

function mapStateToProps(state){
    return {
        events: state.events.categories,
        inputForm: state.form.selectInterests
    }
}

export default connect(mapStateToProps, { submit_interests, storeInterests })(SelectInterests);
