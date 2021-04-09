import React, {Component, useEffect} from 'react'
import { 
  ImageBackground, 
  Text, 
  StyleSheet, 
  View, 
  TextInput, 
  TouchableOpacity,
  Platform,
  Button
} from 'react-native'

import axios from 'axios'

import backgroundImage from '../../assets/imgs/today.jpg'
import commonStyles from '../commonStyles'

import { server, showError, showSuccess } from '../common'

const initialState = {
    email: '',
    password: '',
    confirmPassword: '',
}

export default class App extends Component {
    state = {
        ...initialState,
        name: this.props?.navigation?.state?.params?.name ? this.props?.navigation?.state?.params?.name : "",
        cpf: this.props?.navigation?.state?.params?.cpf ? this.props?.navigation?.state?.params?.cpf : "",
        email: this.props?.navigation?.state?.params?.email ? this.props?.navigation?.state?.params?.email : ""
    }

    edit = async userId => {
        userId = this.props?.navigation?.state?.params?.id ? this.props?.navigation?.state?.params?.id : -1

        try {
            const res = await axios.put(`${server}/users/${userId}`, {
            email: this.state.email,
            password: this.state.password,
            confirmPassword: this.state.confirmPassword
        })

        console.log(this.props?.navigation?.state?.params?.nivel)
        this.props.navigation.navigate('Home', this.props.navigation.state.params)

        } catch(e) {
          showError(userId)
        }
    }

    userScreen = () => {
        this.props.navigation.navigate('Home', this.props.navigation.state.params)
    }

    render (){
        const validations = []
        validations.push(this.state.email && this.state.email.includes('@'))
        validations.push(this.state.password && this.state.password.length >= 6)
        validations.push(this.state.password === this.state.confirmPassword)

        const validForm = validations.reduce((t, a) => t && a)
        return (
            <View style={styles.container}>
                <ImageBackground source={backgroundImage}
                    style={styles.background}>
                    <TouchableOpacity
                        onPress={() => this.userScreen()}>
                        <View style={styles.back}>
                            <Text style={styles.subtitle}>
                                Voltar
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.titleBar}>
                        <Text style={styles.title}>Editar Dados</Text>
                    </View>
                </ImageBackground>
                <View style={styles.edit}>
                    <View style={styles.formContainer}>
                        <TextInput placeholder='Nome' value={this.state.name} 
                            style={styles.input} 
                            editable={false}
                            onChangeText={name => this.setState({ name })}/>
                        <TextInput placeholder='CPF' value={this.state.cpf} 
                            style={styles.input} 
                            editable={false}
                            onChangeText={cpf => this.setState({ cpf })}/>
                        <TextInput placeholder='E-mail' value={this.state.email} 
                            style={styles.input} 
                            editable={false}
                            onChangeText={email => this.setState({ email })}/>
                        <TextInput placeholder='Nova senha' value={this.state.password} 
                            style={styles.input} secureTextEntry={true}
                            onChangeText={password => this.setState({ password })}/>
                        <TextInput placeholder='Confirmação nova senha' 
                            value={this.state.confirmPassword} 
                            style={styles.input} secureTextEntry={true}
                            onChangeText={confirmPassword => this.setState({ confirmPassword })}/>
                        <TouchableOpacity onPress={()=>this.edit()}>
                            <View style={[styles.button, validForm ? {} : { backgroundColor: '#AAA' }]}>
                                <Text style={styles.buttonText}>
                                    Salvar
                                </Text>
                            </View>
                    </TouchableOpacity>
                    </View>

                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    background: {
      flex: 3,
    },
    edit: {
        paddingTop: 60,
        flex: 7,
        alignItems: 'center',
    },
    titleBar: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    title: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 50,
        marginLeft: 20,
        marginBottom: 20,
    },
    input: {
        backgroundColor: '#FFF',
        marginTop: 10,
        padding: Platform.OS === 'ios' ? 15 : 10
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
        borderRadius: 7
    },
    buttonText: {
        fontFamily: commonStyles.fontFamily,
        color: '#FFF',
        fontSize: 20
    },
    back: {
        width: '15%',
        fontSize: 15,
        backgroundColor: '#AAA',
        marginTop: Platform.OS === 'ios' ? 40 : 10,
        marginLeft: 10,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50
    },
    subtitle: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 20,
    },
    back: {
        flexDirection: 'row',
        marginHorizontal: 25,
        marginTop: Platform.OS === 'ios' ? 40 : 10
    }
  })