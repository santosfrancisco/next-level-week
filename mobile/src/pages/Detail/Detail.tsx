import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native'
import { StyleSheet, View, Text, TouchableOpacity, Image, SafeAreaView, Linking } from 'react-native';
import { Feather as Icon, FontAwesome } from '@expo/vector-icons'
import { RectButton } from 'react-native-gesture-handler';
import * as MailComponser from 'expo-mail-composer' 
import api from '../../services/api'

interface Params {
  point_id: string
}

interface Point {
  id: number
  name: string
  email: string
  whatsapp: string
  city: string
  uf: string
  latitude: number
  longitude: number
  image: string
  items: {
    title: string
  }[]
}


const Details: React.FC = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const routeParams = route.params as Params

  const [point, setPoint] = useState<Point>({} as Point)

  useEffect(() => {
    api.get(`/points/${routeParams.point_id}`)
      .then(({ data }) => {
      console.log("Details:React.FC -> data", data)
        setPoint(data)
      })
  }, [])

  const handleNavigateBack = () => {
    navigation.goBack()
  }

  const handleWhatsapp = () => {
    Linking.openURL(`whatsapp://send?phone=${point?.whatsapp}&text=Tenho interesse na coleta de resíduos`)
  }

  const handleComposeMail = () => {
    MailComponser.composeAsync({
      subject: 'Interesse na coleta de resíduos',
      recipients: [point?.email]
    })
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleNavigateBack}>
          <Icon name="arrow-left" size={32} color="#34cb79" />
        </TouchableOpacity>
        <Image
          style={styles.pointImage}
          source={{ 
            uri: 'https://images.unsplash.com/photo-1542739674-b449a8938b59?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60'
          }} 
        />
        <Text style={styles.pointName}>{point.name}</Text>
        <Text style={styles.pointItems}>{point?.items?.map(item => item.title).join(', ')}</Text>
        <View style={styles.address}>
          <Text style={styles.addressTitle}>Endereço</Text>
        <Text style={styles.addressContent}>{point.city}, {point.uf}</Text>
        </View>
      </View>
      <View style={styles.footer}>
          <RectButton style={styles.button} onPress={handleWhatsapp}>
              <FontAwesome name="whatsapp" color="#fff" size={20} />
            <Text style={styles.buttonText}>Whatsapp</Text>
          </RectButton>

          <RectButton style={styles.button} onPress={handleComposeMail}>
              <Icon name="mail" color="#fff" size={20} />
            <Text style={styles.buttonText}>E-mail</Text>
          </RectButton>
      </View>
    </SafeAreaView>
  );
}

export default Details;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    paddingTop: 32,
  },

  pointImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
    borderRadius: 10,
    marginTop: 32,
  },

  pointName: {
    color: '#322153',
    fontSize: 28,
    fontFamily: 'Ubuntu_700Bold',
    marginTop: 24,
  },

  pointItems: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
    color: '#6C6C80'
  },

  address: {
    marginTop: 32,
  },
  
  addressTitle: {
    color: '#322153',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  },

  addressContent: {
    fontFamily: 'Roboto_400Regular',
    lineHeight: 24,
    marginTop: 8,
    color: '#6C6C80'
  },

  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#999',
    paddingVertical: 20,
    paddingHorizontal: 32,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  
  button: {
    width: '48%',
    backgroundColor: '#34CB79',
    borderRadius: 10,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    marginLeft: 8,
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Roboto_500Medium',
  },
});