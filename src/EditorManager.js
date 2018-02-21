var document = window.document,
	$ = require( "./libs/jquery-custom.js" ),
	env = require( "bowser" ),
	Editor = require( "./Editor.js" ),
	Filters = require( "./Filters.js" ),

	_prepared = false,
	_pluginList = [
		"load",
		"save",
		"undo",
		"redo",
		"filter",
		"rotation",
		"flip",
		"brightness",
		"contrast",
		"saturation"
	],
	_userFilterList = [
		"grayscale",
		"vintage"
	],
	_loadedConfigs = {},
	_loadedPlugins = {},
	_loadedUserFilters = {},

	EditorManager = {
		$: $,
		env: env,
		editors: {},
		version: "@@EDITOR_VERSION@@",
		edition: "@@EDITOR_EDITION@@",
		filters: Filters,

		create: function( id, configs, type, callback ) {
			var self = this,
				editor;

			function prepare() {
				var src, i, result, fileName,
					scripts = document.getElementsByTagName( "script" );

				for ( i = 0; i < scripts.length; i++ ) {
					src = scripts[ i ].getAttribute( "src", 2 );

					if ( /latteart(?:[\.\_\-][a-z0-9]+)*\.js/ig.test( src ) ) {
						result = /(?:\w+\.*)*latteart\/(?:\w+\.*)+\/(latteart(?:\w+\.*)*\.js)/.exec( src );

						if ( result ) {
							fileName = result[ 1 ];
							self.baseURL = src.substring( 0, src.lastIndexOf( fileName ) );
							break;
						}
					}
				}

				_prepared = true;
			}

			function loadPlugins() {
				var i, listLength, pluginName;

				listLength = _pluginList.length;

				for ( i = 0; i < listLength; i++ ) {
					pluginName = _pluginList[ i ];

					if ( !_loadedPlugins[ pluginName ] ) {
						_loadedPlugins[ pluginName ] =
							require(
								"./plugins/" +
								pluginName.charAt( 0 ).toUpperCase() +
								pluginName.slice( 1 ).toLowerCase() +
								"Plugin" + ".js"
							);
					}
				}
			}

			function loadUserFilters() {
				var i, listLength, filterName;

				listLength = _userFilterList.length;

				for ( i = 0; i < listLength; i++ ) {
					filterName = _userFilterList[ i ];

					if ( !_loadedUserFilters[ filterName ] ) {
						_loadedUserFilters[ filterName ] = require( "./filters/" + filterName + ".js"  );
					}
				}
			}

			function loadConfigs( url, type ) {
				var configs = {};

				if ( url ) {
					if ( _loadedConfigs[ url ] ) {
						configs = _loadedConfigs[ url ];
					} else {
						$.ajax( {
							url: url,
							type: type,
							async: false,
							dataType: "json",
							timeout: 2000
						} ).done( function( data ) {
							configs = data;
							_loadedConfigs[ url ] = configs;
						} ).fail( function( jqxhr, textStatus ) {
							configs.errorMessage = textStatus;
							configs.errorCode = jqxhr.status;
							configs.load_fail = true;
						} );
					}
				} else {
					configs.load_fail = true;
				}

				return configs;
			}

			if ( !_prepared ) {
				prepare();
			}

			if ( typeof type === "function" ) {
				callback = type;
				type = "GET";
			} else if ( typeof type === "string" ) {
				type = type.toUpperCase();
			}

			if ( type !== "GET" && type !== "POST" ) {
				type = "GET";
			}

			configs = ( typeof configs === "object" ) ?
				$.extend( {}, configs ) :
					loadConfigs( configs, type );

			loadPlugins();
			loadUserFilters();

			require( "./skins/default.less" );

			$( function() {
				editor = new Editor( id, self );
				self.editors[ editor.id ] = editor;
				self.activeEditor = editor;
				editor.create( {
					configs: configs,
					plugins: _loadedPlugins,
					userFilters: _loadedUserFilters
				} );

				if ( typeof callback === "function" ) {
					editor.on( "editorcreate", function() {
						callback( editor );
					} );
				}
			} );
		},

		get: function( id ) {
			return id in this.editors ? this.editors[ id ] : null;
		},

		/**
		 * 생성된 에디터 삭제를 위해 호출하는 메소드
		 * 해당 메소드가 호출되면 에디터 관련 DOM, event handler들이 삭제되고 메모리가 반환됨.
		 *
		 * @method destroy
		 * @param  {String|Object} editor  에디터의 ID 혹은 에디터 객체
		 */
		destroy: function( editor ) {
			var id, activeId,
				self = this,
				editors = this.editors;

			if ( typeof editor === "string" ) {
				id = editor;
				editor = editors[ id ];

				if ( !editor ) {
					return false;
				}
			}

			if ( !editor || !editor.id || !editors[ editor.id ] ) {
				return false;
			}

			if ( delete editors[ editor.id ] ) {
				if ( this.activeEditor === editor ) {
					if ( !Object.keys( editors ).length ) {
						this.activeEditor = null;
						$.clearCaches();
					} else {
						for ( activeId in editors ) {
							self.activeEditor = editors[ activeId ];
							break;
						}
					}
				}

				$( editor ).trigger( "editordestroy" );
			}

			editor.destroy();
			editor = null;

			return true;
		}
	};

window.latte = EditorManager;
