var assert = require("assert"),
	//chai = require("chai"),
	//chaiAsPromised = require("chai-as-promised"),
  moment = require('moment'),
  should = require('should'),
  rek = require('rekuire');

var investing = rek("parse-investing");

//chai.use(chaiAsPromised);

describe('Parse Investing', function(){
	describe('#parseInvesting', function(){
    this.timeout(15000);

		var tests = [
			{args: ['en', '2015-03-26', '2015-03-26']}
		];

    tests.forEach(function(test){
      it('responds for filter: '+test.args+' with correct events', function(done){
        investing.parseInvesting(test.args[0], test.args[1], test.args[2], function(err,res){
          if (err){
            done(err);
          }

          res.forEach(function(it){
            moment(it['time']).should.be.within(moment(test.args[1]), moment(test.args[2]).add(1, 'days'));
          })
          done();
        })
        
      })
    })
		
	})
})