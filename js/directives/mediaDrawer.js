/**
 * mediaDrawer="" directive
 *
 * Controls drawer for searching and filtering media for zoomers.
 */
angular.module( 'griot' ).directive( 'mediaDrawer', function( $http, $rootScope ) {

	return {

		restrict: 'A',
		replace: true,
		template: "<div class='griot-media-drawer' ng-class=\"{'visible':$root.mediaVisible}\">" +
			"<a class='griot-media-toggle' ng-click='toggle()'></a>" +
			"<div class='griot-media-controls'>" +
				"<h2 class='griot-media-header'>Available Media</h2>" +
				"<p class='griot-media-instructions'>Drag to the left panel to insert.</p>" +
				"<input class='griot-media-search' type='text' ng-model='mediaSearch.meta' id='griot-media-search' placeholder='Search media' />" +
				"<input class='griot-media-filter-by-object' type='checkbox' ng-model='filterByObject' id='griot-media-filter-by-object' />" +
				"<label class='griot-media-label' for='griot-media-filter-by-object'>Current object media only</label>" +
			"</div>" +
			"<div class='griot-media-window'>" +
				"<div class='griot-media-thumb' ng-repeat='image in media | filterMediaByObject:filterByObject:data.id | filter:mediaSearch | limitTo:20' >" +
					"<img class='griot-media-image' ng-src='{{image.thumb}}' data-object-id='{{image.object_id}}' data-image-id='{{image.id}}' data-object-title='{{image.object_title}}' media-drag />" +
				"</div>" +
			"</div>" +
		"</div>",
		controller: function( $scope, $element, $attrs ){

			var devZoomables;

			$rootScope.mediaVisible = false;
			$scope.media = [];
			$scope.toggle = function(){
				$rootScope.mediaVisible = ! $rootScope.mediaVisible;
			}

			/**
			 * Get the dev zoomables (soon to be the config) and arrange into a structure
			 * that we can use in the media drawer.
			 */
			$http.get( 'http://author.loc/wp-content/plugins/GriotWP/tdx_rev.json' )
				.success( function(data){
					devZoomables = data;
				})
				.then( function(){
					for( var objid in devZoomables ){
						var images = devZoomables[ objid ].images;
						var meta = devZoomables[ objid ].meta;
						for( var i = 0; i < images.length; i++ ){
							var image = images[i];
							image.object_id = objid;
							image.id = image.file.split('.tif')[0];
							image.thumb = 'http://tiles.dx.artsmia.org/v2/' + image.file.split('.tif')[0] + '/0/0/0.png';
							image.meta = [ meta.artist, meta.continent, meta.country, meta.creditline, meta.culture, meta.description, meta.medium, meta.title ].join(' ');
							image.object_title = meta.title;
							$scope.media.push( image );
						}
					}
				});
		},
		link: function( scope, elem, attrs ) {
		}
	};

});