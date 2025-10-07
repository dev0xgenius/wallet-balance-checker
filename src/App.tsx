function App() {
    return (
        <div className="dashboard">
            <div className="container">
                <h1>Wallet Balance Checker</h1>
                <span className="input__group">
                    <input type="text" placeholder="Enter wallet address..." />
                    <select className="group__item">
                        <option>ETH</option>
                        <option>SOL</option>
                        <option>BNB</option>
                    </select>
                </span>
                <span className="info__bar">
                    <span className="balance">$0.00</span>
                    <button>Check</button>
                </span>
            </div>
        </div>
    );
}

export default App;
