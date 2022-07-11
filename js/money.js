/* Global variables -  */
let pay;
let saved;
let debt;

let pendingLoan = false;

/* Final variables */
const SALARY = 100;
const CURRENCY = "Kr";

/**
 * Init conditions
 */
window.onload = () => {
  pay = 0;
  saved = 0;
  debt = 0;

  document.getElementById("bank_balance").innerHTML = `${saved} ${CURRENCY}`;
  document.getElementById("work_balance").innerHTML = `${pay} ${CURRENCY}`;
};

/**
 * worker has a shift which increases pay with a days salary
 *
 * --> Salary = 100 Kr
 */
function work() {
  pay += SALARY;

  document.getElementById("work_balance").innerHTML = `${pay} ${CURRENCY}`;
}

/**
 * places salary into your savings
 *
 * If worker has a loan -> 10% of salary goes to existing debt
 */
function bank() {
  if (pay == 0) {
    message(
      "Bank",
      `You have requested to bank: <strong>${pay} ${CURRENCY}</strong> 
       <br> You must submit an amount above that`,
      "danger"
    );

    // If debt exist
  } else if (debt > 0) {
    // if debt amount is lower than 10% of banked
    if (debt <= pay * 0.1) {
      // take difference
      let diff = pay * 0.1 - debt;
      saved += diff + pay * 0.9;
      debt = 0;

      const debtDOM = document.getElementById("debt");
      const debtDOMChild = document.getElementById("debt_child");

      debtDOM.removeChild(debtDOMChild);

      // TODO: remove debt-tag

      const buttonsDOM = document.getElementById("buttons");
      const buttonsDomChild = document.getElementById("repay_loan");

      buttonsDOM.removeChild(buttonsDomChild);

      pendingLoan = false;
    } else {
      saved += pay * 0.9;
      debt -= pay * 0.1;
    }

    // resetting work balance
    pay = 0;

    document.getElementById("bank_balance").innerHTML = `${saved} ${CURRENCY}`;
    document.getElementById("work_balance").innerHTML = `${pay} ${CURRENCY}`;
    if (pendingLoan) {
      document.getElementById("debt_balance").innerHTML = `${debt} ${CURRENCY}`;
    }
  } else {
    // transfering work balance earned to bank balance
    saved += pay;
    // resetting work balance
    pay = 0;

    document.getElementById("bank_balance").innerHTML = `${saved} ${CURRENCY}`;
    document.getElementById("work_balance").innerHTML = `${pay} ${CURRENCY}`;
  }
}

/**
 * Function gives worker a loan given that
 *  Worker has:
 *  -- No current loan¨
 *  -- Money in account
 *  -- requested an amount lower than 2X current balance
 */
