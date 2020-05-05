import React, { Component } from 'react';
import Navigation from './Components/Navigation/Navigation';
import Logo from './Components/Logo/Logo';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import Rank from './Components/Rank/Rank';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition'; 
import Signin from './Components/Signin/Signin';
import Register from './Components/Register/Register';
import Particles from 'react-particles-js';
import './App.css';



const initialState = 
{
  input: 'a',
  imageUrl: '',
  box: [],
  route: 'signin',
  isSignedIn: false,
  user:
  {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

class App extends Component
{
  constructor()
  {
    super();
    this.state = initialState;
    
  }

  loadUser = (data) =>
  {
    this.setState(
      {
        user:
        {
          id: data.id,
          name: data.name,
          email: data.email,
          entries: data.entries,
          joined: data.joined
        }
      }
    );
  }  

  calculateFaceLocation = (data) =>
  {
    const returnBox = [];
    let clarifaiFace = '';
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    let box = {};
    for (const element of data.outputs[0].data.regions) {
        clarifaiFace = element.region_info.bounding_box;
        box = {leftCol: clarifaiFace.left_col * width,
          topRow: clarifaiFace.top_row * height,
          rightCol: width - (clarifaiFace.right_col * width),
          bottomRow: height - (clarifaiFace.bottom_row * height) }
        returnBox.push(box);
    }

    return {
      returnBox
    }
  }

  displayFaceBox = (box) =>
  {
    this.setState({box: box.returnBox});
    
  }

  onInputChange = (event) => 
  {
    this.setState({input: event.target.value}); 
  }

  onButtonSubmit = () =>
  {
    this.setState({imageUrl: this.state.input});
    fetch('https://rocky-lake-07524.herokuapp.com/imageurl',
    {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify
      (
          {
              input: this.state.input
          }
      )
    })
    .then(response => response.json())
    .then(response =>
        {
          if(response)
          {
            fetch('https://rocky-lake-07524.herokuapp.com/image',
            {
              method: 'put',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify
              (
                  {
                      id: this.state.user.id
                  }
              )
            })
            .then(response => response.json())
            .then(count => 
              {
                this.setState( Object.assign(this.state.user, {entries: count}));
              })
            .catch(console.log);

          }
          this.displayFaceBox(this.calculateFaceLocation(response))
        })
      .catch(err => console.log(err));
  }

  onRouteChange = (route) =>
  {
    if(route === 'signout')
    {
      this.setState(initialState);
      route='signin';
    }
    else if (route === 'home')
    {
      this.setState({isSignedIn: true});
    }
    this.setState({route: route});
  }

  render()
  {  const { isSignedIn, imageUrl, route, box} = this.state;
  
    return(
      <div className="App">
        <Particles className='particles'
        params = {{
          particles:
          {
            number:
            {
              value: 100,
              density:
              {
                enable: true,
                value_area: 800
              }
            }
          }
        }}/>
        <Navigation isSignedIn={
          isSignedIn} onRouteChange = {this.onRouteChange}/>
        {
          route === 'home'
            ? <div>
                <Logo />
                <Rank name={this.state.user.name} entries={this.state.user.entries}/> 
                <ImageLinkForm 
                  onInputChange = {this.onInputChange} 
                  onButtonSubmit = {this.onButtonSubmit}  />
                <FaceRecognition 
                  imageUrl={imageUrl}
                  box = {box}  />
             </div>
            : 
            (
              route === 'signin'
                ?<Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
                :<Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            ) 
        }
      </div>

    );
  }

}

export default App;
