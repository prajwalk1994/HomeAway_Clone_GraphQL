import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import cookie from 'react-cookies';
import Navbar from '../Navbar/Navbar';
//GraphQL
import { compose, withApollo, graphql } from 'react-apollo';
import {getProfile} from '../../queries/loginQuery';

class UpdateProfile extends Component{

  constructor(props){
    super(props);
    this.state = {
      profile : {},
    }
  }

  componentDidMount(){
    this.props.client.query({
      query : getProfile,
      variables : {
        email : cookie.load('travellerCookie'),
      }
    }).then(response => {
      console.log(response.data);
      this.setState({
        profile : response.data.getProfile,
      })
    })
  }

  submitProfile = (e) => {
    e.preventDefault();
    this.props.client.mutate({
      mutation : updateProfile,
      variables : {
        email : cookie.load('travellerCookie'),
        aboutMe : this.state.aboutMe,
        phoneNumber : this.state.phoneNumber,
        language : this.state.language,
        gender : this.state.gender,
        hometown : this.state.hometown,
        company : this.state.company,
        city : this.state.city,
        school : this.state.school,
        country : this.state.country,
      }
    }).then(response => {
      alert("Updated profile successfully");
      this.props.history.push('/');
    }).catch(error => {
      alert("Error updating profile");
    })
  }

  render(){
    return(
      <div>
        <Navbar/>
        <h2> Update profile page </h2> <hr/> <br/>
        <form>
          <div class="form-group">
            <label for="fullName">Full Name:</label>
            <input type="text" class="form-control" id="fullName"/>
          </div><br/>
          <div class="form-group">
            <label for="about">About</label>
            <textarea rows="6" class="form-control" id="about"></textarea>
          </div><br/>
          <div class="form-group">
            <label for="age">Age</label>
            <input type="text" class="form-control" id="age" />
          </div><br/>
          <div class="form-group">
            <label for="languages">Languages</label>
            <input type="text" class="form-control" id="languages" />
          </div><br />
        </form>
      </div>
    )
  }
}

export default compose(
  withApollo,
)(UpdateProfile);
