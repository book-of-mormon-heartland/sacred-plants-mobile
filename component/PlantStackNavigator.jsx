import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreenComponent from './HomeScreenComponent';
import CameraScreenComponent from './CameraScreenComponent';
import GoogleMapScreenComponent from './GoogleMapScreenComponent';
import GeminiAIScreenComponent from './GeminiAIScreenComponent';
import { useI18n } from '.././context/I18nContext'; 


const BooksStack = createNativeStackNavigator();

const PlantStackNavigatorComponent = () => {

  const { language, setLanguage, translate } = useI18n();
  
  return (
    <BooksStack.Navigator>
      <BooksStack.Screen name="Plants" 
        options = {{
          title: translate('plants'),
        }}
        component={HomeScreenComponent} />
      <BooksStack.Screen name="Camera" 
        options = {{
          title: translate('camera'),
        }}
        component={CameraScreenComponent} />
      <BooksStack.Screen name="GoogleMap"
        options = {{
          title: translate('maps'),
        }}
       component={GoogleMapScreenComponent} />
      <BooksStack.Screen name="GeminiAI" 
        options = {{
          title: translate('gemini_ai'),
        }}
        component={GeminiAIScreenComponent} />
    </BooksStack.Navigator>
  );
};

export default PlantStackNavigatorComponent;