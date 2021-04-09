import React, {Component} from 'react'
import DropDownPicker from 'react-native-dropdown-picker'
import { 
  ImageBackground, 
  Text, 
  StyleSheet, 
  View, 
  TextInput, 
  TouchableOpacity,
  Platform,
  Alert
} from 'react-native'

import axios from 'axios'

import AsyncStorage from '@react-native-community/async-storage'

import backgroundImage from '../../assets/imgs/login.jpg'
import commonStyles from '../commonStyles'

import { server, showError, showSuccess } from '../common'

const initialState = {
  name: '',
  cpf: '',
  email: '',
  password: '',
  confirmPassword: '',
  nivel: 1,
  stageNew: false,
  loginUser: null,
}

export default class Auth extends Component {
  state = {
    ...initialState
  }

  signinOrSignup = () => {
    if(this.state.stageNew) {
      this.signup()
    } else {
      this.signin()
    }
  }

  signup = async () => {
    try {
      await axios.post(`${server}/signup`, {
        name: this.state.name,
        cpf: this.state.cpf,
        email: this.state.email,
        password: this.state.password,
        confirmPassword: this.state.confirmPassword,
        nivel: this.state.nivel
      })
      showSuccess('Usuário cadastrado com sucesso!')
      this.setState({ ...initialState })
    } catch(e) {
      showError(e)
    }
  }

  signin = async () => {
    try {
      const res = await axios.post(`${server}/signin`, {
          email: this.state.email,
          password: this.state.password
      })
      
      this.setState({ loginUser: res.data.name })
      AsyncStorage.setItem('loginInfo',JSON.stringify(this.state.loginUser))

      axios.defaults.headers.common['Authorization'] = `bearer ${res.data.token}`

      if (res.data.nivel === 1){
        this.props.navigation.navigate('Home', res.data)
      } else if (res.data.nivel === 999){
        this.props.navigation.navigate('HomeAdmin', res.data)
      } else {
        showError('Usuário desativado')
      }
      
    } catch(e) {
      showError(e)
    }
  }

  selectNivel (item) {
    this.setState({
      nivel: item.value
    })
  }

  render() {
    const validations = []
    validations.push(this.state.email && this.state.email.includes('@'))
    validations.push(this.state.password && this.state.password.length >= 6)
    
    if(this.state.stageNew) {
      validations.push(this.state.name && this.state.name.trim().length >= 3)
      validations.push(this.state.password === this.state.confirmPassword)
      validations.push(this.state.cpf && this.state.cpf.length == 11)
    }

    const validForm = validations.reduce((t, a) => t && a)

    return (
      <ImageBackground source={backgroundImage} style={styles.background}>
          <Text style={styles.title}>Mind</Text>
          <View style={styles.formContainer}>
            <Text style={styles.subtitle}>
              {this.state.stageNew ? 'Crie sua conta' : 'Informe seus dados'}
            </Text>
            {this.state.stageNew &&
              <DropDownPicker
                items={[
                    {label: 'Padrão', value: 1},
                    {label: 'Administrador', value: 999},
                ]}
                defaultNull
                placeholder="Tipo de usuário"
                containerStyle={{height: 40}}
                onChangeItem={item => this.selectNivel(item)}
              />
            }
            {this.state.stageNew &&
              <TextInput placeholder='Nome' value={this.state.name} 
                style={styles.input} 
                onChangeText={name => this.setState({ name })}/>
            }
            {this.state.stageNew &&
              <TextInput placeholder='CPF' value={this.state.cpf} 
                style={styles.input} 
                onChangeText={cpf => this.setState({ cpf })}/>
            }
            <TextInput placeholder='E-mail' value={this.state.email} 
              style={styles.input} 
              onChangeText={email => this.setState({ email })}/>
            <TextInput placeholder='Senha' value={this.state.password} 
              style={styles.input} secureTextEntry={true}
              onChangeText={password => this.setState({ password })}/>
            {this.state.stageNew &&
              <TextInput placeholder='Confirmação de senha' 
                value={this.state.confirmPassword} 
                style={styles.input} secureTextEntry={true}
                onChangeText={confirmPassword => this.setState({ confirmPassword })}/>
            }
            <TouchableOpacity onPress={this.signinOrSignup}
              disabled={!validForm}>
              <View style={[styles.button, validForm ? {} : { backgroundColor: '#AAA' }]}>
                <Text style={styles.buttonText}>
                  {this.state.stageNew ? 'Registrar' : 'Entrar'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={{ padding: 10 }}
            onPress={() => this.setState({ stageNew: !this.state.stageNew })}>
            <Text style={styles.buttonText}>
              {this.state.stageNew ? 'Já possui conta?' : 'Ainda não possui conta?'}
            </Text>
          </TouchableOpacity>
      </ImageBackground>
    )
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontFamily: commonStyles.fontFamily,
    color: commonStyles.colors.secondary,
    fontSize: 70,
    marginBottom: 10
  },
  subtitle: {
    fontFamily: commonStyles.fontFamily,
    color: '#FFF',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 10
  },
  input: {
    backgroundColor: '#FFF',
    marginTop: 10,
    padding: Platform.OS == 'ios' ? 15 : 10
  },
  formContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 20,
    width: '90%',
    borderRadius: 20,
  },
  button: {
    backgroundColor: '#080',
    marginTop: 10,
    padding: 10,
    alignItems: 'center',
    borderRadius: 20
  },
  buttonText: {
    fontFamily: commonStyles.fontFamily,
    color: '#FFF',
    fontSize: 20
  }
})
