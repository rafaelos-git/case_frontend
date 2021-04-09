import React, {Component} from 'react'
import { 
    View, 
    Text, 
    StyleSheet, 
    ImageBackground,
    FlatList,
    TouchableOpacity,
    Platform
} from 'react-native'

import axios from 'axios'

import { server, showError, showSuccess } from '../common'
import commonStyles from '../commonStyles'
import backgroundImage from '../../assets/imgs/today.jpg'

import User from '../components/User'

export default class App extends Component {
    state = {
        user: {},
        loginUser: this.props?.navigation?.state?.params?.name ? this.props?.navigation?.state?.params?.name : ""
    }

    componentDidMount = () => {
        this.loadUserById()
    }

    loadUserById = async userId => {
        try {
            userId = this.props?.navigation?.state?.params?.id ? this.props?.navigation?.state?.params?.id : -1
            const res = await axios.get(`${server}/users/${userId}`)
            console.log("res.data user",res.data)
            this.setState({ user: res.data[0] })
        } catch(e) {
            showError(e)
        }
    }

    render (){
        return (
            <View style={styles.container}>
                <ImageBackground source={backgroundImage}
                    style={styles.background}>
                    <View style={styles.namePosition}>
                        <Text style={styles.subtitle}>Ola, {this.state.loginUser}</Text>
                    </View>
                    <View style={styles.namePosition}>
                        <TouchableOpacity
                            onPress={()=> this.props.navigation.navigate('Auth')}>
                            <Text style={styles.quit}>Sair</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.titleBar}>
                        <Text style={styles.title}>Informações</Text>
                    </View>
                </ImageBackground>
                <View style={styles.userList}>
                    <User {...this.state.user} toggleState={()=>null}
                            onPress={()=> this.props.navigation.navigate('UpdateUser', {...this.state.user})}
                    />
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        flex: 2,
    },
    userList: {
        flex: 8,
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
    subtitle: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 20,
    },
    namePosition: {
        flexDirection: 'row',
        marginHorizontal: 25,
        justifyContent: 'flex-end',
        marginTop: Platform.OS === 'ios' ? 40 : 10
    },
    quit: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 17,
    },
  })