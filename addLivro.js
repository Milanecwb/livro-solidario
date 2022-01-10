import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddLivro = ({navigation}) => {

  const [nome, setNome] = useState();
  const [usuario, setUsuario] = useState();
  const [bairro, setBairro] = useState();
  const [telefone, setTel] = useState();
  
  const cadastrar = () =>
  {
    if(nome&&usuario&&bairro&&telefone)
    {
      write();
    }
    else
    {
      Alert.alert('Falta dados!');
    }
  }

  const write = () =>
  {
    firestore()
    .collection('livros')
    .add({
        nome: nome.toUpperCase(),
        usuario: usuario,
        bairro: bairro,
        telefone: telefone,
        data: firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
        setNome(null);
        Alert.alert('Livro Cadastrado!');
    });
  } 
  const getUser = async () =>
  {
    let dados = JSON.parse(await AsyncStorage.getItem('user'));
    if(dados)
    {
      setUsuario(dados.nome);
      setBairro(dados.bairro);
      setTel(dados.telefone);
    }
  }

  useEffect(()=>
  {
    getUser();
  },[])


  return (
    <SafeAreaView style={{flex:1}}>
        <KeyboardAvoidingView behavior='height' style={{alignItems:'center',backgroundColor:'white',width:'100%',height:'100%'}}>
            <View style={styles.header}>
              <Text style={styles.title}>LIVRO SOLIDÁRIO</Text>
            </View>
            <View style={styles.login}>
              <TextInput value={nome} onChangeText={(value)=>setNome(value)} style={styles.textinput} placeholder='NOME DO LIVRO'/>
              <TouchableOpacity style={styles.buton} onPress={cadastrar}><Text style={{color:'black', fontWeight:'500'}}>CADASTRAR</Text></TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    justifyContent:'center',
    backgroundColor: 'rgba(6, 5, 71,0.5)',
    width:'100%',
    height:50
  },
  title:{
    fontWeight: 'bold',
    fontSize: 24,
    color: 'white'
  },
  login:{
    flexDirection:'column',
    backgroundColor:'white',
    alignItems:'center',
    justifyContent:'space-around',
    width: '75%',
    height: '25%',
  },
  textinput:{
    backgroundColor:'lightgray',
    width:'75%',
    height:60,
    borderRadius:10,
    textAlign:'center',
    alignItems:'center',
    fontWeight: 'bold'
  },
  buton:{
    backgroundColor: 'rgba(6, 5, 71,0.6)',
    width:'75%',
    height:60,
    borderRadius:10,
    textAlign:'center',
    justifyContent:'center',
    alignItems:'center',
    fontWeight: 'bold'
  },
  menu:{
    width:8,
    height:8
  }
});

export default AddLivro;
