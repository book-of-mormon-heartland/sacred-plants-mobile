import React, { useContext, useState } from 'react';
var Environment = require('.././context/environment.ts');
import { GoogleAuthContext, GoogleAuthProvider } from '.././context/GoogleAuthContext';
import LoginScreenComponent from './LoginScreenComponent.jsx';
import PlantScreenComponent from './PlantScreenComponent.jsx';
import NoCameraScreenComponent from './NoCameraScreenComponent.jsx';


const HomeScreenComponent = ( {navigation} ) => {

  const { googleMessage } = useContext(GoogleAuthContext);
  
  if(googleMessage=="Logged In") {
    return (
      <PlantScreenComponent />
    );
  } else {
    return (
      <LoginScreenComponent />
    );
  }
};

export default HomeScreenComponent;