/**
 * Created by dell on 7/31/2016.
 */
angular.module('ticketSystem')
    .controller('ProfileCtrl',function($scope, Authentication, UserFactory, Flash){
        $scope.user = {};
        $scope.init = function(){

            UserFactory.getUserByUsername(Authentication.getUser().username)
                .then(function(res){
                    if(res.data.errors) {
                        var errorMessage = '';
                        for(var i=0;i<res.data.errors.length;i++){
                            errorMessage += res.data.errors[i].msg + '<br/>'
                        }
                        window.location = '#/';
                        Flash.create('danger', errorMessage, 5000, {}, false);
                    }
                    else
                        $scope.user.firstname = res.data.user.firstname;
                        $scope.user.lastname = res.data.user.lastname;
                        $scope.user.username = res.data.user.username;
                        $scope.user.email = res.data.user.email;
                });
        };

        $scope.update = function(){
            UserFactory.updateProfile($scope.user)
                .then(function(res){
                    $scope.user.firstname = res.data.user.firstname;
                    $scope.user.lastname = res.data.user.lastname;
                    $scope.user.username = res.data.user.username;
                    $scope.user.email = res.data.user.email;
                    Authentication.setUser($scope.user);
                    Flash.create('success', 'User details have been updated successfully', 5000, {}, false);
                })
                .catch(function(res){
                    Flash.create('danger', 'there was some error trying to update user details. Please try again after some time.', 5000, {}, false);
                })
        }
    })
    .controller('LoginCtrl',function($scope, UserFactory,Authentication, $window){
        $scope.error = false;
        $scope.message = '';
        $scope.login = function(){
            UserFactory.login($scope.username, $scope.password, $scope.remember)
                .then(function(res){
                    if(!res.data.isAuthenticated){
                        $scope.error = true;
                        $scope.message = res.data.msg;
                    }
                    else{
                        //Set user details in Common Factory
                        Authentication.setUser(res.data.user);
                        $scope.$emit('successful-login');
                        window.location = '#/';
                    }
                }).
                catch(function(error){
                    $scope.error = true;
                    $scope.message = 'An error occurred while trying to log you in. Please try again later';

                });
        };
        $scope.googleLogin = function(){
            var url = 'accounts/auth/google',
                width = 600,
                height = 450,
                top = (window.outerHeight - height) / 2,
                left = (window.outerWidth - width) / 2;
            $window.open(url, 'facebook_login', 'width=' + width + ',height=' + height + ',scrollbars=0,top=' + top + ',left=' + left);
        }
    })
    .controller('RegisterCtrl', function($scope,UserFactory,Flash){
        $scope.newUser = {};
        $scope.register = function(){
            UserFactory.registerUser($scope.newUser)
                .then(function(res){
                    if(res.data.errors) {
                        var errorMessage = '';
                        for(var i=0;i<res.data.errors.length;i++){
                            errorMessage += res.data.errors[i].msg + '<br/>'
                        }
                        Flash.create('danger', errorMessage, 5000, {}, false);
                    }
                    else{
                        Flash.create('success', 'User has been created successfully. You can now login.', 5000, {}, false);
                        window.location = '#/users/login';
                    }
                })
                .catch(function(res){
                    Flash.create('danger', 'There was some error trying to create the user. Please try again after some time.', 5000, {}, false);
                });
        };
    })
    .controller('SetUserCtrl', function($scope,$routeParams,UserFactory,Flash,Authentication){
        var id = $routeParams.id;
        var email = $routeParams.email;
        $scope.setUsername = {};
        $scope.setUsername.email = email;
        $scope.saveUsername = function(){
            UserFactory.setUsername({id: id,username :$scope.setUsername.username})
                .then(function(res){
                    if(res.data.errors){
                        var error_message;
                        for(var i=0; i> res.data.erros; i++){
                            error_message = res.data.erros[i].msg + '</br>';
                        }
                        Flash.create('danger', error_message, 5000, {}, false);
                    }
                    else{
                        Authentication.setUser(res.data.user);
                        $scope.$emit('successful-login');
                        window.location.hash = '#/'
                        Flash.create('success', 'Username has been set successfully.', 5000, {}, false);
                    }
                })
                .catch(function(err){
                    Flash.create('danger', 'There was some error trying to set the username. Please try again after some time.', 5000, {}, false);
                });
        }
    });
