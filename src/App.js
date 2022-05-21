import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const BUY_TAX = 0.05; // 5%
  const SELL_TAX = 0.05; // 5%
  const [treasury, setTreasury] = useState(100);
  const [mockCoins, setMockCoins] = useState(100);
  const [coinValue, setCoinValue] = useState(1);

  useEffect(() => {
    setCoinValue(treasury / mockCoins);
  }, [treasury, mockCoins]);

  const [users, setUsers] = useState([
    {
      id: 0,
      name: 'User 0',
      money: 1000,
      coins: 0,
    },
  ]);

  const [selectedUserId, setSelectedUserId] = useState(0);

  const buyMockCoinsWithFiat = (fiat) => {
    if (users[selectedUserId].money < fiat) {
      console.error('Not enough money');
      return;
    }

    // Add fiat to treasury
    setTreasury((treasury) => treasury + fiat);

    // Create coins based on (amount / coinValue) with 5% tax
    const newCoins = (fiat / coinValue) * (1 - BUY_TAX);
    console.log(
      `Purchasing ${newCoins} mock coins for user ${selectedUserId} at $${coinValue} per coin`
    );

    // Add coins to selected user and remove fiat

    setUsers((users) => {
      return users.map((user) => {
        if (user.id === selectedUserId) {
          console.log(`Adding ${newCoins} mock coins to user ${user.id}`);
          return {
            ...user,
            money: user.money - fiat,
            coins: user.coins + newCoins,
          };
        }
        return user;
      });
    });

    // Add coins to total mockCoins in circulation

    setMockCoins((mockCoins) => mockCoins + newCoins);
  };

  const buyMockCoinsWithAllFiat = () => {
    const fiat = users[selectedUserId].money;
    buyMockCoinsWithFiat(fiat);
  };

  const sellMockCoins = (coins) => {
    if (users[selectedUserId].coins < coins) {
      console.error(
        `User ${selectedUserId} does not have enough coins to sell`
      );
      return;
    }

    console.log(
      `Selling ${coins} mock coins for user ${selectedUserId} at ${coinValue} per coin`
    );

    // Calculate Coin Value
    const sellCoinValue = coins * coinValue * (1 - SELL_TAX);

    // Remove amount from treasury with 5% tax
    setTreasury((treasury) => treasury - sellCoinValue);

    // Burn coins from user and total coins in circulation
    setMockCoins((mockCoins) => mockCoins - coins);

    // Remove coins from user, add fiat to user

    setUsers((users) =>
      users.map((user) => {
        if (user.id === selectedUserId) {
          return {
            ...user,
            money: user.money + sellCoinValue,
            coins: user.coins - coins,
          };
        }
        return user;
      })
    );
  };

  const sellAllMockCoins = () => {
    const coins = users[selectedUserId].coins;
    sellMockCoins(coins);
  };

  const addUser = (user) => {
    setUsers([...users, user]);
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    console.log('Adding user');
    addUser({
      id: users.length,
      name: `User ${users.length}`,
      money: 1000,
      coins: 0,
    });
  };

  return (
    <div className='App'>
      <div>
        <strong>Buy Tax</strong>: {BUY_TAX * 100}% / <strong>Sell Tax</strong>:{' '}
        {SELL_TAX * 100}%
      </div>
      <div>
        <strong>Treasury (Project Money)</strong>: ${treasury.toFixed(4)}
      </div>
      <div>
        <strong>Total MOCK Coins (in circulation)</strong>:{' '}
        {mockCoins.toFixed(4)}
      </div>
      <div>
        <strong>Total Value of All MOCK Coins in circulation</strong>: $
        {(mockCoins * coinValue).toFixed(4)}
      </div>
      <div>
        <strong>Value per MOCK Coin</strong>: ${coinValue.toFixed(4)}
      </div>
      <div>
        <h3>Users</h3>
        <div className='user-actions-section'>
          <h4>Actions</h4>
          <p>Selected User: {selectedUserId}</p>
          <div className='user-actions-ctn'>
            <select
              onChange={(e) => {
                e.preventDefault();
                setSelectedUserId(+e.target.value);
              }}
            >
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                }}
              >
                <button
                  style={{
                    background: 'lime',
                  }}
                  onClick={() => buyMockCoinsWithFiat(10)}
                >
                  Spend $10 on MOCK Coins
                </button>
                <button
                  style={{
                    background: 'lime',
                  }}
                  onClick={() => buyMockCoinsWithFiat(100)}
                >
                  Spend $100 on MOCK Coins
                </button>
                <button
                  style={{
                    background: 'lime',
                  }}
                  onClick={() => buyMockCoinsWithAllFiat()}
                >
                  Spend ALL on MOCK Coins
                </button>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                }}
              >
                <button
                  style={{
                    background: 'salmon',
                  }}
                  onClick={() => sellMockCoins(10)}
                >
                  Sell 10 MOCK Coins
                </button>
                <button
                  style={{
                    background: 'salmon',
                  }}
                  onClick={() => sellMockCoins(100)}
                >
                  Sell 100 MOCK Coins
                </button>
                <button
                  style={{
                    background: 'salmon',
                  }}
                  onClick={() => sellAllMockCoins()}
                >
                  Sell ALL MOCK Coins
                </button>
              </div>
            </div>
          </div>
        </div>
        <br />
        <hr />
        <br />
        <button onClick={handleAddUser}>Add User</button>
        <div className='user-boxes-ctn'>
          {users.map((user) => {
            return (
              <div key={user.id} className='user-box'>
                <h5>{user.name}</h5>
                <p>User Money: {'$' + user.money.toFixed(8)}</p>
                <p>User Coins: {user.coins.toFixed(8)}</p>
                <p>
                  User Net Worth: $
                  {(user.money + user.coins * coinValue).toFixed(8)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
