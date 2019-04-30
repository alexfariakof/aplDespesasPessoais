import React, { Component } from 'react';
import { View, Text, ImageBackground, Image, TouchableOpacity, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage'

import assets from './assets'

import apiServices from '../../services/ApiServices.js'
import LacamentoComponent from '../../components/LacamentoComponent.js'

class LancamentoScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            errorMessage: null,
            dataSource: null,
            user: null
        }
    }
    static navigationOptions = {
        header: null
    }

    getLancamentoById = async () => {
        try {
            api = new apiServices();
            const data = await api.get('/api/Lancamento/2019-01-01/' + this.state.user.id);
            this.setState({ dataSource: data });
            this.setState({  isLoading: false });
        }
        catch (err) {
            console.error(err);
        }
    };

    async componentDidMount() {
        const access = await AsyncStorage.getItem('@dpApiAccess');

        if (access) {
            this.setState({ user: JSON.parse(access).usuario });
            this.getLancamentoById();
        }
    }

    render() {
        return (
            <ImageBackground
                source={assets.background}
                imageStyle={{ resizeMode: 'stretch' }}
                style={styles.background}
            >
                <View style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                }}
                >
                    <View style={{ height: 52, flexDirection: 'row', backgroundColor: '#C4C4C4', padding: 8 }} >
                        <View style={{ flex: 1 }}>
                            <TouchableOpacity onPress={() => this.props.navigation.openDrawer()} >
                                <Image source={assets.menu} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 5 }}>
                            <Text style={{ textAlign: 'right', fontSize: 32, fontWeight: 'bold', color: 'white' }} >R$ 2000,00</Text>
                        </View>
                    </View>
                    <View style={{ height: 50, flexDirection: 'row', backgroundColor: 'white' }}>
                        <View style={{ flex: 1, alignItems: 'center', width: 30 }} >
                            <TouchableOpacity  >
                                <Image source={assets.arrowLeft} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 4, alignItems: 'center' }} >
                            <Text style={{ fontSize: 32, padding: 4 }} >Abril 2019</Text>
                        </View>
                        <View style={{ flex: 1, alignItems: 'center', width: 30 }} >
                            <TouchableOpacity  >
                                <Image source={assets.arrowRight} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ flex: 3 }}>
                        {this.state.isLoading ?
                            <View style={{ flex: 1, alignItems: 'center' }}>
                                <ActivityIndicator
                                    color="green"
                                    size="large"
                                />
                            </View>
                            : <LacamentoComponent DataSource={this.state.dataSource} />
                        }
                    </View>
                    <View style={{ height: 60, position: 'relative', flexDirection: 'row' }}>
                        <View style={{ flex: 3, alignItems: 'center' }} >
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('Despesa')} >
                                <Image source={assets.btnDespesa} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 3, alignItems: 'center', }} >
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('Receita')} >
                                <Image source={assets.btnReceita} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ImageBackground>
        );
    }
}
export default LancamentoScreen;
