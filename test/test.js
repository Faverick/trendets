var assert = require("assert"),
	//chai = require("chai"),
	//chaiAsPromised = require("chai-as-promised"),
  moment = require('moment'),
  should = require('should'),
  q = require('q'),
  rek = require('rekuire');

var investing = rek("parse-investing"),
  logger = rek('winstonlog');

//chai.use(chaiAsPromised);

describe('Parse Investing', function(){
  describe('#parseWithSplitting', function(){
    this.timeout(40000);

    var tests = [
      {args: ['ru', '2014-01-01', '2015-01-01']}
    ];

    tests.forEach(function(test){
      it('responds for filter: '+test.args+' with correct events', function(done){
        investing.parseWithSplitting(test.args[0], test.args[1], test.args[2])
          .then(function(res){
            res.forEach(function(it){
              moment(it['time']).should.be.within(moment(test.args[1]), moment(test.args[2]).add(1, 'days'));
            })
            done();
        }, function(res, err){
          logger.error(err);
          done(err);
        })
        
      })
    })
    
  })

	describe('#parseInvesting', function(){
    this.timeout(10000);

		var tests = [
			{args: ['en', '2015-03-26', '2015-03-26']},
      {args: ['en', '2015-03-23', '2015-03-26']},
      {args: ['en', '2015-03-26', '2015-04-26']}
		];

    tests.forEach(function(test){
      it('responds for filter: '+test.args+' with correct events', function(done){
        investing.parseInvesting(test.args[0], test.args[1], test.args[2])
          .then(function(res){
            res.forEach(function(it){
              moment(it['time']).should.be.within(moment(test.args[1]), moment(test.args[2]).add(1, 'days'));
            })
            done();
        }, function(res, err){
          logger.error(err);
          done(err);
        })
        
      })
    })
		
	})
})