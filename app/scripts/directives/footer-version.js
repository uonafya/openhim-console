import { isCoreVersionCompatible } from "../util";
import * as footerTemplate from "./footer-version.html";

function footerVersion(Api, config) {
	return {
		template: footerTemplate,
		scope: false,
		link: function (scope) {

			var success = function (result) {
				scope.footerCoreVersion = result.currentCoreVersion;
				scope.footerConsoleVersion = config.version;
				scope.footerVersionsCompatible = isCoreVersionCompatible(config.minimumCoreVersion, scope.footerCoreVersion);
			};

			scope.$root.$watch('sessionUser', function (newVal) {
				if (newVal) {
					Api.About.get(success);
				} else {
					scope.footerCoreVersion = null;
					scope.footerConsoleVersion = null;
				}
			});
		}
	};
}