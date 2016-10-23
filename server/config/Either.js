var monad = {}; 

monad.Either = function(value){
  this.value = value
};

monad.Either.prototype.get = function(){
	return this.value;
}

monad.Success = function(value){
    monad.Either.call(this, value);
};

monad.Success.prototype = new monad.Either();
monad.Success.prototype.isSuccess = true;
monad.Success.prototype.isFailure = false;
monad.Success.prototype.bind = function(fn){
  return fn(this.value);
}


monad.Failure = function(value){
  monad.Either.call(this, value);
}
monad.Failure.prototype = new monad.Either();
monad.Failure.prototype.isSuccess = false;
monad.Failure.prototype.isFailure = true;
monad.Failure.prototype.bind = function(){
  return this;
}

module.exports = monad;