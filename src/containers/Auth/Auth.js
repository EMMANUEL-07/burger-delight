import React, {Component} from 'react'
import Input from '../../components/UI/Input/Input'
import Button from '../../components/UI/Button/Button'
import classes from './Auth.module.css'
import {connect} from 'react-redux'
import * as actions from '../../store/actions/index'
import Spinner from  '../../components/UI/Spinner/Spinner'
import {Redirect } from 'react-router-dom'
import {updateObject, checkValidity} from '../../store/utility'



class Auth extends Component {
   
   state = {
      controls : {
         email: {
            elementType: 'input',
            elementConfig: {
               type: 'email',
               placeholder: 'Mail Address'
            },
            value: '',
            validation: {
               required: true,
               isEmail: true
            },
            valid: false,
            touched: false
         },
         password: {
            elementType: 'input',
            elementConfig: {
               type: 'password',
               placeholder: 'Enter Password'
            },
            value: '',
            validation: {
               required: true,
               minLength: 6
            },
            valid: false,
            touched: false
         }
      },
      isSignUp: true,

   }

  inputChangedHandler = (event, controlName) => {
      const updatedControls = updateObject(this.state.controls, {
            [controlName]: updateObject(this.state.controls[controlName], {
                  value: event.target.value,
                  valid: checkValidity(event.target.value, this.state.controls[controlName].validation),
                  touched: true
            })
      })
      
      this.setState({controls: updatedControls});
  }

  submitHandler = (event) => {
      event.preventDefault();
      this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value, this.state.isSignUp);
  }


  switchAuthModeHandler = ( ) => {
     this.setState(prevState => {
        return {isSignUp: !prevState.isSignUp}
     })
  }
   
   render(){

      const formElementsArray = [];
      for (let key in this.state.controls) {
         formElementsArray.push({
            id: key,
            config: this.state.controls[key]
         })
      }

      let form = formElementsArray.map(formElement => (
         <Input 
            key= {formElement.id} 
            elementType={formElement.config.elementType} 
            elementConfig={formElement.config.elementConfig} 
            value={formElement.config.value} 
            changed={ (event) => this.inputChangedHandler(event, formElement.id)}
            shouldValidate = {formElement.config.validation}
            touched= {formElement.config.touched}
            invalid={!formElement.config.valid}
            /> 
        
      ))

      if(this.props.loading) {
         form = <Spinner />
      }

      let errorMessage = null
      
      if(this.props.error) {
         errorMessage = (
            <p>{this.props.error.message}</p>
         )
      }

      let authRedirect = null
      if(this.props.isAuth){
         authRedirect =   this.props.building ?  <Redirect to='/checkout' /> :<Redirect to='/' /> 
         
      }

      return(
         <div className={classes.Auth}>
            {errorMessage}
            <form onSubmit={this.submitHandler}>
               {form}
               <Button btnType="Success"> SUBMIT </Button>
            </form>
            <Button 
               clicked = {this.switchAuthModeHandler}
               btnType="Success"> SWITCH TO {this.state.isSignUp ? 'SIGN IN' : 'SIGN UP'} 
            </Button>
            {authRedirect}
         </div>
      );
   }


}


const mapStateToProps = state => {
   return {
      loading: state.auth.loading,
      error: state.auth.error,
      isAuth: state.auth.token !== null,
      building: state.burgerBuilder.building,
      
      
   }
} 

const mapDispatchToProps = dispatch => {
   return {
      onAuth: (email, password, isSignUp) => dispatch(actions.auth(email, password, isSignUp)),
   }
}


export default connect(mapStateToProps, mapDispatchToProps)(Auth);