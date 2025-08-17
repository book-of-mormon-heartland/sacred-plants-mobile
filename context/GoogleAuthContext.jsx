import { createContext, useState } from  "react";
import { GoogleSignin, isSuccessResponse } from '@react-native-google-signin/google-signin';
var Environment = require('./environment.ts');
import { Platform } from 'react-native';


export const GoogleAuthContext = createContext("");

export const GoogleAuthProvider = ({ children }) => {

    const [message, setMessage] = useState("Not Signed In");
    const [userProfile, setUserProfile] = useState(undefined);
    const [userToken, setUserToken] = useState("");
    const [jwtToken, setJwtToken] = useState("");
    const [refreshToken, setRefreshToken] = useState("");
    const isIOS = ( Platform.OS === 'ios' );
    let serverUrl = Environment.NODE_SERVER_URL;
    if(isIOS) {
        serverUrl = Environment.IOS_NODE_SERVER_URL;
    }

    const signIn = async () => {
        console.log("signIn");
        try {
            await GoogleSignin.hasPlayServices();
            const response = await GoogleSignin.signIn();
            if(isSuccessResponse(response)){
                console.log("Google Sign-In Success: ", response.data );
                let user = response.data.user;
                let idToken = response.data.idToken;

                // from here we make calls to server to authenticate to the rest server.
                try {
                    console.log("ServerUL" + serverUrl);
                    const postResponse = await fetch(serverUrl + "/rest/POST/googlelogin", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ token: idToken, user: user }),
                    });
                    if (!postResponse.ok) {
                        throw new Error(`HTTP error! status: ${postResponse.status}`);
                    }
                    const responseData = await postResponse.json();
                    const obj = JSON.parse(responseData);

                    if(obj?.jwtToken) {
                        setJwtToken(obj.jwtToken || "");
                        setRefreshToken(obj.refreshToken || "");
                        setMessage("Logged In");
                        setUserProfile(user);
                        setUserToken(idToken);
                    } else {
                        console.log("No JWT Token returned from server.");
                    }
                } catch (error) {
                    console.error('Error:', error);
                }

            } else {
                console.log("NOT Successful: ", response.data );
                setMessage( "Not Successful");
                setUserProfile(undefined);
                setUserToken("");
                setJwtToken("");
                setRefreshToken("");
            }
        } catch (error) {
            console.log("Error: ", error );

            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                setMessage('User cancelled the login flow');
                setUserProfile(undefined);
                setUserToken("");
                setJwtToken("");
                setRefreshToken("");

            } else if (error.code === statusCodes.IN_PROGRESS) {
                setMessage('Sign in is in progress already');
                setUserProfile(undefined);
                setUserToken("");
                setJwtToken("");
                setRefreshToken("");
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                setMessage('Play services not available or outdated');
                setUserProfile(undefined);
                setUserToken("");
                setJwtToken("");
                setRefreshToken("");
            } else {
                setMessage(`Some other error happened: ${error.message}`);
                setUserProfile(undefined);
                setUserToken("");
                setJwtToken("");
                setRefreshToken("");
            }
        }
        if(message=="") {
            setMessage("Logged In");
        }
    };


    const signOut = async () => {
        console.log("signOut");
        const userid = userProfile?.id  || "0";
        try {
            const signoutResponse = await GoogleSignin.signOut();
            console.log("signoutResponse: " + signoutResponse);
            setMessage('Not Signed In'); 
            setUserProfile(undefined);
            setUserToken("");
            setJwtToken("");
            setRefreshToken("");
            // need to do GoogleSignin.disconnect also.
        } catch (error) {
            console.log('Google Sign-Out Error: ', error);
        }
    }


    return (
        <GoogleAuthContext.Provider value={{ signIn, signOut, message, setMessage, userToken, userProfile,  jwtToken, refreshToken }}>
            { children }
        </GoogleAuthContext.Provider>
    );
}
