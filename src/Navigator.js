import React, {Component} from 'react'
import { createAppContainer, createSwitchNavigator } from 'react-navigation'

import Auth from './screens/Auth'
import HomeAdmin from './screens/HomeAdmin'
import UpdateUser from './screens/UpdateUser'
import UpdateAdmin from './screens/UpdateAdmin'
import Home from './screens/Home'

const mainRoutes = {
    Auth: {
        name: 'Auth',
        screen: Auth,
    },
    HomeAdmin: {
        name: 'HomeAdmin',
        screen: HomeAdmin,
    },
    Home: {
        name: 'Home',
        screen: Home,
    },
    UpdateUser: {
        name: 'UpdateUser',
        screen: UpdateUser,
    },
    UpdateAdmin: {
        name: 'UpdateAdmin',
        screen: UpdateAdmin,
    },
}

const mainNavigator = createSwitchNavigator(mainRoutes, {
    initialRouteName: 'Auth'
})

export default createAppContainer(mainNavigator)