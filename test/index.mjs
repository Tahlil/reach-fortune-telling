import { loadStdlib, ask } from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';
const stdlib = loadStdlib();

const isAlice = await ask.ask(
    `Are you Alice?`,
    ask.yesno
  );
  const who = isAlice ? 'Alice' : 'Bob';

let acc = null;
const createAcc = await ask.ask(
  `Would you like to create an account on devnet`,
  ask.yesno
);
if (createAcc) {
  acc = await stdlib.newTestAccount(stdlib.parseCurrency(1000));
} else {
  const secret = await ask.ask(
    `What is your account secret?`,
    (x => x)
  );
  acc = await stdlib.newAccountFromSecret(secret);
}

let ctc = null;
if (isAlice) {
  ctc = acc.contract(backend);
  ctc.getInfo().then((info) => {
    console.log(`The contract is deployed as = ${JSON.stringify(info)}`); });
} else {
  const info = await ask.ask(
    `Please paste the contract information:`,
    JSON.parse
  );
  ctc = acc.contract(backend, info);
}

const fmt = (x) => stdlib.formatCurrency(x, 5);
const getBalance = async () => fmt(await stdlib.balanceOf(acc));

const before = await getBalance();
console.log(`Your balance is ${before}`);

const interact = { };

if (!isAlice) {
  interact.readFortune = async () => {
    const fortune = await ask.ask(`What is the fortune`, (x) => x);
    console.log(`Fortune is ${fortune}`);
    return fortune;
  };
  
} else {
  interact.getAcceptanceOfFortune = async (fortune) => {
    console.log(`The fortune is ${fortune}`);
    const accaptance = await ask.ask(
      `Do you except the fortune ${fortune} ?`,
      ask.yesno
    );
    return accaptance;
  }
}

const part = isAlice ? ctc.p.Alice : ctc.p.Bob;
await part(interact);

const after = await getBalance();
console.log(`Your balance is now ${after}`);

ask.done();
