import React, {useEffect, useState} from 'react';
import './App.css';
import {ethers} from "ethers";
import {config} from "./config";

declare const window: any;

function App() {
	const [currentAccount, setCurrentAccount] = useState(null);
	const [message, setMessage] = useState("");

	const checkWalletIsConnected = async () => {
		const {ethereum} = window;

		if (!ethereum) {return;}
		const accounts = await ethereum.request({method: 'eth_accounts'});

		if (accounts.length !== 0) {
			const account = accounts[0];
			console.log("Found an authorized account: ", account);
			setCurrentAccount(account);
		}
		else {
			console.log("No authorized account found");
		}
	};

	const connectWalletHandler = async () => {
		const {ethereum} = window;

		if (!ethereum) {
			alert("Please install Metamask!");
		}

		try {
			const accounts = await ethereum.request({method: 'eth_requestAccounts'});
			console.log("Found an account! Address: ", accounts[0]);
			setCurrentAccount(accounts[0]);
		} catch (err) {
			console.log(err);
		}
	};

	async function getMessageContract() {
		try {
			const {ethereum} = window;

			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				return new ethers.Contract(config.address, config.abi, signer);
			}
			else {
				console.log("Ethereum object does not exist");
			}

		} catch (err) {
			console.log(err);
		}
	}

	const changeMessage = async (newMessage: string, payment: string) => {
		const messageContract = await getMessageContract();
		// @ts-ignore
		const txn = await messageContract.changeMessage(newMessage, {value: ethers.utils.parseEther(payment)});
		await txn.wait();
		await getCurrentMessage();
	};

	const getCurrentMessage = async () => {
		const messageContract = await getMessageContract();
		// @ts-ignore
		const message = await messageContract.message();
		setMessage(message);
	};

	const connectWalletButton = () => {
		return (
			<button onClick={connectWalletHandler} className="">
				Connect Wallet
			</button>
		);
	};

	const changeMessageButton = () => {
		let newMessage = "";
		let payment = "";
		return <div>
			<input type="text" onInput={(event => newMessage = event.currentTarget.value.valueOf())}/>
			<input type="text" onInput={(event => payment = event.currentTarget.value.valueOf())}/>
			<button onClick={() => changeMessage(newMessage, payment)}>
				Change Message
			</button>
		</div>;
	};

	useEffect(() => {
		checkWalletIsConnected();
		getCurrentMessage();
	}, []);

	return (
		<div className="App">
			{!currentAccount ? connectWalletButton() :
			 <div>
				 <p>connected with: {currentAccount}</p>
				 <h4>{message}</h4>
				 {changeMessageButton()}
			 </div>
			}
		</div>
	);
}

export default App;
