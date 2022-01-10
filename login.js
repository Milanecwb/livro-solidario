import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({navigation}) => {

  const [usuario, setUsuario] = useState();
  const [senha, setSenha] = useState();

  const login = () =>
  {
    if(usuario&&senha)
    {
      let logado;
      let dados;
      firestore()
      .collection('users')
      .get()
      .then(querySnapshot => {
          querySnapshot.forEach(documentSnapshot => {
          if(documentSnapshot.data().nome==usuario)
          {
            if(documentSnapshot.data().senha==senha)
            {
              logado = true;
              dados = {'nome':documentSnapshot.data().nome,'bairro':documentSnapshot.data().bairro,'telefone':documentSnapshot.data().telefone}
            }
          }
          });
      }).then(()=>
        {
          if(logado)
          {
            AsyncStorage.setItem('user', JSON.stringify(dados));
            navigation.navigate('Home');
          }
          else
          {
            Alert.alert('Usuário ou senha Incorretos!');
          }
      })
    }
    else
    {
      Alert.alert('Dados faltando!');
    }
  }

  return (
    <SafeAreaView style={{flex:1}}>
        <View style={{flex:1, alignItems:'center',backgroundColor:'white'}}>
            <View style={styles.header}>
              <Text style={styles.title}>LIVRO SOLIDÁRIO</Text>
            </View>
            <View style={styles.login}>
              <TextInput value={usuario} onChangeText={(value)=>setUsuario(value)} style={styles.textinput} placeholder='USUÁRIO'/>
              <TextInput value={senha} secureTextEntry onChangeText={(value)=>setSenha(value)} style={styles.textinput} placeholder='SENHA'/>
              <TouchableOpacity style={styles.buton} onPress={login}><Text style={{color:'black', fontWeight:'500'}}>ENTRAR</Text></TouchableOpacity>
              <TouchableOpacity style={styles.buton} onPress={()=>navigation.navigate('Cadastro')}><Text style={{color:'black', fontWeight:'500'}}>CADASTRAR-SE</Text></TouchableOpacity>
            </View>
        </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 24,
    alignItems: 'center',
    backgroundColor: 'rgba(6, 5, 71,0.5)',
    width:'100%',
  },
  title:{
    fontWeight: 'bold',
    fontSize: 24,
    color: 'white'
  },
  login:{
    marginTop:30,
    backgroundColor:'white',
    alignItems:'center',
    justifyContent:'space-around',
    width: '75%',
    height: 250,
  },
  textinput:{
    backgroundColor:'lightgray',
    width:'75%',
    padding:15,
    borderRadius:10,
    textAlign:'center',
    alignItems:'center',
    fontWeight: 'bold'
  },
  buton:{
    backgroundColor:'rgba(6, 5, 71,0.6)',
    width:'75%',
    padding:15,
    borderRadius:10,
    textAlign:'center',
    alignItems:'center',
    fontWeight: 'bold'
  }
});

export default Login;
