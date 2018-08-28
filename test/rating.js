var Rating = artifacts.require("./Rating.sol");

contract("Rating", function(accounts){
  var ratingInstance;
  it("initialize with four teachers", function(){
    return Rating.deployed().then(function(instance){
      return instance.teachersCount();
    }).then(function(count){
      assert.equal(count, 4);
    })
  });

  it("it initializes the teachers with the correct values", function(){
    return Rating.deployed().then(function (instance){
      ratingInstance = instance;
      return ratingInstance.teachers(1);
    }).then(function(teacher){
      assert.equal(teacher[0], 1, "contains the correct id");
      assert.equal(teacher[1], "Ahmad", "contains the correct name");
      assert.equal(teacher[2], "images/ahmad.jpg", "contains the correct image");
      assert.equal(teacher[3], 30, "contains the correct age");
      assert.equal(teacher[4], "Software Engineering", "contains the correct department");
      assert.equal(teacher[5], "Master", "contains the correct rank");
      assert.equal(teacher[6], 0, "contains the correct rating");
      assert.equal(teacher[7], 0, "contains the correct rating count");
      return ratingInstance.teachers(2);
    }).then(function (teacher){
      assert.equal(teacher[0], 2, "contains the correct id");
      assert.equal(teacher[1], "Sarah", "contains the correct name");
      assert.equal(teacher[2], "images/sarah.jpg", "contains the correct image");
      assert.equal(teacher[3], 40, "contains the correct age");
      assert.equal(teacher[4], "Software Engineering", "contains the correct department");
      assert.equal(teacher[5], "Phd", "contains the correct rank");
      assert.equal(teacher[6], 0, "contains the correct rating");
      assert.equal(teacher[7], 0, "contains the correct rating count");
      return ratingInstance.teachers(3);
    }).then(function(teacher){
      assert.equal(teacher[0], 3, "contains the correct id");
      assert.equal(teacher[1], "Kabir", "contains the correct name");
      assert.equal(teacher[2], "images/kabir.jpg", "contains the correct image");
      assert.equal(teacher[3], 35, "contains the correct age");
      assert.equal(teacher[4], "Network", "contains the correct department");
      assert.equal(teacher[5], "Master", "contains the correct rank");
      assert.equal(teacher[6], 0, "contains the correct rating");
      assert.equal(teacher[7], 0, "contains the correct rating count");
      return ratingInstance.teachers(4);
    }).then(function(teacher){
      assert.equal(teacher[0], 4, "contains the correct id");
      assert.equal(teacher[1], "John", "contains the correct name");
      assert.equal(teacher[2], "images/john.jpg", "contains the correct image");
      assert.equal(teacher[3], 50, "contains the correct age");
      assert.equal(teacher[4], "Database", "contains the correct department");
      assert.equal(teacher[5], "Phd", "contains the correct rank");
      assert.equal(teacher[6], 0, "contains the correct rating");
      assert.equal(teacher[7], 0, "contains the correct rating count");
    });
  });

  it("allows a rater to rate", function(){
    return Rating.deployed().then(function(instance){
      ratingInstance = instance;
      teacherId = 1;
      return ratingInstance.rate(teacherId, 4, {from: accounts[0]});
    }).then(function(receipt){
      assert.equal(receipt.logs.length,1,"an event was triggered");
      assert.equal(receipt.logs[0].event,"ratedEvent", "the event type is correct");
      assert.equal(receipt.logs[0].args._teacherId.toNumber(),teacherId,"the teacher id is correct");
      return ratingInstance.raters(accounts[0]);
    }).then(function(rated){
      assert(rated[0], "the teacher was marked as rated");
      return ratingInstance.teachers(teacherId);
    }).then(function(teacher){
      var rateCount = teacher[7];
      assert.equal(rateCount, 1, "increments the teachers's rating count");
    })
  });

  it("throws an exception for invalid teacher", function() {
    return Rating.deployed().then(function(instance) {
      ratingInstance = instance;
      return ratingInstance.rate(99,4, { from: accounts[1] })
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
      return ratingInstance.teachers(1);
    }).then(function(teacher1) {
      var rateCount = teacher1[7];
      assert.equal(rateCount, 1, "Ahmad did not receive any rating");
      return ratingInstance.teachers(2);
    }).then(function(teacher2) {
      var rateCount = teacher2[7];
      assert.equal(rateCount, 0, "Sarah did not receive any rating");
      return ratingInstance.teachers(3);
    }).then(function(teacher3) {
      var rateCount = teacher3[7];
      assert.equal(rateCount, 0, "Kabir did not receive any rating");
      return ratingInstance.teachers(4);
    }).then(function(teacher4) {
      var rateCount = teacher4[7];
      assert.equal(rateCount, 0, "John did not receive any rating");
    });
  });

  it("throws an exception for double rating", function() {
    return Rating.deployed().then(function(instance) {
      ratingInstance = instance;
      teacherId = 2;
      ratingInstance.rate(teacherId,4, { from: accounts[1] });
      return ratingInstance.teachers(teacherId);
    }).then(function(teacher) {
      var rateCount = teacher[7];
      assert.equal(rateCount, 1, "accepts first rate");
      // Try to rate again
      return ratingInstance.rate(teacherId, 4, { from: accounts[1] });
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
      return ratingInstance.teachers(1);
    }).then(function(teacher) {
      var rateCount = teacher[7];
      assert.equal(rateCount, 1, "Ahmad did not receive any rating");
      return ratingInstance.teachers(2);
    }).then(function(teacher) {
      var rateCount = teacher[7];
      assert.equal(rateCount, 1, "Sarah did not receive any rating");
      return ratingInstance.teachers(3);
    }).then(function(teacher) {
      var rateCount = teacher[7];
      assert.equal(rateCount, 0, "Kabir did not receive any rating");
      return ratingInstance.teachers(4);
    }).then(function(teacher) {
      var rateCount = teacher[7];
      assert.equal(rateCount, 0, "John did not receive any rating");
    });
  });
});
