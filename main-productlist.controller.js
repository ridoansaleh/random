(function () {
'use strict';

angular.module('oprent.products.list')
.controller('MainProductListController', MainProductListController);

MainProductListController.$inject = ['$rootScope', '$scope', '$filter', '$log', '$window', '$q', '$stateParams', 'pageType', 'initBrand', 'initTheme', 'ProductService', 'CONFIG', '$state', 'ngDialog', 'localStorageService', 'initCategory', 'PropertiesService', 'sizesData', 'colorsData', 'brandsData', 'MetaService', 'initSize', 'Compare'];
function MainProductListController($rootScope, $scope, $filter, $log, $window, $q, $stateParams, pageType, initBrand, initTheme, ProductService, CONFIG, $state, ngDialog, localStorageService, initCategory, PropertiesService, sizesData, colorsData, brandsData, MetaService, initSize, Compare) {

	var activeCategory, 
		changeCategory, 
		childFirstLoad, 
		filter, 
		firstLoad, 
		getProducts, 
		getProductsbyfilter, 
		loadMore, 
		loadProducts, 
		orderList, 
		page_size, 
		popUp, 
		resetList, 
		setBrandsFilter, 
		setColorsFilter, 
		setCurrentOrder, 
		setSidebar,
		mainList = this;

	$("html,body").scrollTop(0);
	mainList.loading = true;
	mainList.showLoadMore = false;
	mainList.pagination = false;
	mainList.viewInfinite = true;
	mainList.noItem = false;
	mainList.pageType = pageType;

	mainList.viewSizeChart = function() {
        return ngDialog.open({
          template: '/app/product/list/html/popup/size_chart.html',
          className: "ngdialog-theme-oprent size-chart"
        });
    };

	mainList.viewPagination = function(pagination) {
		if (pagination) {
		  mainList.viewInfinite = false;
		  mainList.pagination = true;
		  mainList.showLoadMore = false;
		} else {
		  mainList.viewInfinite = true;
		  mainList.pagination = false;
		  mainList.showLoadMore = true;
		}
		mainList.loading = true;
		return resetList($scope.category);
	};

	$scope.category = {};
	mainList.colors = [];
	mainList.brands = [];
	mainList.products = [];
	mainList.sortValue = 'What\'s New';

	mainList.sortOptions = [
		{
		  'value': 'newest',
		  'name': 'What\'s New'
		}, {
		  'value': '-pricing',
		  'name': 'Price High to Low'
		}, {
		  'value': 'pricing',
		  'name': 'Price Low to High'
		}, {
		  'value': 'most_rented',
		  'name': 'Most Popular'
		}
	];

	mainList.changeOption = function(input) {
		mainList.loading = true;
		mainList.sortValue = input.name;
		mainList.showLoadMore = false;
		return mainList.getProductsbyfilter({
		  'order': input.value
		});
	};

	mainList.brand = '';
	if (initBrand) {
	  mainList.brand = initBrand;
	}

	mainList.totalItems = 0;
	mainList.totalPages = 0;
	loadMore = 1;
	page_size = 20;
	mainList.maxPageItem = page_size;

	mainList.results = {
		brands: false,
		category: false,
		color: false,
		location: false,
		search: false,
		size: false,
		tags: false,
		theme: false,
		brandsParams: [],
		colorsParams: []
	};

	popUp = {
		min_price: '',
		max_price: '',
		minSlider: '',
		maxSlider: '',
		brands: false,
		collect: true,
		delivery: true,
		order: 'newest',
		colors: '',
		brandsParams: [],
		colorsParams: []
	};

	mainList.shippingMethod = {
		collect: true,
		delivery: true
	};

	filter = {
		page: 1,
		page_size: page_size
	};

	$scope.order = 'newest';

	orderList = {
		'newest': 'Newest',
		'pricing': 'Price High to Low',
		'-pricing': 'Price Low to High',
		'most_rented': 'Most Popular'
	};

	mainList.currentOrder = orderList[$scope.order];
	mainList.colors = colorsData;
	popUp.colors = colorsData;
	mainList.brands = brandsData;
	popUp.brands = brandsData;
	mainList.sizes = sizesData;
	popUp.sizes = sizesData;

	if (!$stateParams.brands) {
	    mainList.brands = brandsData;
	    popUp.brands = brandsData;
	}

	setBrandsFilter = function(brandsList) {
		var b, bI, brandsId, j, k, l, len, len1, len2, len3, len4, m, n, ref1;
		popUp.brandsParams = new Array();
		if (filter.brands) {
		  brandsId = filter.brands.split(',');
		  for (j = 0, len = brandsId.length; j < len; j++) {
		    bI = brandsId[j];
		    ref1 = mainList.brands;
		    for (k = 0, len1 = ref1.length; k < len1; k++) {
		      b = ref1[k];
		      if (parseInt(bI) === parseInt(b.id)) {
		        popUp.brandsParams.push({
		          "id": b.id,
		          "name": b.name
		        });
		      }
		    }
		  }
		  for (l = 0, len2 = brandsList.length; l < len2; l++) {
		    b = brandsList[l];
		    b.checked = false;
		    for (m = 0, len3 = brandsId.length; m < len3; m++) {
		      bI = brandsId[m];
		      if (parseInt(bI) === parseInt(b.id)) {
		        b.checked = true;
		      }
		    }
		  }
		} else {
		  for (n = 0, len4 = brandsList.length; n < len4; n++) {
		    b = brandsList[n];
		    b.checked = false;
		  }
		}
	};

	setColorsFilter = function(colorsList) {
		var c, cI, colorsId, j, k, l, len, len1, len2, len3, len4, m, n, ref1;
		popUp.colorsParams = new Array();
		if (filter.color) {
		  colorsId = filter.color.split(',');
		  for (j = 0, len = colorsId.length; j < len; j++) {
		    cI = colorsId[j];
		    ref1 = mainList.colors;
		    for (k = 0, len1 = ref1.length; k < len1; k++) {
		      c = ref1[k];
		      if (parseInt(cI) === parseInt(c.id)) {
		        popUp.colorsParams.push({
		          "id": c.id,
		          "name": c.name
		        });
		      }
		    }
		  }
		  for (l = 0, len2 = colorsList.length; l < len2; l++) {
		    c = colorsList[l];
		    c.checked = false;
		    for (m = 0, len3 = colorsId.length; m < len3; m++) {
		      cI = colorsId[m];
		      if (parseInt(cI) === parseInt(c.id)) {
		        c.checked = true;
		      }
		    }
		  }
		  mainList.results.colorsParams = popUp.colorsParams;
		} else {
		  for (n = 0, len4 = colorsList.length; n < len4; n++) {
		    c = colorsList[n];
		    c.checked = false;
		  }
		}
	};
	
	activeCategory = '';
	if (initCategory) {
		mainList.results.category = initCategory.name;
		$scope.category = initCategory;
		$scope.activeCategory = initCategory.id;
		activeCategory = initCategory.id;
		mainList.categoryName = initCategory.name;
		if ($scope.category.banner_url === null) {
		  $scope.category.banner_url = '/assets/images/placeholder.jpg';
		}
		filter['category'] = initCategory.id;
		mainList.sliderMin = initCategory.minimum_price;
		mainList.sliderMax = initCategory.maximum_price;
		popUp.min_price = initCategory.minimum_price;
		popUp.max_price = initCategory.maximum_price;
		popUp.minSlider = initCategory.minimum_price;
		popUp.maxSlider = initCategory.maximum_price;
		MetaService.set(initCategory.name, "", "website", initCategory.name, '');
		$rootScope.metaservice = MetaService;
		mainList.loadFilter = {
		  slider: [parseInt(mainList.sliderMin), parseInt(mainList.sliderMax)],
		  min_price: '£' + parseInt(initCategory.minimum_price),
		  max_price: '£' + parseInt(initCategory.maximum_price)
		};
	} else {
		mainList.results.category = '';
	}

	getProducts = function(filter, flag) {
		var urlParams;
		return ProductService.getRawList(filter).then(function(data) {
		  var j, len, product_load, ref1;
		  mainList.loading = false;
		  mainList.totalItems = data.count;
		  mainList.totalPages = Math.ceil(data.count / mainList.maxPageItem);

		  if (data && data.results.length) {
		  	
		    if ($stateParams.brands) {
		      mainList.results.brandsParams = popUp.brandsParams;
		      mainList.results.brandsParams.push({
		        id: initBrand.id,
		        name: data.results[0].item.brand.name
		      });
		      MetaService.set(data.results[0].item.brand.name, "", "website", data.results[0].item.brand.name, "");
		      $rootScope.metaservice = MetaService;
		    }

		    data.results = data.results.map(function(jid) {
		      if (jid.item !== null) {
		        if (jid.item.images.length > 0) {
		          jid.item.img_primary = jid.item.images.filter(function(img) {
		            return img.is_primary;
		          });
		          jid.item.img_secondary = jid.item.images.filter(function(img) {
		            return img.is_secondary;
		          });
		          if (jid.item.img_primary.length > 0) {
		            jid.item.img_primary = jid.item.img_primary[0];
		          } else {
		            jid.item.img_primary = jid.item.images[0];
		          }
		          if (jid.item.img_secondary.length > 0) {
		            jid.item.img_secondary = jid.item.img_secondary[0];
		          } else {
		            jid.item.img_secondary = jid.item.images[0];
		          }
		          return jid;
		        }
		      } else {
		        return jid;
		      }
		    });

		    if (mainList.products.length > 0) {
		      ref1 = data.results;
		      for (j = 0, len = ref1.length; j < len; j++) {
		        product_load = ref1[j];
		        mainList.products.push(product_load);
		      }
		    } else {
		      mainList.products = data.results;
		    }

		    if (mainList.viewInfinite) {
		      if (loadMore * page_size < data.count) {
		        mainList.showLoadMore = true;
		      } else {
		        mainList.showLoadMore = false;
		      }
		    }

		    if (data.count === 0) {
		      mainList.noItem = true;
		    } else {
		      $scope.noItem = false;
		    }

		  } else {
		    mainList.products = false;
		    mainList.showLoadMore = false;
		    mainList.noItem = true;
		  }

		  if (mainList.products.length > 0) {
		    mainList.products = mainList.products.map(function(jid) {
		      if (jid.item !== null) {
		        jid.item.rent_prices.sort(Compare._values);
		        return jid;
		      }
		    });
		  }

		  $scope.changePage = 1;
		  if (flag === 1) {
		    return $("html,body,#products-list").scrollTop($("html,body,#products-list")[0].scrollHeight);
		  }
		}, function(err) {
		  return mainList.showLoadMore = false;
		});
	};

	loadProducts = function(filter, flag) {
		var newFilter;
		newFilter = angular.copy(filter);
		if (newFilter.hasOwnProperty('shipping') && (newFilter.shipping === void 0 || newFilter.shipping === '')) {
		  delete newFilter['shipping'];
		}
		if (newFilter.hasOwnProperty('color') && (newFilter.color === void 0 || newFilter.color === '')) {
		  delete newFilter['color'];
		}
		if (newFilter.hasOwnProperty('brands') && (newFilter.brands === void 0 || newFilter.brands === '')) {
		  delete newFilter['brands'];
		}
		if (newFilter.hasOwnProperty('size') && (newFilter.size === void 0 || newFilter.size === '')) {
		  delete newFilter['size'];
		} else if (newFilter.hasOwnProperty('size') && newFilter['size'].length > 0 && !$stateParams.size) {
		  newFilter['size'] = newFilter['size'].join();
		} else if ($stateParams.size) {
		  newFilter['size'] = initSize;
		}
		mainList.noItem = false;
		if (flag === 'undefined' || flag !== 1) {
		  $scope.changePage = 0;
		  getProducts(newFilter, flag);
		} else {
		  console.log("other flag");
		}
	};

	childFirstLoad = function(params) {
		ProductService.getPriceRange(params).then(function(data) {
		  mainList.sliderMin = data.stats.min_price;
		  mainList.sliderMax = data.stats.max_price;
		  popUp.min_price = data.stats.min_price;
		  popUp.max_price = data.stats.max_price;
		  popUp.minSlider = data.stats.min_price;
		  popUp.maxSlider = data.stats.max_price;
		  return mainList.loadFilter = {
		    slider: [parseInt(mainList.sliderMin), parseInt(mainList.sliderMax)],
		    min_price: '£' + parseInt(data.stats.min_price),
		    max_price: '£' + parseInt(data.stats.max_price)
		  };
		});
		return loadProducts(params);
	};

	firstLoad = function() {
		if ($stateParams.brands) {
			mainList.results.brands = true;
			filter['brands'] = initBrand.id;
		}
		if (initSize) {
			filter['size'] = initSize;
			mainList.results.size = initSize;
		}
		if ($stateParams.tags) {
			mainList.results.tags = $stateParams.tags;
			filter['tags'] = $stateParams.tags;
			MetaService.set("#" + $stateParams.tags, "", "website", "#" + $stateParams.tags, '');
			$rootScope.metaservice = MetaService;
		}
		if ($stateParams.search) {
			mainList.results.search = true;
			mainList.results.keyword = $stateParams.search;
			filter['search'] = $stateParams.search;
		}
		if (initTheme) {
			filter['theme'] = initTheme;
			ProductService.getThemeDetail(initTheme).then(function(data) {
			  mainList.results['theme'] = data.name;
			  MetaService.set(data.name + " Theme", "", "website", data.name + " Theme", '');
			  return $rootScope.metaservice = MetaService;
			});
		}
		return childFirstLoad(filter);
	};

	mainList.getProductsbyfilter = function(data) {
		var b, c, j, k, len, len1, ref1, ref2;
		mainList.loading = true;
		loadMore = 1;
		mainList.products = [];
		mainList.totalItems = 0;
		filter['page'] = loadMore;
		filter['page_size'] = page_size;
		if (data) {
		  if (angular.isDefined(data.min_price)) {
		    filter['min_price'] = data.min_price.slice(1);
		  }
		  if (angular.isDefined(data.max_price)) {
		    filter['max_price'] = data.max_price.slice(1);
		  }
		}
		filter['shipping'] = void 0;
		if (mainList.shippingMethod) {
		  if (mainList.shippingMethod.collect && !mainList.shippingMethod.delivery) {
		    filter['shipping'] = 1;
		  }
		  if (!mainList.shippingMethod.collect && mainList.shippingMethod.delivery) {
		    filter['shipping'] = 3;
		  }
		  if (!mainList.shippingMethod.delivery && !mainList.shippingMethod.collect) {
		    filter['shipping'] = 0;
		  }
		  popUp['delivery'] = mainList.shippingMethod.delivery;
		  popUp['collect'] = mainList.shippingMethod.collect;
		}
		filter['color'] = [];
		ref1 = mainList.colors;
		for (j = 0, len = ref1.length; j < len; j++) {
		  c = ref1[j];
		  if (angular.element("#color_" + c.id + "").is(":checked")) {
		    filter['color'].push(c.id);
		  }
		}
		if (filter['color'].length) {
		  filter['color'] = filter['color'].join();
		} else {
		  filter['color'] = void 0;
		}
		filter['brands'] = [];
		ref2 = mainList.brands;
		for (k = 0, len1 = ref2.length; k < len1; k++) {
		  b = ref2[k];
		  if (angular.element("#brand_" + b.id + "").is(":checked")) {
		    filter['brands'].push(b.id);
		  }
		}
		if (filter['brands'].length) {
		  filter['brands'] = filter['brands'].join();
		} else {
		  filter['brands'] = void 0;
		}
		if (angular.isDefined(data.order)) {
		  filter['order'] = data.order;
		  popUp['order'] = data.order;
		  $scope.order = data.order;
		  mainList.currentOrder = orderList[$scope.order];
		}
		if (!mainList.results.brands) {
		  setBrandsFilter(mainList.brands);
		}
		setColorsFilter(mainList.colors);
		return loadProducts(filter);
	};

	mainList.getBySize = function(id, ref) {
		var j, len, ref1, s;
		filter['size'] = new Array();
		ref1 = mainList.sizes;
		for (j = 0, len = ref1.length; j < len; j++) {
		  s = ref1[j];
		  if (angular.element("#size_" + s.id + "").is(":checked")) {
		    filter['size'].push(s.reference);
		  }
		}
		return mainList.getProductsbyfilter(filter);
	};

	getProductsbyfilter = function(data) {
		mainList.products = [];
		return loadProducts(data);
	};

	setSidebar = function() {
		if (!mainList.results.brands) {
		  setBrandsFilter(mainList.brands);
		}
		setColorsFilter(mainList.colors);
		mainList.shippingMethod = {
		  collect: popUp.collect,
		  delivery: popUp.delivery
		};
		return $scope.popUp = {
		  slider: [parseInt(popUp.minSlider), parseInt(popUp.maxSlider)],
		  min_price: '£' + parseInt(popUp.minSlider),
		  max_price: '£' + parseInt(popUp.maxSlider),
		  order: popUp.order
		};
	};

	mainList.productLoadMore = function() {
		loadMore++;
		filter['page'] = loadMore;
		filter['page_size'] = page_size;
		mainList.showLoadMore = false;
		mainList.loading = true;
		return loadProducts(filter);
	};

	mainList.pn = {
		pageNumber: 1
	};

	mainList.next = function(pn) {
		var flag;
		mainList.loading = true;
		mainList.products = [];
		loadMore = 1;
		flag = 2;
		mainList.pn.pageNumber = pn;
		filter['page'] = pn;
		filter['page_size'] = page_size;
		return loadProducts(filter, flag);
	};

	resetList = function(category) {
		var data;
		filter['category'] = category.id;
		mainList.sliderMin = category.minimum_price;
		mainList.sliderMax = category.maximum_price;
		popUp.min_price = category.minimum_price;
		popUp.max_price = category.maximum_price;
		popUp.minSlider = category.minimum_price;
		popUp.maxSlider = category.maximum_price;
		mainList.loadFilter = {
		  slider: [parseInt(mainList.sliderMin), parseInt(mainList.sliderMax)],
		  min_price: '£' + parseInt(category.minimum_price),
		  max_price: '£' + parseInt(category.maximum_price)
		};
		data = {
		  'order': filter['order']
		};
		return mainList.getProductsbyfilter(data);
	};

	changeCategory = function(category) {
		mainList.categoryName = category.name;
		$scope.activeCategory = category.id;
		activeCategory = category.id;
		if (category.is_leaf === false && category.id !== initCategory.id) {
		  return $state.go('products-by-category', {
		    'category': category.slug
		  });
		} else {
		  mainList.loading = true;
		  mainList.showLoadMore = false;
		  MetaService.set(category.name, "", "website", category.name, '');
		  return resetList(category);
		}
	};

	$scope.changeCategory = function(category) {
		return changeCategory(category);
	};

	setCurrentOrder = function() {
		var data;
		data = {
		  'order': popUp['order']
		};
		mainList.currentOrder = orderList[$scope.order];
		return mainList.getProductsbyfilter(data);
	};

	mainList.sortByPopUp = function() {
		return ngDialog.open({
		  template: '/app/product/by-category/html/popup/sort_by.html',
		  className: "ngdialog-theme-oprent",
		  controller: [
		    '$scope', '$window', function($scope, $window) {
		      return $scope.sortBy = function(data) {
		        filter['order'] = data;
		        popUp['order'] = data;
		        $scope.closeThisDialog("true");
		      };
		    }
		  ]
		}).closePromise.then(function() {
		  return setCurrentOrder();
		});
	};

	mainList.categoriesPopUp = function() {
		return ngDialog.open({
		  template: '/app/product/list/html/popup/categories.html',
		  className: "ngdialog-theme-oprent",
		  controller: [
		    '$scope', '$window', function($scope, $window) {
		      $scope.category = initCategory;
		      $scope.activeCategory = activeCategory;
		      return $scope.changeCategory = function(category) {
		        changeCategory(category);
		        return $scope.closeThisDialog("true");
		      };
		    }
		  ]
		});
	};

	mainList.popUpFilter = function() {
		return ngDialog.open({
		  template: '/app/product/list/html/popup/filter.html',
		  className: "ngdialog-theme-oprent",
		  controller: [
		    '$scope', '$window', function($scope, $window) {
		      var firstLoadPopup;
		      firstLoadPopup = function() {
		        $scope.slider = {
		          'options': {
		            range: true,
		            start: function(event, ui) {
		              $log.info('Slider start');
		            },
		            stop: function(event, ui) {
		              $log.info('Slider stop');
		              $scope.popUp.min_price = '£' + ui.values[0];
		              $scope.popUp.max_price = '£' + ui.values[1];
		              popUp.minSlider = ui.values[0];
		              popUp.maxSlider = ui.values[1];
		              $scope.popUp.slider = [parseInt(ui.values[0]), parseInt(ui.values[1])];
		              $scope.popUpFilter($scope.popUp);
		            },
		            slide: function(event, ui) {
		              $('#min-price-pop').val('£' + ui.values[0]).trigger('input');
		              return $('#max-price-pop').val('£' + ui.values[1]).trigger('input');
		            }
		          }
		        };
		        $scope.sliderMin = popUp.min_price;
		        $scope.sliderMax = popUp.max_price;
		        $scope.shippingMethod = {
		          collect: popUp.collect,
		          delivery: popUp.delivery
		        };
		        $scope.popUp = {
		          slider: [parseInt(popUp.minSlider), parseInt(popUp.maxSlider)],
		          min_price: '£' + parseInt(popUp.minSlider),
		          max_price: '£' + parseInt(popUp.maxSlider)
		        };
		        $scope.brands = popUp.brands;
		        $scope.colors = popUp.colors;
		        $scope.sizes = popUp.sizes;
		        if ($stateParams.size) {
		          $scope.showSizes = false;
		        } else {
		          $scope.showSizes = true;
		        }
		        if (!$stateParams.brands) {
		          setBrandsFilter($scope.brands);
		        }
		        return setColorsFilter($scope.colors);
		      };
		      firstLoadPopup();
		      return $scope.popUpFilter = function(params) {
		        var b, c, j, k, len, len1, ref1, ref2;
		        $scope.products = [];
		        $scope.totalItems = 0;
		        filter['page'] = 1;
		        filter['page_size'] = page_size;
		        if (angular.isDefined(params.min_price)) {
		          filter['min_price'] = params.min_price.slice(1);
		        }
		        if (angular.isDefined(params.max_price)) {
		          filter['max_price'] = params.max_price.slice(1);
		        }
		        filter['shipping'] = void 0;
		        if ($scope.shippingMethod) {
		          if ($scope.shippingMethod.collect && !$scope.shippingMethod.delivery) {
		            filter['shipping'] = 1;
		          }
		          if ($scope.shippingMethod.delivery && !$scope.shippingMethod.collect) {
		            filter['shipping'] = 3;
		          }
		          if (!$scope.shippingMethod.delivery && !$scope.shippingMethod.collect) {
		            filter['shipping'] = 0;
		          }
		          popUp['delivery'] = $scope.shippingMethod.delivery;
		          popUp['collect'] = $scope.shippingMethod.collect;
		        }
		        filter['color'] = [];
		        ref1 = $scope.colors;
		        for (j = 0, len = ref1.length; j < len; j++) {
		          c = ref1[j];
		          if (angular.element("#color_pop" + c.id + "").is(":checked")) {
		            filter['color'].push(c.id);
		          }
		        }
		        if (filter['color'].length) {
		          filter['color'] = filter['color'].join();
		        } else {
		          filter['color'] = void 0;
		        }
		        filter['brands'] = [];
		        ref2 = $scope.brands;
		        for (k = 0, len1 = ref2.length; k < len1; k++) {
		          b = ref2[k];
		          if (angular.element("#brand_pop" + b.id + "").is(":checked")) {
		            filter['brands'].push(b.id);
		          }
		        }
		        if (filter['brands'].length) {
		          filter['brands'] = filter['brands'].join();
		        } else {
		          filter['brands'] = void 0;
		        }
		        return getProductsbyfilter(filter);
		      };
		    }
		  ]
		}).closePromise.then(function() {
		  return setSidebar();
		});
	};

	mainList.slider = {
		'options': {
		  range: true,
		  step: 1,
		  start: function(event, ui) {
		    $log.info('Slider start');
		  },
		  stop: function(event, ui) {
		    $log.info('Slider stop');
		    mainList.loadFilter.min_price = '£' + parseInt(ui.values[0]);
		    mainList.loadFilter.max_price = '£' + parseInt(ui.values[1]);
		    mainList.loadFilter.slider = [parseInt(ui.values[0]), parseInt(ui.values[1])];
		    popUp.minSlider = ui.values[0];
		    popUp.maxSlider = ui.values[1];
		    mainList.getProductsbyfilter(mainList.loadFilter);
		  },
		  slide: function(event, ui) {
		    $('#min-price').val('£' + parseInt(ui.values[0])).trigger('input');
		    return $('#max-price').val('£' + parseInt(ui.values[1])).trigger('input');
		  }
		}
	};

	return firstLoad();
}

})();
