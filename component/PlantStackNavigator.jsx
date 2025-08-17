import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreenComponent from './HomeScreenComponent';
import CameraScreenComponent from './CameraScreenComponent';
import GoogleMapScreenComponent from './GoogleMapScreenComponent';
import GeminiAIScreenComponent from './GeminiAIScreenComponent';


const BooksStack = createNativeStackNavigator();

const PlantStackNavigatorComponent = () => {
  return (
    <BooksStack.Navigator>
      <BooksStack.Screen name="Plants" component={HomeScreenComponent} />
      <BooksStack.Screen name="Camera" component={CameraScreenComponent} />
      <BooksStack.Screen name="GoogleMap" component={GoogleMapScreenComponent} />
      <BooksStack.Screen name="GeminiAI" component={GeminiAIScreenComponent} />
    </BooksStack.Navigator>
  );
};

export default PlantStackNavigatorComponent;