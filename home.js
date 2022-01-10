import React,{useEffect, useState, useContext} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import menu from '../img/menu.png';
import {Log} from '../App';

const Home = ({navigation}) => 
{
    const [logado, setLogado] = useContext(Log);
    const [livros,setLivros] = useState();
    const [livros_backup,setLivrosBackup] = useState();
    const [showmenu, setshowMenu] = useState(false);
    const [filtrar, setFiltrar] = useState(false);
    const [nomes, setNomes] = useState();
    const [bairros, setBairros] = useState();
    const [remover, setRemover] = useState(false);

    const getLivros =() =>
    {
        let nomes_livros = [];
        let bairros_livros = [];
        let dados = [];
        firestore()
        .collection('livros')
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(documentSnapshot => {
                dados.push(documentSnapshot);
                if(!nomes_livros.includes(documentSnapshot.data().nome)&&documentSnapshot.data().nome)
                {
                    nomes_livros.push(documentSnapshot.data().nome);
                }
                if(!bairros_livros.includes(documentSnapshot.data().bairro)&&documentSnapshot.data().bairro)
                {
                    bairros_livros.push(documentSnapshot.data().bairro);
                }
            });
        }).then(()=>
        {
            setLivros(dados);
            setLivrosBackup(dados);
            setNomes(nomes_livros);
            setBairros(bairros_livros);
        })
    }

    const filter = (tipo, value) =>
    {
        let dados = [];
        if(tipo == 'nome')
        {
            livros_backup.map(item =>
            {
                if(item._data.nome == value)
                {
                    dados.push(item);
                }
            })
            setLivros(dados);
        }
        else if(tipo == 'remover')
        {
            setLivros([...livros_backup]);
        }
        else
        {
            livros_backup.map(item =>
            {
                if(item._data.bairro == value)
                {
                    dados.push(item);
                }
            })
            setLivros(dados);
        }
        setFiltrar(false);
        setshowMenu(false);
        setRemover(false);
    }

    const remove = async() =>
    {
        let dados = [];
        let user = JSON.parse(await AsyncStorage.getItem('user')).nome;
        livros_backup.map(item=>
            {
                if(item._data.usuario == user)
                {
                    dados.push(item);
                }
            })
        setLivros([...dados]);
        setRemover(!remover);
    }

    const excluir_livro = (id,livro) =>
    {
        let dados_backup;
        let dados;
        Alert.alert(
            "Confirma",
            "Tem certeza que deseja excluir o livro: \n"+livro,
            [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
              { text: "OK", onPress: () => 
                firestore().collection('livros').doc(id).delete().then(()=>
                {
                    dados_backup = livros_backup;
                    dados = livros;
                    dados_backup.map((item,index)=>
                        {
                            if(item.id == id)
                            {
                                dados_backup.splice(index,1);
                            }
                        })
                    dados.map((item,index)=>
                    {
                        if(item.id == id)
                        {
                            dados.splice(index,1);
                        }
                    })
                    setLivrosBackup([...dados_backup]);
                    setLivros([...dados]);
                    Alert.alert('Deletado com sucesso!');
                })
              }
            ]
        );
    }

    const logOut =async () =>
    {
        await AsyncStorage.clear();
        setLogado(false);
        navigation.navigate('Login');
    }

    useEffect(()=>{
        getLivros();
    },[]);

  return (
    <SafeAreaView style={{flex:1}} >
        <View style={{alignItems:'center',backgroundColor:'white'}}>
            <View style={styles.header}>
                <TouchableOpacity onPress={()=>
                    {
                        if(remover)
                        {
                            setRemover(!remover);
                        }
                        else
                        {
                            setshowMenu(!showmenu);
                        }  
                    }} style={styles.menu}><Image source={menu} style={styles.menu}></Image></TouchableOpacity><Text style={styles.title}>LIVRO SOLIDÁRIO</Text>
            </View>
            {showmenu&&!filtrar&&!remover&&
            <View style={styles.abamenu1}>
                <TouchableOpacity style={styles.opcao} onPress={()=>navigation.navigate('Adicionar Livro')}>
                    <View>
                    <Text style={{color:'black', fontWeight:'600'}}>Cadastrar livro</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.opcao} onPress={remove}>
                    <View>
                        <Text style={{color:'black', fontWeight:'600'}}>Remover Livro</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.opcao} onPress={()=>setFiltrar(!filtrar)}>
                    <View>
                        <Text style={{color:'black', fontWeight:'600'}}>Filtrar</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.opcao} onPress={()=>filter('remover',null)}>
                    <View>
                        <Text style={{color:'black', fontWeight:'600'}}>Remover filtro</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.opcao} onPress={()=>logOut()}>
                    <View>
                        <Text style={{color:'black', fontWeight:'600'}}>Log Out</Text>
                    </View>
                </TouchableOpacity>
            </View>}
            {showmenu&&filtrar&&!remover&&
            <>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                    <Text style={styles.text}>Livro</Text>
                    <Text style={styles.text}>Bairro</Text>
                </View>
                <View style={styles.abamenu}>
                    <ScrollView style={{width:'50%',height:'90%'}}>
                        
                        {nomes?.map((item,index)=>(
                            <TouchableOpacity key={item+index} style={styles.filtros} onPress={()=>filter('nome',item)}>
                                <View>
                                    <Text style={styles.text_filtro}>{item}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                    <ScrollView style={{width:'50%',height:'90%'}}>
                        {bairros?.map((item,index)=>(
                            <TouchableOpacity key={item+index} style={styles.filtros} onPress={()=>filter('bairro',item)}>
                                <View>
                                    <Text style={styles.text_filtro}>{item}</Text>
                                </View>
                        </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </>
            }
            {showmenu&&remover&&
            <ScrollView style={{width:'100%',height:'92%'}}>
                {livros?.map((item,index) =>
                    <TouchableOpacity style={styles.livros} key={item._data+index} onPress={()=>excluir_livro(item.id,item._data.nome)}>
                        <Text style={{alignSelf:'center',fontWeight:'700',color:'black'}}>{item._data.nome.toUpperCase()}</Text>
                        <Text style={styles.sub}>USER: {item._data.usuario}</Text>
                        <Text style={styles.sub}>BAIRRO: {item._data.bairro}</Text>
                        <Text style={styles.sub1} onPress={()=>{Linking.openURL('tel:'+item.telefone);}}>Fone: {item._data.telefone}</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>}
            {!showmenu&&
            <ScrollView style={{width:'100%',height:'92%'}}>
                {livros?.map((item,index) =>
                    <View style={styles.livros} key={item._data+index}>
                        <Text style={{alignSelf:'center',fontWeight:'700',color:'black'}}>{item._data.nome.toUpperCase()}</Text>
                        <Text style={styles.sub}>USER: {item._data.usuario}</Text>
                        <Text style={styles.sub}>BAIRRO: {item._data.bairro}</Text>
                        <Text style={styles.sub1} onPress={()=>{Linking.openURL('tel:'+item.telefone);}}>Fone: {item._data.telefone}</Text>
                    </View>
                )}
            </ScrollView>}
        </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection:'row',
    alignItems: 'center',
    justifyContent:'center',
    backgroundColor: 'rgba(6, 5, 71,0.5)',
    width:'100%',
    height:50
  },
  text_filtro:{
    color:'white',
    fontWeight:'700'
  },
  filtros:{
    marginTop:5,
    alignSelf:'center',
    width:'90%',
    height:55,
    borderRadius:10,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'rgba(100, 50, 150,0.5)'
  },
  text:{
    textAlign:'center',
    width:'45%',
    color:'black',
    fontWeight:'700',
    alignSelf:'center'
  },
  abamenu1:{
    flexDirection:'row',
    flexWrap:'wrap',
    alignItems:'center',
    justifyContent:'space-around',
    width:'100%',
    borderWidth:1
  },
  abamenu:{
    flexDirection:'row',
    justifyContent:'space-around',
    width:'100%',
    borderWidth:1
  },
  opcao:{
    marginTop:5,
    alignItems:'center',
    justifyContent:'center',
    width:'45%',
    height:50,
    backgroundColor:'rgba(6, 5, 71,0.4)',
    borderRadius:10
  },
  title:{
    fontWeight: 'bold',
    fontSize: 24,
    color: 'white'
  },
  livros:{
      alignSelf:'center',
      justifyContent:'space-around',
      width:'95%',
      height:100,
      backgroundColor:'rgba(6, 5, 71,0.4)',
      borderRadius:10,
      marginTop:5
  },
  sub:{
    marginLeft:10,
    color:'white',
    fontWeight:'500',
},
  sub1:{
      marginLeft:10,
      color:'white',
      fontWeight:'500',
      textDecorationLine: 'underline'
  },
  menu:{
    position:'absolute',
    left:10,
    width:25,
    height:25
  }
});

export default Home;
