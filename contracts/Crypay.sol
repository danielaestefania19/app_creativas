// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract owned {
    address owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }
}

contract Crypay is owned {
    address payable billingAddress;
      uint public paymentCount = 0; // Contador para el ID único

    struct Payment {
        uint price;
        uint8 status;
        address buyer;
    }

    mapping (uint => Payment) payments;

    event PaymentPaid(uint externalPaymentId);

    constructor(address payable _billingAddress) {
        billingAddress = _billingAddress;
    }

    function getBillingAddress() public view returns (address) {
        return billingAddress;
    }

    function getStatus(uint externalPaymentId) public view returns (string memory) {
        Payment storage payment = payments[externalPaymentId];
        if(payment.status == 0) {
            return 'NotExists';
        }
        if(payment.status == 1) {
            return 'New';
        }
        if(payment.status == 2) {
            return 'Paid';
        }
        if(payment.status == 3) {
            return 'Completed';
        }
        if(payment.status == 4) {
            return 'Refunded';
        }
        revert("Invalid payment status");
    }

    function checkIfPaymentExists(uint externalPaymentId) public view returns(bool) {
        Payment storage payment = payments[externalPaymentId];
        return payment.status > 0;
    }

    function getPrice(uint externalPaymentId) public view returns(uint) {
        Payment storage payment = payments[externalPaymentId];
        require(payment.status > 0, "Payment does not exist");
        return payment.price;
    }

    function startNewPayment(uint externalPaymentId, uint price) public onlyOwner {
        require(!checkIfPaymentExists(externalPaymentId) && price > 0, "Payment already exists or price is zero");
        payments[externalPaymentId] = Payment(price, 1, address(0));
          paymentCount++;
    }

    function pay(uint externalPaymentId) public payable {
        Payment storage payment = payments[externalPaymentId];
        require(payment.status == 1 && msg.value == payment.price, "Payment not initialized or incorrect value sent");
        payment.status = 2;
        payment.buyer = msg.sender;
    }

    function complete(uint externalPaymentId) public onlyOwner {
        Payment storage payment = payments[externalPaymentId];
        require(payment.price > 0 && payment.status == 2, "Payment not initialized or not paid");
        billingAddress.transfer(payment.price);
        payment.status = 3;
    }

    function refund(uint externalPaymentId) public onlyOwner {
        Payment storage payment = payments[externalPaymentId];
        require(payment.price > 0 && payment.status == 2, "Payment not initialized or not paid");
        payable(payment.buyer).transfer(payment.price);
        payment.status = 4;
    }

    receive() external payable {}
}