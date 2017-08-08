import React from 'react'
import { ScrollView, Text, Image, View, StyleSheet, TextInput, TouchableHighlight, ListView, ActivityIndicator } from 'react-native'
import { Button, Text as NBText } from 'native-base'
import { Images } from '../Themes'
import { Actions as NavigationActions } from 'react-native-router-flux'
import Finance from '../Utils/Finance'
import Icon from 'react-native-vector-icons/MaterialIcons'
import StockCell from './FundSuggestionComponents/StockCell'
import { connect } from 'react-redux'
import LoginActions from '../Redux/LoginRedux'

import styles from './Styles/FundSelectionScreenStyles'

class FundSuggestionScreen extends React.Component {
  constructor (props) {
    super(props)
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this.state = {
      dataSource: ds.cloneWithRows([]),
      text: props['fund' + props.fundNumber],
      fetching: true
    }
    this.onFundSelection = this.onFundSelection.bind(this)
  }

  componentWillMount () {
    const that = this
    Finance.getSuggestionFunds(this.props.year)
      .then(suggestedFunds => {
        that.setState({
          dataSource: that.state.dataSource.cloneWithRows(suggestedFunds),
          fetching: false
        })
      })
      .catch(err => console.log(error))
  }

  onFundSelection (symbol) {
    if (this.props.fundNumber === 1) {
      this.props.changeFund1Dispatch(symbol)
    } else {
      this.props.changeFund2Dispatch(symbol)
    }
  }

  render () {
    return (
      <View style={styles.container}>
        <View style={styles.triContainer}>
          <View style={styles.leftContainer}>
            <Icon style={{marginLeft: 15}} name='arrow-back' size={35} color='white' onPress={() => NavigationActions.pop()} />
          </View>
          <View style={styles.innerContainer}>
            <Text style={styles.subtitle}>
              Select one symbol
            </Text>
          </View>
          <View style={styles.rightContainer}>
          </View>
        </View>
        {this.state.fetching ? <ActivityIndicator color="blue" size="large" /> : <NBText />}
        <View style={styles.suggestion}>
          <ListView
            dataSource={this.state.dataSource}
            renderRow={stock => <StockCell stock={stock} watchlistCache={this.state.watchlistCache} onFundSelection={this.onFundSelection} />} />
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    year: state.login.year
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    changeFund1Dispatch: (fund) => dispatch(LoginActions.changeFund(fund)),
    changeFund2Dispatch: (fund) => dispatch(LoginActions.changeFund2(fund))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FundSuggestionScreen)
