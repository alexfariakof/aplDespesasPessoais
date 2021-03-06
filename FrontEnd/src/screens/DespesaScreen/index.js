import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation'
import { View, ScrollView, Text, ImageBackground, TextInput, Image, Picker, TouchableOpacity, ActivityIndicator, Button } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Dimensions } from 'react-native';
import DatePicker from 'react-native-datepicker';
import { TextInputMask } from 'react-native-masked-text';

import assets from './assets'
import styles from './styles'
import apiServices from '../../services/ApiServices.js'
import isIphoneX from '../../services/IsIphoneX.js'



class DespesaScreen extends Component {
    static navigationOptions = { header: null }

    state = {
        isLoading: true,
        user: null,
        dsCategoriaDespesa: [],
        categoria: null,
        data: null,
        idDespesa: null,
        descricao: null,
        valor: 'R$0,00',
        errors: {
            data: null,
            descricao: null,
            valor: null,
            categoria: null
        }
    }

    async componentDidMount() {
        const access = await AsyncStorage.getItem('@dpApiAccess');

        if (access) {
            this.setState({ user: JSON.parse(access).usuario });
            this.getListCategoria();
        }

        if(this.props.navigation.state.params.operation === 'PUT'){
            this.getDespesaById();
        }

        this.props.navigation.addListener(
            'didFocus',
            payload => {

                if(this.props.navigation.state.params.operation === 'PUT'){
                    this.getDespesaById();
                }
                else
                    this.clearDespesa();    
            }
        );
    }

    getDespesaById = () => {
        const idDespesa = this.props.navigation.state.params.idDespesa;
        api.get('/api/Despesa/' + idDespesa, (json) => {
            
            var formattedDate = new Date(json.despesa.data);
            var newDate =  ('0' + formattedDate.getDate()).slice(-2) + '-' + ('0' + (formattedDate.getMonth() + 1)).slice(-2) + '-' + formattedDate.getFullYear().toString();

            if (json.message){
                this.setState({
                    categoria: json.despesa.idCategoria,
                    data: newDate,
                    idDespesa: json.despesa.id,
                    descricao: json.despesa.descricao,
                    valor: 'R$'+ json.despesa.valor,
                });
            }
            this.setState({ isLoading: false });
        });
    }

    getListCategoria = async () => {
        try {
            api = new apiServices();
            const json = await api.get('/api/Categoria/byTipoCategoria/' + this.state.user.id + '/1');
            this.setState({ dsCategoriaDespesa: json, isLoading: false });
        }
        catch (err) {
            console.error(err);
        }
    };

