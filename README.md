
# Teachers' Rating - DAPP
A decentralized application used to rate teachers. A list of teachers are displayed with their details. Every user can rate all the teachers, when all teachers have been rated, the user will not see the rating form but the teachers will remain listed.

## Dependencies
Install these prerequisites in order to run the project.
- NPM: https://nodejs.org
- Truffle: https://github.com/trufflesuite/truffle
- Ganache: http://truffleframework.com/ganache/
- Metamask: https://metamask.io/


## Step 1. Clone the project
`git clone https://github.com/dappuniversity/election`

## Step 2. Install dependencies
```
$ cd Teachers Rating
$ npm install
```
## Step 3. Start Ganache
Open the Ganache GUI client that you downloaded and installed. This will start your local blockchain instance.


## Step 4. Compile & Deploy Rating Smart Contract
`$ truffle migrate --reset`
You must migrate the election smart contract each time your restart ganache.

## Step 5. Configure Metamask
- Unlock Metamask
- Connect metamask to your local Etherum blockchain provided by Ganache.
- Import an account provided by ganache.

## Step 6. Run the Front End Application
`$ npm run dev`
Visit this URL in your browser: http://localhost:3000
