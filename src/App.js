import './App.css';
import * as React from 'react';
import axios from 'axios';

const API_TOKEN = process.env.REACT_APP_API_TOKEN;

class App extends React.Component {
  state = {
    selectedSymbol: 'UNKNOWN',
    date: undefined,
    value: 0,
    availableSymbols: [
      { apiName: 'USD', displayName: 'Dollar' },
      { apiName: 'ILS', displayName: 'Shekel' },
      { apiName: 'GBP', displayName: 'Pound' },
      { apiName: 'JPY', displayName: 'Yen' },
    ],
    money: 1000,
    success: true,
  };

  onSymbolChange = (event) => {
    const selected = event.target.value;
    this.setState(
      {
        selectedSymbol: selected,
        money: 1000,
      },
      () => {
        this.getExchangeRate();
      }
    );
  };

  onDateChange = (event) => {
    const selected = event.target.value;
    this.setState(
      {
        date: selected,
      },
      () => {
        this.getExchangeRate();
      }
    );
  };

  onMoneyChange = (event) => {
    this.setState({
      money: event.target.value,
    });
  };

  hasAllRequiredData = () => {
    return this.state.date && this.state.selectedSymbol != 'UNKNOWN';
  };

  getExchangeRate = () => {
    if (this.hasAllRequiredData()) {
      axios
        .get('http://api.exchangeratesapi.io/v1/' + this.state.date, {
          params: {
            access_key: API_TOKEN,
            symbols: this.state.selectedSymbol,
            format: 1,
          },
        })
        .then((response) => {
          if (response.data.success) {
            this.setState({
              value: response.data.rates[this.state.selectedSymbol],
            });
          } else {
            this.setState({
              success: false,
            });
          }
        });
    }
  };

  render() {
    return (
      <div>
        <h1>
          Forex Converter
          {this.hasAllRequiredData() && (
            <span>
              ({this.state.selectedSymbol} - {this.state.date})
            </span>
          )}
        </h1>
        <select
          value={this.state.selectedSymbol}
          onChange={this.onSymbolChange}
        >
          <option value={'UNKNOWN'} disabled={true}>
            Choose a symbol
          </option>
          {this.state.availableSymbols.map((symbol) => {
            return <option value={symbol.apiName}>{symbol.displayName}</option>;
          })}
        </select>
        <br />
        <br />
        {this.state.success ? (
          <div>
            <input
              type={'date'}
              value={this.state.date}
              onChange={this.onDateChange}
            />
            <br />
            <br />
            The exchange rate is:{' '}
            <input value={this.state.value} disabled={true} />
            <br />
            <br />
            {this.state.value > 0 && (
              <div>
                How much euro do you have?{' '}
                <input
                  type={'number'}
                  onChange={this.onMoneyChange}
                  value={this.state.money}
                />
                <br />
                <br />
                Your money equals {this.state.money * this.state.value}{' '}
                {this.state.selectedSymbol}
              </div>
            )}
          </div>
        ) : (
          <div>Something went wrong, contact the administartor</div>
        )}
      </div>
    );
  }
}

export default App;