    saveDespesa = async () => {
        if (!this.isValid(this.state))
            return;

        const refresh = this.props.navigation.state.params.refresh;
        const body = {
            idUsuario: this.state.user.id,
            id: this.state.idDespesa,
            idCategoria: this.state.categoria,
            data: this.state.data !== null ? this.state.data.split('-')[2] + '-' + this.state.data.split('-')[1] + '-' + this.state.data.split('-')[0] : null,
            descricao: this.state.descricao,
            valor: parseFloat(this.state.valor.replace('R$', '').replace('.', '').replace(',', '.'), (2)),
            dataVencimento: '2019-04-27'
        }

        try {
            api = new apiServices();
            this.setState({ isLoading: true });
            if (this.state.idDespesa === null) {
                await api.post('/api/Despesa', body, (json) => {
                    //alert(JSON.stringify(json));
                    if (json.message === true) {
                        refresh();
                        alert('Despesa incluída com sucesso.');
                        this.clearDespesa();                       
                        this.props.navigation.goBack();
                    }
                    else
                        alert(json.message);
                    this.setState({ isLoading: false });
                });
            }
            else {
                await api.put('/api/Despesa', body, (json) => {
                    //alert(JSON.stringify(json));
                    if (json.message === true) {
                        refresh();
                        alert('Despesa atualizada com sucesso.');
                        this.clearDespesa();
                        this.props.navigation.goBack();
                    }
                    else
                        alert(json.message);
                    this.setState({ isLoading: false });
                });
            }
        }
        catch (err) {
        alert('Erro ao realiza operação. Tente mais tarde.');
        //console.error(err);
    }
}

isValid = (body) => {
    var isTrue = true;

    if ((body.categoria === null) || (body.categoria === undefined) || (body.categoria === 0)) {
        body.errors.categoria = 'Uma categoria deve ser selecionada!';
        isTrue = false;
    }
    else
        body.errors.categoria = null;

    if ((body.data === null) || (body.data === undefined) || (body.data.trim() === '')) {
        body.errors.data = 'Uma data deve ser selecionada!';
        isTrue = false;
    }
    else
        body.errors.data = null;

    if ((body.descricao === null) || (body.descricao === undefined) || (body.descricao.trim() === '')) {
        body.errors.descricao = 'A descrição deve ser preenchida!';
        isTrue = false;
    }
    else
        body.errors.descricao = null;

    if (parseFloat(body.valor.replace('R$', '').replace('.', '').replace(',', '.'), 2) <= 0) {
        body.errors.valor = 'O valor deve ser > 0!';
        isTrue = false;
    }
    else
        body.errors.valor = null

    this.setState({ errors: body.errors });
    return isTrue;
}

clearDespesa = () => {
    this.setState({
        data: null,
        idDespesa: null,
        descricao: null,
        valor: 'R$0,00',
        isLoading: false,
        errors: {
            data: null,
            descricao: null,
            valor: null,
            categoria: null
        }
    });
}

render() {
    const dim = Dimensions.get('window');
    const { isLoading } = this.state;
    return (
        <ImageBackground
            source={assets.background}
            imageStyle={{ resizeMode: 'stretch' }}
            style={styles.background}
        >
            <View><TouchableOpacity onPress={() => { this.clearDespesa(); this.props.navigation.goBack(); }}  ><Text>Voltar</Text></TouchableOpacity></View>
            <View style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'space-between'
            }}
            >
<<<<<<< HEAD
<<<<<<< HEAD
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
                    <View><TouchableOpacity onPress={() => { this.clearDespesa(); this.props.navigation.goBack(); }}  ><Text>Voltar</Text></TouchableOpacity></View>
                    <View style={{ backgroundColor: '#D45959' }} >
                        <Text style={{
                            fontSize: 48,
                            color: 'white',
                            textAlign: 'right',
                            padding: 8
=======
=======
>>>>>>> f96139fe6f1212b6db24831903597979e119047f
                <View style={{ backgroundColor: '#D45959' }} >
                    <Text style={{
                        fontSize: 48,
                        color: 'white',
                        textAlign: 'right',
                        padding: 8
<<<<<<< HEAD
>>>>>>> f96139fe6f1212b6db24831903597979e119047f
=======
>>>>>>> f96139fe6f1212b6db24831903597979e119047f

                    }} >{this.state.valor}</Text>
                </View>
                <ScrollView>
                    <View style={{ paddingLeft: 4, paddingRight: 4 }} >
                        <View style={{ borderBottomWidth: 2, borderColor: '#C4C4C4' }} >
                            <Button title="Add Categoria" color="#841584" accessibilityLabel="Adicione uma categoria nova"
                                onPress={() => this.props.navigation.navigate('Categoria', { goBackScreen: 'Despesa', refresh: () => { this.getListCategoria(); } })} />

                            <Picker style={{ paddingTop: 0 }}
                                selectedValue={this.state.categoria}
                                style={styles.text}
                                onValueChange={(itemValue, itemIndex) =>
                                    this.setState({ categoria: itemValue })
                                }>
                                {this.state.dsCategoriaDespesa.map((item, key) => (
                                    <Picker.Item label={item.descricao} value={item.id} key={key} />)
                                )}
                            </Picker>
                        </View>
                        <View style={styles.ViewCentralizar} >
                            <Text style={{ color: 'red' }}> {this.state.errors.categoria} </Text>
                        </View>
                        <View style={styles.text}>
                            <DatePicker
                                date={this.state.data}
                                mode="date"
                                placeholder="  Selecione uma data"
                                format="DD-MM-YYYY"
                                minDate="2016-05-01"
                                maxDate="2080-12-30"
                                confirmBtnText="Confirma"
                                cancelBtnText="Cancelar"
                                customStyles={{
                                    dateIcon: {
                                        position: 'absolute',
                                        left: dim.width - 60,
                                        top: 4,
                                        margin: 0
                                    },
                                    dateInput: {
                                        height: 28,
                                        fontSize: 24,
                                        color: 'white',
                                        marginTop: 4,
                                        marginBottom: 4,
                                        borderWidth: 0,
                                        border: 0
                                    }
                                }
                                }
                                onDateChange={(date) => { this.setState({ data: date }) }}
                            />
                        </View>
                        <View style={styles.ViewCentralizar} >
                            <Text style={{ color: 'red' }}> {this.state.errors.data} </Text>
                        </View>
                        <TextInput style={styles.text} maxLength={100} clearButtonMode="always" placeholder='Digite a descrição'
                            onChangeText={(descricao) => this.setState({ descricao })} value={this.state.descricao} >
                        </TextInput>
                        <View style={styles.ViewCentralizar} >
                            <Text style={{ color: 'red' }}> {this.state.errors.descricao} </Text>
                        </View>
                        <TextInputMask style={styles.text} maxLength={10} clearButtonMode="always" placeholder='Entre com o valor da Despesa'
                            keyboardType='decimal-pad' onChangeText={(valor) => this.setState({ valor })} value={this.state.valor}
                            type={'money'}
                            options={{
                                precision: 2,
                                separator: ',',
                                delimiter: '.',
                                unit: 'R$',
                                suffixUnit: ''
                            }}>
                        </TextInputMask>
                        <View style={styles.ViewCentralizar} >
                            <Text style={{ color: 'red' }}> {this.state.errors.valor} </Text>
                        </View>
                    </View>
                    <View style={styles.ViewCentralizar} >
                        {isLoading ? (
                            <ActivityIndicator
                                style={styles.btnIniciar}
                                color="green"
                                size="large"
                            />
                        ) :
                            (
                                <TouchableOpacity style={styles.btnOkDespesa} onPress={() => { this.saveDespesa() }}>
                                    <Image source={assets.btnOkDespesa} />
                                </TouchableOpacity>
                            )
                        }
                    </View>
                </ScrollView>
            </View>
        </ImageBackground>
    );
}
}
export default DespesaScreen;