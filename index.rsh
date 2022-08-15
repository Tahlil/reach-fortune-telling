'reach 0.1';

export const main = Reach.App(() => {
  const Alice = Participant('Alice', {
    // Specify Alice's interact interface here
    getAcceptanceOfFortune: Fun([Bytes(32)], Bool),
  });
  const Bob = Participant('Bob', {
    // Specify Bob's interact interface here
    readFortune: Fun([], Bytes(32))
  });

  init();
  const payment = 100;
  Alice.pay(payment);
  commit();
  Bob.publish();

  
  var accepted = false;
  invariant( balance() == payment );
  while(!accepted) {
    commit();

    Bob.only(() => {
      const fortune = declassify(interact.readFortune());
    });
    Bob.publish(fortune);
    commit();
    Alice.only(() => {
      const accaptance = declassify(interact.getAcceptanceOfFortune(fortune));
    })
    Alice.publish(accaptance);

    accepted = accaptance;
    continue;
  }
  
  assert(accepted);

  transfer(payment).to(Bob);
  commit();
  // write your program here
  exit();
});
