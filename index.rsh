'reach 0.1';

export const main = Reach.App(() => {
  const Alice = Participant('Alice', {
    // Specify Alice's interact interface here
    getAcceptanceOfFortune: Fun([Bytes(32)], Bool)
  });
  const Bob = Participant('Bob', {
    // Specify Bob's interact interface here
    ready: Bytes(11),
    fortune: Bytes(32)
  });

  init();
  const payment = 100;
  Alice.pay(payment);
  commit();
  Bob.only(() => {
    const ready = declassify(interact.ready);
  });
  Bob.publish(ready);
  var accepted = false;
  invariant( balance() == payment );
  while(!accepted) {
    commit();

    Bob.only(() => {
      const fortune = declassify(interact.fortune);
    });
    Bob.publish(fortune);
    commit();
    Alice.only(() => {
      const accaptance = declassify(interact.getAcceptanceOfFortune(fortune));
    })
    Alice.publish(accaptance);
    commit();

    accepted = accaptance;
    continue;
  }
  
  assert(accepted);

  transfer(payment).to(Bob);
  commit();
  // write your program here
  exit();
});
