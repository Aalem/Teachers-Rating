App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  hasVoted: false,

  // Initialize web3
  init: function() {
    return App.initWeb3();
  },

  // Stop the contract
  stopContract2: function(){
    App.contracts.Rating.deployed().then(function(instance) {
       instance.stopContract();
    });
  },

  // Start the contract
  startContract2: function(){
    App.contracts.Rating.deployed().then(function(instance) {
       instance.resumeContract();
    });
  },

  initWeb3: function() {
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Rating.json", function(rating) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Rating = TruffleContract(rating);
      // Connect provider to interact with contract
      App.contracts.Rating.setProvider(App.web3Provider);

      App.listenForEvents();

      return App.render();
    });
  },

  // Listen for events emitted from the contract
  listenForEvents: function() {
    App.contracts.Rating.deployed().then(function(instance) {
      instance.ratedEvent({}, {
        fromBlock: 'latest'
      }).watch(function(error, event) {
        console.log("event triggered", event)
        // Reload when a new rating is recorded
        // App.render();
      });

    });
  },

  render: function() {
    var ratingInstance;
    var loader = $("#teacherTemplate");
    var content = $("#content");

    loader.show();
    content.hide();

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    // Load contract data
    App.contracts.Rating.deployed().then(function(instance) {

      ratingInstance = instance;

      return ratingInstance.teachersCount();
    }).then(function(teachersCount) {
      var teachersResults = $("#teacherTemplate");
      var teacherRatingSelect = $('#teacherRatingSelect');
      var teacherSelect = $('#teacherSelect');
      var teacherRow = $('#teacherRow');
      var teacherTemplate = $('#teacherTemplate');

      teacherRatingSelect.empty();
      teacherSelect.empty();

      var count =0;

      // Generate 5 stars options
      for(var j=1;j<=5;j++){
        var teacherRatingOption = "<option value='" + j + "' >" + j + "</ option>"
        teacherRatingSelect.append(teacherRatingOption);
      }

      // Retrieving teachers from the contract and displaying them in the browser
      for (var i = 1; i <= teachersCount; i++) {
        ratingInstance.teachers(i).then(function(teacher) {

          var id = teacher[0].toNumber();
          var name = teacher[1];
          var image = teacher[2];
          var age = teacher[3].toNumber();
          var department = teacher[4];
          var rank = teacher[5];
          var rating = teacher[6].toNumber()/teacher[7].toNumber();

          teacherTemplate.find('.panel-title').text(name);
          teacherTemplate.find('img').attr('src', image);
          teacherTemplate.find('.department').text(department);
          teacherTemplate.find('.age').text(age);
          teacherTemplate.find('.rank').text(rank);
          teacherTemplate.find('.rating').text(
            isNaN(rating)?"No Rating":rating.toFixed(2)
          );

          teacherRow.append(teacherTemplate.html());

          // Display list of un-rated teachers in the options list
          ratingInstance.raters(App.account).then(function(rater){
            if(!rater[count]){
              var teacherOption =  "<option value='" + id + "' >" + name + "</ option>"
              teacherSelect.append(teacherOption);
            }
            count++;
          });

        });

      }
      return ratingInstance.raters(App.account);
    }).then(function(rater) {
      // Hide the rating form if the user has rated all the teachers
      if(rater[0]==true &&  rater[1]==true && rater[2]==true && rater[3]==true){
        $('#formContainer').hide();
        console.log('All teachers have been rated by the user!');
      }
      loader.hide();
      content.show();
    }).catch(function(error) {
      console.warn(error);
    });
  },

  // casting rate
  castRate: function() {
    console.log("castRate triggered");
    var teacherId = $('#teacherSelect').val();
    var teacherRating = $('#teacherRatingSelect').val();
    App.contracts.Rating.deployed().then(function(instance) {
      return instance.rate(teacherId,teacherRating, { from: App.account });
    }).then(function(result) {
      // Wait for votes to update
      location.reload(true);
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  }
};

// Init the app on page load
$(function() {
  $(window).load(function() {
    App.init();
  });
});
