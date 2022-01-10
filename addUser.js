import React, { useState } from 'react';
import {
    Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddUser = ({navigation}) => {
    const [user, setUser] = useState();
    const [senha, setSenha] = useState();
    const [bairro, setBairro] = useState();
    const [telefone, setTel] = useState();

    const cadastrar = () =>
    {
        if(user&&senha&&bairro&&telefone)
        {
            if(senha.length>=4)
            {
                let nome;
                firestore().collection('users').get().then((querySnapshot) => {
                    querySnapshot.forEach(snapshot => {
                        if(snapshot.data().nome==user)
                        {
                            nome = snapshot.data().nome;
                        }
                    })
                })
                if(nome)
                {
                    Alert.alert('Nome de usuário já existe!');
                }
                else
                {
                    firestore()
                    .collection('users')
                    .add({
                        nome: user,
                        senha:senha,
                        bairro: bairro,
                        telefone: telefone
                    })
                    .then(() => {
                        Alert.alert('Cadastrado com sucesso!');
                        AsyncStorage.setItem('user', JSON.stringify({'nome':user,'bairro':bairro,'telefone':telefone}));
                        navigation.navigate('Login');
                    });
                }
            }
            else
            {
                Alert.alert('Ditige uma senha com 4 digitos ou mais!')
            }
        }
        else
        {
            Alert.alert('Dados Faltando!');
        }
    }

  return (
    <SafeAreaView style={{flex:1}}>
        <KeyboardAvoidingView behavior='height' style={{flex:1, alignItems:'center',backgroundColor:'white'}}>
            <View style={styles.header}>
              <Text style={styles.title}>LIVRO SOLIDÁRIO</Text>
            </View>
            <View style={styles.login}>
              <TextInput style={styles.textinput} placeholder='USUÁRIO' value={user} onChangeText={(value)=>setUser(value)}/>
              <TextInput style={styles.textinput} placeholder='SENHA' value={senha} onChangeText={(value)=>setSenha(value)}/>
              <TextInput style={styles.textinput} placeholder='BAIRRO' value={bairro} onChangeText={(value)=>setBairro(value)}/>
              <TextInput style={styles.textinput} placeholder='TELEFONE' value={telefone} onChangeText={(value)=>setTel(value)}/>
              <TouchableOpacity onPress={cadastrar} style={styles.buton}><Text style={{color:'black', fontWeight:'500'}}>CADASTRAR</Text></TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
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
    height: 300,
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

export default AddUser;
