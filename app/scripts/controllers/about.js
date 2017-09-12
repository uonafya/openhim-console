import { isCoreVersionCompatible, getTimeForTimezone } from "../utils";

export function AboutCtrl($scope, $interval, Api, Alerting, config) {

	$scope.aboutInfo = {};

	let success = function (result) {
		$scope.aboutInfo = result;
		buildAboutInfoObject();

		$scope.updateTime(result.serverTimezone);
		$scope.clock = $interval(function () {
			$scope.updateTime(result.serverTimezone);
		}, 1000);
	};

	let error = function (err) {
		Alerting.AlertAddServerMsg(err.status);
	};

	Api.About.get(success, error);

	$scope.updateTime = function (timezone) {
		$scope.aboutInfo.serverTime = getTimeForTimezone(timezone);
	};

	let buildAboutInfoObject = function () {
		$scope.aboutInfo.currentConsoleVersion = config.version;
		$scope.aboutInfo.minimumCoreVersion = config.minimumCoreVersion;

		let maxCoreMajorVersion = parseInt(config.minimumCoreVersion.split('.')[0]) + 1;
		$scope.aboutInfo.maximumCoreVersion = maxCoreMajorVersion + '.0.0';

		$scope.aboutInfo.compatible = isCoreVersionCompatible($scope.aboutInfo.minimumCoreVersion, $scope.aboutInfo.currentCoreVersion);
	};

	$scope.$on('$destroy', function () {
		if (angular.isDefined($scope.clock)) {
			$interval.cancel($scope.clock);
		}
	});
}