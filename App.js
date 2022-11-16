import React, {useState} from 'react';
import {
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Text,
  Modal,
  View,
  ImageBackground,
  FlatList,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QRCode from 'react-native-qrcode-svg';
import QRCodeScanner from 'react-native-qrcode-scanner';

const App = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [scannerVisible, setscannerVisible] = useState(false);
  const [datamodal, setdatamodal] = useState(false);

  const [datahistory, setdatahistory] = useState(false);
  const [barcodehead, setbarcodehead] = useState('');
  const [barcodedata, setbarcodedata] = useState('');
  const onSuccess = e => {
    setscannerVisible(!scannerVisible);
    setdatamodal(true);
    setbarcodedata(e.data);
    console.log(e);
  };

  const [todos, setTodos] = React.useState([]);

  React.useEffect(() => {
    getTodosFromUserDevice();
  }, []);

  React.useEffect(() => {
    saveTodoToUserDevice(todos);
  }, [todos]);

  const addTodo = () => {
    const newTodo = {name: barcodehead, result: barcodedata};
    setTodos([...todos, newTodo]);
    setdatamodal(false);
  };

  const saveTodoToUserDevice = async todos => {
    try {
      const stringifyTodos = JSON.stringify(todos);
      await AsyncStorage.setItem('todos', stringifyTodos);
    } catch (error) {
      console.log(error);
    }
  };

  const getTodosFromUserDevice = async () => {
    try {
      const todos = await AsyncStorage.getItem('todos');
      if (todos != null) {
        setTodos(JSON.parse(todos));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const ListItem = ({todo}) => {
    return (
      <View>
        <TouchableOpacity
          style={styles.datatab}
          onPress={() =>
            Alert.alert(
              'Your Barcode name is' +
                ' ' +
                todo?.name +
                ' ' +
                'and you code info is' +
                ' ' +
                todo?.result,
            )
          }>
          <Text style={styles.datatext}>{todo?.name}</Text>
          <Text style={styles.datatext}>{todo?.result}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.maincontainer}>
      <ImageBackground
        source={{
          uri: 'https://static.vecteezy.com/system/resources/thumbnails/002/018/246/original/abstract-colorful-pastel-gradient-background-free-video.jpg',
        }}
        style={styles.bgimage}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setModalVisible(!modalVisible);
          }}>
          <Text style={styles.buttonText}>Show Code</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setscannerVisible(!scannerVisible);
          }}>
          <Text style={styles.buttonText}>Scan Code</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setdatahistory(!datahistory);
          }}>
          <Text style={styles.buttonText}>Show History</Text>
        </TouchableOpacity>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.headingtext}>YOUR UNIQUE QR</Text>
              <View style={styles.modalView}>
                <QRCode value="https://technixia.com" size={150} />
              </View>
              <TouchableOpacity
                style={styles.smallbutton}
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}>
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={scannerVisible}
          onRequestClose={() => {
            setscannerVisible(!scannerVisible);
          }}>
          <QRCodeScanner
            onRead={onSuccess}
            // flashMode={RNCamera.Constants.FlashMode.torch}
            bottomContent={
              <TouchableOpacity
                style={styles.smallbutton}
                onPress={() => {
                  setscannerVisible(!scannerVisible);
                }}>
                <Text style={styles.buttonText}>CLOSE</Text>
              </TouchableOpacity>
            }
          />
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={datamodal}
          onRequestClose={() => {
            setdatamodal(!datamodal);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.headingtext}>YOUR HEADING</Text>
              <TextInput
                style={styles.input}
                onChangeText={e => setbarcodehead(e)}
                value={barcodehead}
                placeholder="HEADING"
              />
              <Text style={styles.headingtext}>BARCODE DATA</Text>
              <Text
                style={{
                  fontSize: 15,
                  color: 'black',
                }}>
                {barcodedata}
              </Text>
              <TouchableOpacity
                style={styles.savedatabutton}
                onPress={() => {
                  addTodo();
                }}>
                <Text style={styles.buttonText}>SAVE</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={datahistory}
          onRequestClose={() => {
            setdatahistory(!datahistory);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.historymodalView}>
              <Text style={styles.headingtext}>HISTORY DATA</Text>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={todos}
                renderItem={({item}) => <ListItem todo={item} />}
              />
              <TouchableOpacity
                style={styles.smallbutton}
                onPress={() => {
                  setdatahistory(!datahistory);
                }}>
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: 'red',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  historymodalView: {
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: 'red',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    height: '80%',
    width: '90%',
  },
  button: {
    display: 'flex',
    height: 150,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: '60%',
    backgroundColor: 'teal',
    shadowColor: 'teal',
    shadowOpacity: 0.5,
    shadowOffset: {
      height: 10,
      width: 0,
    },
    shadowRadius: 25,
    elevation: 5,
    marginVertical: 20,
  },
  closeButton: {
    display: 'flex',
    height: 60,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF3974',
    shadowColor: '#2AC062',
    shadowOpacity: 0.5,
    shadowOffset: {
      height: 10,
      width: 0,
    },
    shadowRadius: 25,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 22,
  },
  smallbutton: {
    width: 100,
    height: 30,
    backgroundColor: '#87CEEB',
    borderRadius: 20,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  savedatabutton: {
    width: 100,
    height: 30,
    backgroundColor: '#87CEEB',
    borderRadius: 20,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  input: {
    borderRadius: 20,
    width: 200,
    height: 40,
    borderWidth: 0.5,
    elevation: 5,
    backgroundColor: 'white',
  },
  datatab: {
    backgroundColor: 'teal',
    padding: 20,
    width: '100%',
    borderRadius: 20,
    alignSelf: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  datatext: {
    fontWeight: 'bold',
    fontSize: 15,
    color: 'black',
    alignSelf: 'center',
  },
  maincontainer: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  bgimage: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headingtext: {
    fontSize: 25,
    color: 'blue',
    marginVertical: 20,
    fontWeight: '700',
  },
});

export default App;
