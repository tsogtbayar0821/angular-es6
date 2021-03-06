'use strict';

export function routerDecorator($rootScope, $state, Auth) {
	'ngInject';
	// Redirect to login if route requires auth and the user is not logged in, or doesn't have required role

	$rootScope.$on('$destroy', $rootScope.$on('$stateChangeStart', (event, next) => {
		if (!next.authenticate) {
			return;
		}

		if (angular.isString(next.authenticate)) {
			Auth.hasRole(next.authenticate)
				.then(has => {
					if (has) {
						return;
					}

					event.preventDefault();
					return Auth.isLoggedIn()
						.then(is => {
							$state.go(is ? 'main' : 'landing');
						});
				});
		} else {
			Auth.isLoggedIn()
				.then(is => {
					if (is) {
						return;
					}

					event.preventDefault();

					$state.go('landing');
				});
		}
	}));
}
