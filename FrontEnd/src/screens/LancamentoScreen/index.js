import React, { Component } from 'react';
import { View, Text, ImageBackground, Image, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage'

import LacamentoComponent from './Component/LacamentoComponent.js'
import DateSpinnerComponent from './Component/DateSpinnerComponent.js'
import assets from './assets'
import isIphoneX from '../../services/IsIphoneX.js'
import apiServices from '../../services/ApiServices.js'

class LancamentoScreen extends Component {
<<<<<<< HEAD
<<<<<<< HEAD
    static navigationOptions = { header: null }
=======
    //static navigationOptions = { header: null   }
>>>>>>> f96139fe6f1212b6db24831903597979e119047f
=======
    //static navigationOptions = { header: null   }
>>>>>>> f96139fe6f1212b6db24831903597979e119047f

    state = {
        isLoading: true,
        errorMessage: null,
        dataSource: null,
        user: null,
        saldo: '0,00',
        selectedDate: null,
        isLoaded: false
    }

    handlerGetSpinnerSelectedDate = async (value) => {
        await this.setState({ selectedDate: value });
        this.getSaldoById();
        this.getLancamentoById();
    }

    getSaldoById = async () => {
        try {
            api = new apiServices();
            let json = await api.get('/api/Lancamento/saldo/' + this.state.user.id);
            this.setState({ saldo: json });
        }
        catch (err) {
            console.error(err);
        }
    };

    getLancamentoById = async () => {
        try {
            api = new apiServices();
            const json = await api.get('/api/Lancamento/' + this.state.selectedDate + '/' + this.state.user.id);
            this.setState({ dataSource: json });
        }
        catch (err) {
            console.error(err);
        }
    };

    async componentDidMount() {
        const access = await AsyncStorage.getItem('@dpApiAccess');

        if (access) {
            this.setState({ user: JSON.parse(access).usuario });
            hoje = new Date();
            ano = hoje.getFullYear();
            mes = hoje.getMonth() + 1;
            this.getSaldoById();
            this.handlerGetSpinnerSelectedDate(ano + '-' + mes + '-01');
            this.setState({ isLoading: false });
        }
    }

    renderItem = lancamento => {
        return <LacamentoComponent onPress={() => {
            if (lancamento.item.idReceita === 0)
                this.props.navigation.navigate('Despesa', { idDespesa: lancamento.item.idDespesa, operation: 'PUT', refresh: () => { this.getLancamentoById(); } });
            else
                this.props.navigation.navigate('Receita', { idReceita: lancamento.item.idReceita, operation: 'PUT', refresh: () => { this.getLancamentoById(); } });
        }}
            data={lancamento.item.data}
            categoria={lancamento.item.categoria}
            descricao={lancamento.item.descricao}
            valor={lancamento.item.valor} />
    }

    render() {
        return (
            <ImageBackground
                source={assets.background}
                imageStyle={{ resizeMode: 'stretch' }}
                style={styles.background}
            >
                <View style={[isIphoneX() ?
                    {
                        marginTop: 32,
                        marginBottom: 8,
                        flex: 1,
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                    } : null,
                    {
                        flex: 1,
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                    }]}
                >
                    <View style={{ height: 52, flexDirection: 'row', backgroundColor: '#C4C4C4', padding: 8 }} >
                        <View style={{ flex: 1 }}>
                            <TouchableOpacity onPress={() => this.props.navigation.openDrawer()} >
                                <Image source={assets.menu} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 5 }}>
                            <Text style={{ textAlign: 'right', fontSize: 32, fontWeight: 'bold', color: 'white' }} >{"R$ " + this.state.saldo}</Text>
                        </View>
                    </View>
                    <DateSpinnerComponent handleGetCurrentDate={this.handlerGetSpinnerSelectedDate} />
                    <View style={{ flex: 3 }}>
                        {this.state.isLoading ?
                            <View style={{ flex: 1, alignItems: 'center' }}>
                                <ActivityIndicator
                                    color="red"
                                    size="large"
                                />
                            </View>
                            : <FlatList
                                data={this.state.dataSource}
                                renderItem={this.renderItem}
                                pagingEnabled
                                keyExtractor={item => item.id.toString()}
                            />
                        }
                    </View>
                    <View style={{ height: 60, position: 'relative', flexDirection: 'row' }}>
                        <View style={{ flex: 3, alignItems: 'center' }} >
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('Despesa', {  operation: 'POST', refresh: () => { this.getLancamentoById(); } })} >
                                <Image source={assets.btnDespesa} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 3, alignItems: 'center', }} >
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('Receita', { operation: 'POST', refresh: () => { this.getLancamentoById(); } })} >
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

