import { useState, useEffect } from 'react';
import "./App.css";

function App() {

  const [ banks, setBanks ] = useState([]);
  const [ totalBalance, setTotalBalance ] = useState(0);
  const [ goals, setGoals ] = useState([]);
  useEffect(() => {
    getBankBalances();
    getGoals();
  }, [])

  useEffect(() => {
    getTotalBalance();
  }, [banks])

  const getBankBalances = () => {
    fetch("http://localhost:8080/bankAccounts")
      .then((response) => response.json())
      .then(setBanks)
  };

  const getTotalBalance = () => {
    let total = 0;
    banks.forEach( (item) => {
      total += item.balance
    })
    setTotalBalance(total);
  }

  const getGoals = () => {
    fetch("http://localhost:8080/financialGoals")
      .then((response) => response.json())
      .then((data) => {
        setGoals(data);
      })
  }

  return (
    <div className="app-outer">
      <h1>Net Worth</h1>
      <div>{totalBalance}</div>
      <h2>Your Goals</h2>
      <div>
        {goals.length > 0 &&
          goals.map((goal) => {
            let progressBar = Math.floor((goal.goalProgress/goal.goalTarget) * 10);
            let progArr =  [];
            for(var i = 0; i < 10; i++)  {
              if(progressBar > 0) {
                progressBar--;
                progArr.push('*');
              } else {
                progArr.push('-');
              }
            }
            return (
              <div>
                <div>{goal.name}</div>
                <div>{goal.goalProgress}</div>
                <div>{goal.goalTarget}</div>
                <div>
                  Target Bank:{" "}
                  {banks.map((item) => {
                    if (item.id == goal.accountId) {
                      return <div>{item.name}</div>;
                    }
                  })}
                </div>
                <div>
                  {progArr.map((item) => {return <span>{item}</span>})}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  ); 
}

export default App;