(function () {
"use strict";

angular.module('oprent.products')
.config(Config);
/*
    Information Of pageType (property of resolve)
    1 : products-by-brand 
    2 : products-list
    3 : products-by-category
    4 : products-editorial
*/

Config.$inject = ['$stateProvider'];
function Config($stateProvider) {
  var init_category1, init_category2, sizes_data, colors_data, brands_data, init_brand, init_size, init_theme;

  init_category1 = [
    "CategoryService", "$stateParams", "$rootScope", "MetaService", function(CategoryService, $stateParams, $rootScope, MetaService) {
        var params;
        if ($stateParams.category) {
          console.log("ada $stateParams");
          params = $stateParams.category;
          if ($stateParams.category.indexOf('__') > -1) {
            params = $stateParams.category.split('__').pop(-1);
          }
          return CategoryService.get(params).then(function(data) {
            MetaService.set(data.name, "", "website", data.name, '');
            $rootScope.metaservice = MetaService;
            return data;
          });
        } else {
          console.log("tidak ada $stateParams");
          return false;
        }
      }
  ];

  init_category2 = [
    "CategoryService", "$stateParams", "$rootScope", "MetaService", function(CategoryService, $stateParams, $rootScope, MetaService) {
        if ($stateParams.category) {
          return CategoryService.getSlug($stateParams.category).then(function(data) {
            MetaService.set(data.name, "", "website", data.name, '');
            $rootScope.metaservice = MetaService;
            return data[0];
          });
        } else {
          return false;
        }
    }
  ];

  sizes_data = [
    "PropertiesService", function(PropertiesService) {
        return PropertiesService.getSize().then(function(data) {
          return data;
        });
    }
  ];

  colors_data = [
    "ProductService", function(ProductService) {
        return ProductService.getColors().then(function(data) {
          return data.objects;
        });
    }
  ];

  brands_data = [
    "ProductService", function(ProductService) {
        return ProductService.getBrands().then(function(data) {
          return data.results;
        });
    }
  ];

  init_brand = [
    "$stateParams", "BrandService", function($stateParams, BrandService) {
        var brand, brands;
        brand = '';
        if ($stateParams.brands) {
          console.log("brands param is exist : "+$stateParams.brands);
          if ($stateParams.brands.indexOf('__') > -1) {
            brands = $stateParams.brands.split('__').pop(-1);
            return brand;
          } else {
            return BrandService.getDetail($stateParams.brands).then(function(data) {
              return data[0];
            });
          }
        }
    }
  ];

  init_size = [
    "$stateParams", "ProductService", function($stateParams, ProductService) {
        if ($stateParams.size) {
          return $stateParams.size;
        } else {
          return false;
        }
    }
  ];

  init_theme = [
    "$stateParams", "ProductService", function($stateParams, ProductService) {
        var theme;
        theme = '';
        if ($stateParams.theme) {
          if ($stateParams.theme.indexOf('__') > -1) {
            theme = $stateParams.theme.split('__').pop();
            return theme;
          } else {
            return ProductService.getThemeBySlug($stateParams.theme).then(function(data) {
              return data[0].id;
            });
          }
        }
    }
  ];


  $stateProvider

    .state('product-add-preview', {
        url: "/product/add/preview/",
        views: {
          "navbar": {
            templateUrl: "/app/navbar/html/templates/main-navbar.template.html"
          },
          "": {
            templateUrl: "/app/product/add/html/preview/preview.html",
            controller: "ProductPreviewCtrl"
          },
          "footer": {
            templateUrl: "/app/footer/html/footer.html"
          }
        },
        authenticate: true,
        conciergeMember: true,
        pageTitle: "Product Add Preview"
    })

    .state('products', {
        url: "/products?category&size&color&min_price&max_price&shipping&brands&display&order_list&tags&search&location&theme?",
        resolve: {
          pageType: function() { return 1; }, 
          initCategory: init_category1,
          sizesData: sizes_data,
          colorsData: colors_data,
          brandsData: brands_data,    
          initBrand: init_brand,
          initSize: init_size,
          initTheme: init_theme
        },
        views: {
          "navbar": {
            templateUrl: "/app/navbar/html/templates/main-navbar.template.html"
          },
          "": {
            templateUrl: "/app/product/list/html/templates/main-productlist.template.html",
            controller: "ProductsListController as mainList"
          },
          "footer": {
            templateUrl: "/app/footer/html/footer.html"
          }
        },
        authenticate: true,
        pageTitle: "Products"
    })

    .state('products-new', {
        url: "/rent/whats-new/?category&size&color&min_price&max_price&shipping&brands&display&order_list&tags&search&location&theme?",
        resolve: {
          pageType: function() { return 2; },
          initCategory: init_category1,
          sizesData: sizes_data,
          colorsData: colors_data,
          brandsData: brands_data,    
          initBrand: init_brand,
          initSize: init_size,
          initTheme: init_theme
        },
        views: {
          "navbar": {
            templateUrl: "/app/navbar/html/templates/main-navbar.template.html"
          },
          "": {
            templateUrl: "/app/product/list/html/templates/main-productlist.template.html",
            controller: "ProductsListController as mainList"
          },
          "footer": {
            templateUrl: "/app/footer/html/footer.html"
          }
        },
        authenticate: true,
        pageTitle: "Products"
    })

    .state('products-by-category', {
        url: "/rent-designer-{category}/?size&color&min_price&max_price&shipping&brands&order_list?",
        resolve: {
          pageType: function() { return 3; },
          initCategory: init_category2,
          sizesData: sizes_data,
          colorsData: colors_data,
          brandsData: brands_data,    
          initBrand: init_brand,
          initSize: init_size,
          initTheme: init_theme
        },
        views: {
          "navbar": {
            templateUrl: "/app/navbar/html/templates/main-navbar.template.html"
          },
          "": {
            templateUrl: "/app/product/by-category/html/templates/main-productcategory.template.html",
            controller: "ProductsListController as mainList"
          },
          "footer": {
            templateUrl: "/app/footer/html/footer.html"
          }
        },
        authenticate: false,
        pageTitle: "Products"
    })

    .state('products-editorial', {
        url: "/editorial/:theme/",
        resolve: {
          pageType: function() { return 4; },
          initCategory: init_category1,
          sizesData: sizes_data,
          colorsData: colors_data,
          brandsData: brands_data,    
          initBrand: init_brand,
          initSize: init_size,
          initTheme: init_theme
        },
        views: {
          "navbar": {
            templateUrl: "/app/navbar/html/templates/main-navbar.template.html"
          },
          "": {
            templateUrl: "/app/product/list/html/templates/main-productlist.template.html",
            controller: "ProductsListController as mainList"
          },
          "footer": {
            templateUrl: "/app/footer/html/footer.html"
          }
        },
        authenticate: true,
        pageTitle: "Editorial"
    })

    .state('products-detail-inquiry', {
        url: "/products/inquiry/{productId:int}/",
        views: {
          "navbar": {
            templateUrl: "/app/navbar/html/templates/main-navbar.template.html"
          },
          "": {
            templateUrl: "/app/product/detail/html/inquiry.html",
            controller: "ProductDetailInquiryCtrl"
          },
          "footer": {
            templateUrl: "/app/footer/html/footer.html"
          }
        },
        authenticate: true,
        pageTitle: "Product Detail Inquiry"
    });
}

})();
