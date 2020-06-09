import React, { useState, useEffect } from 'react'
import {
  StyleSheet,
  View,
  Text,
  Image,
  ImageBackground,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import {
  RectButton,
} from 'react-native-gesture-handler'
import RNPickerSelect from 'react-native-picker-select';
import { Feather as Icon } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'

interface UFResponse {
  nome:	string
  sigla: string
}

interface CityResponse {
  nome: string
}

interface UF {
  label:	string
  value: string
}

interface City {
  label: string
  value: string
}


const Home = () => {
  const navigation = useNavigation()

  const [uf, setUf] = useState('')
  const [city, setCity] = useState('')

  const [ufs, setUfs] = useState<UF[]>([])
  const [cities, setCities] = useState<City[]>([])

  useEffect(() => {
    axios.get<UFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
      .then(({ data }) => {
        const IBGEUFs = data.map(uf => ({
          label: uf.nome,
          value: uf.sigla
        }))
        setUfs(IBGEUFs)
      })
  }, [])

  useEffect(() => {
    if(uf !== '') {
      axios.get<CityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios?orderBy=nome`)
      .then(({ data }) => {
        const IBGECities = data.map(city => ({
          label: city.nome,
          value: city.nome,
        }))
        setCities(IBGECities)
      })
    }
  }, [ufs, uf])

  const handleNavigateToPoints = () => {
    if(!uf || ! city) return Alert.alert('Ooops...', 'Por favor informe estado e cidade.')
    navigation.navigate('Points', { uf, city })
  }
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={ Platform.OS === 'ios' ? 'padding' : undefined }
    >
      <ImageBackground
        source={require('../../assets/home-background.png')}
        style={styles.container}
        imageStyle={{ width: 274, height: 368 }}
      >
        <View style={styles.main}>
          <Image source={require('../../assets/logo.png')} />
          <View>
            <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
            <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
          </View>
        </View>
        <View style={styles.footer}>
          <RNPickerSelect 
            style={pickerSelectStyles}
            placeholder={{ label: "Selecione o Estado (UF)"}}
            value={uf}
            items={ufs}
            onValueChange={city => setUf(city)}
            useNativeAndroidPickerStyle={false}
            Icon={() => <Icon name="chevron-down" color="#A0A0B2" size={24} />}
          />
          <RNPickerSelect 
            style={pickerSelectStyles}
            placeholder={{ label: "Selecione a cidade"}}
            disabled={!cities.length}
            value={city}
            items={cities}
            onValueChange={(city) => setCity(city)}
            useNativeAndroidPickerStyle={false}
            Icon={() => <Icon name="chevron-down" color="#A0A0B2" size={24} />}
          />
          <RectButton style={styles.button} onPress={handleNavigateToPoints}>
            <View style={styles.buttonIcon}>
              <Text>
                <Icon name="arrow-right" color="#fff" size={24} />
              </Text>
            </View>
            <Text style={styles.buttonText}>
              Entrar
            </Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  )
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  iconContainer: {
    paddingVertical: 20,
    paddingHorizontal: 10
  },
});


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});

export default Home
