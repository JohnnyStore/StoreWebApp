var serviceInvoke = require('../common/serviceInvokeUtils');
var sysConfig = require('../config/sysConfig');
var apiConfig = require('../config/apiConfig');
var pagingUtils = require('../common/commonUtils');

exports.commonInvoke = function(apiName) {
  this.pageSize = sysConfig.pageSize;
  this.host = apiConfig.StoreService.host;
  this.port = apiConfig.StoreService.port;
  this.path = apiConfig.StoreService.path[apiName];
  this.getPageData = function (pageNumber, callback) {
    serviceInvoke.get(this.host, this.port, this.path + '/' + pageNumber + '/' + this.pageSize, callback)
  };
  this.getAll = function (callback) {
    serviceInvoke.get(this.host, this.port, this.path + '/' + 1 + '/' + 9999, callback)
  };
  this.get = function (param, callback) {
    serviceInvoke.get(this.host, this.port, this.path + '/' + param, callback)
  };
  this.add = function (data, callback) {
    serviceInvoke.post(data, this.host, this.port, this.path, callback);
  };
  this.change = function (data, callback) {
    serviceInvoke.put(data, this.host, this.port, this.path, callback);
  };
  this.delete = function (id, callback) {
    serviceInvoke.delete(this.host, this.port, this.path + '/' + id, callback);
  }
};

