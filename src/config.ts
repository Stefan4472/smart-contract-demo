export const config = {
	address: "0xE1ca35B2FF87f6321b546474A20c0fB1D02062B2",
	abi: [
		{
			"inputs": [
				{
					"internalType": "string",
					"name": "newMessage",
					"type": "string"
				}
			],
			"name": "changeMessage",
			"outputs": [],
			"stateMutability": "payable",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "message",
			"outputs": [
				{
					"internalType": "string",
					"name": "",
					"type": "string"
				}
			],
			"stateMutability": "view",
			"type": "function"
		}
	]
};