function loan() {
  let alert;

  let debtRequest = document.getElementById("requested_debt").value;
  let totalDeptAllowed = saved * 2;

  // if debt exists
  if (debt > 0) {
    alert = `
    Hello Joe!
    <br>
    <div class="alert alert-danger" role="alert">
    You may only have ongoing debt at a time <br>
    Current debt: ${debt} ${CURRENCY}
    </div>`;

    // if not a number
  } else if (isNaN(debtRequest)) {
    alert = `
        Hello Joe!<br>How much would you like to borrow?
        <br>
        <div class="alert alert-danger" role="alert">
        Requested amount must be a number!
        </div>`;

    // if requested amount exceeds total debt allowed
  } else if (debtRequest > totalDeptAllowed) {
    alert = `
        Hello Joe!<br>How much would you like to borrow?
        <br>
        <div class="alert alert-danger" role="alert">
        Requested amount be must under ${totalDeptAllowed} ${CURRENCY}
        </div>`;

    // if debt already exists
  } else if (debtRequest <= 0 || debtRequest == null) {
    alert = `
        Hello Joe!
        <br>
        <div class="alert alert-danger" role="alert">
          Requested amount must be above 0 Kr
        </div>`;

    // debt granted
  } else if (debt > 0) {
    alert = `
        Hello Joe!
        <br>
        <div class="alert alert-danger" role="alert">
        You may only have 1 ongoing debt at a time <br>
        Current debt: ${debt} ${CURRENCY}
        </div>`;

    // debt granted
  } else {
    alert = `
      Hello Joe!
      <br>
      <div class="alert alert-success" role="alert">
      Requested amount granted! 
      <br>
      Debt: ${debtRequest} ${CURRENCY}
      </div>`;

    let debtDOM = `
            <div id="debt_child" class="amount align-text-center">
              <p class="card-text" style="margin-right: 125px">Debt</p>
              <p class="card-text" id="debt_balance"></p>
            </div>  
            `;

    if (!pendingLoan) {
      let repayLoanButton = `<a id="repay_loan" onclick="repayLoan()" style="color: white;" class="btn btn-success">Repay loan</a>`;

      document.getElementById("buttons").innerHTML += repayLoanButton;
    }

    document.getElementById("debt").innerHTML = debtDOM;
    // setting global debt
    debt = parseInt(debtRequest);

    // adding debt to bank_balance
    saved += debt;

    document.getElementById("bank_balance").innerHTML = `${saved} ${CURRENCY}`;

    document.getElementById("debt_balance").innerHTML = `${debt} ${CURRENCY}`;

    pendingLoan = true;
  }

  document.getElementById("modal-message").innerHTML = alert;
}

/**
 * purchases a laptop given that a worker can afford it
 * @param {*} price
 */
function buy(price, title) {
  if (price > saved) {
    message(
      "Not Enough Funds",
      `You have requested to purchase a <strong>${title}</strong>
      <br>Needed: <strong>${price - saved} ${CURRENCY}</strong>`,
      "danger"
    );
  } else {
    saved -= price;

    document.getElementById("bank_balance").innerHTML = `${saved} ${CURRENCY}`;

    message(
      `Thanks for purchasing a <strong>${title}</strong>`,
      `You have purchased a <strong>${title}</strong> for: <strong>${price} ${CURRENCY}</strong>`,
      "success"
    );
  }
}

/**
 * Helper function that handles danger/success messages
 *
 * @param {*} text - DOM structure with message
 * @param {*} type - success || danger
 */
function message(title, message, type) {
  let DOM = `
  <div class="center shadow-lg p-3 mb-5 rounded alert alert-${type}" role="alert">        
          <h5 class="card-text">${title}</h5>
          <p>${message}</p>
  </div>  
  `;

  if (type == "warning") {
    document.getElementById("messages").innerHTML = DOM;
  } else {
    document.getElementById("messages").innerHTML = DOM;
  }
}

/**
 * Repays loan from current salary
 */
function repayLoan() {
  if (pay === 0) {
    message("Repay Loan", "You need to work!", "danger");
  } else if (pay >= debt) {
    saved += pay - debt;
    debt = 0;
    pay = 0;
    pendingLoan = false;

    document.getElementById("debt_balance").innerHTML = `${debt} ${CURRENCY}`;
    document.getElementById("bank_balance").innerHTML = `${saved} ${CURRENCY}`;
    document.getElementById("work_balance").innerHTML = `${pay} ${CURRENCY}`;

    const buttonsDOM = document.getElementById("buttons");
    const buttonsDomChild = document.getElementById("repay_loan");

    buttonsDOM.removeChild(buttonsDomChild);

    const debtDOM = document.getElementById("debt");
    const debtDOMChild = document.getElementById("debt_child");

    debtDOM.removeChild(debtDOMChild);
  } else {
    debt -= pay;
    pay = 0;

    document.getElementById("debt_balance").innerHTML = `${debt} ${CURRENCY}`;
    document.getElementById("work_balance").innerHTML = `${pay} ${CURRENCY}`;
  }
}

function getValues() {
  console.log(
    `
    Pay: ${pay}
    Debt: ${debt}
    Saved: ${saved}`
  );
}
