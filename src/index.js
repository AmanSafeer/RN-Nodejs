import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import {
    SignUp, VerificationCode, Login, Profile, Messages
} from './Containers';



const RootStack = createAppContainer(createStackNavigator({
    SignUp: { screen: SignUp },
    VerificationCode: { screen: VerificationCode },
    Login: { screen: Login },
    Profile: { screen: Profile },
    Messages: { screen: Messages }
},
    {
        initialRouteName: 'Login',
        headerMode: "none",

    }
));

export default RootStack;