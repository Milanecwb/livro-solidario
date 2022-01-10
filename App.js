import React,{useEffect, useState,createContext} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/login';
import Home from './screens/home';
import AddUser from './screens/addUser';
import AddLivro from './screens/addLivro';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();
const Log = createContext({});

const App = () => {

  const[logado, setLogado] = useState(false);

  const getDados =async()=>
  {
    let dados = await AsyncStorage.getItem('user');
    if(dados)
    {
      setLogado(true);
    }
  }

  useEffect(()=>{
    getDados()
  },[])

  return (
    <Log.Provider value={[logado, setLogado]}>
      <NavigationContainer>
        <Stack.Navigator>
          {!logado&&<Stack.Screen name="Login" component={Login}/>}
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Adicionar Livro" component={AddLivro}/>
          <Stack.Screen name="Cadastro" component={AddUser} />
        </Stack.Navigator>
      </NavigationContainer>
    </Log.Provider>
  );
};

export {Log};
export default App;
