"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
exports.__esModule = true;
exports.ArticlesController = void 0;
var openapi = require("@nestjs/swagger");
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var ArticlesController = /** @class */ (function () {
    function ArticlesController(articlesService) {
        this.articlesService = articlesService;
    }
    ArticlesController.prototype.create = function (createArticleDto) {
        return this.articlesService.create(createArticleDto);
    };
    ArticlesController.prototype.findAll = function (query) {
        return this.articlesService.findAll(query);
    };
    ArticlesController.prototype.findOne = function (params) {
        var id = params.id;
        return this.articlesService.findOne(id);
    };
    ArticlesController.prototype.update = function (params, updateArticleDto) {
        var id = params.id;
        return this.articlesService.update(id, updateArticleDto);
    };
    ArticlesController.prototype.remove = function (params) {
        var id = params.id;
        return this.articlesService.remove(id);
    };
    __decorate([
        (0, common_1.Post)(),
        openapi.ApiResponse({ status: 201, type: require("./schemas/article.schema").Article }),
        __param(0, (0, common_1.Body)())
    ], ArticlesController.prototype, "create");
    __decorate([
        (0, common_1.Get)(),
        openapi.ApiResponse({ status: 200, type: [require("./schemas/article.schema").Article] }),
        __param(0, (0, common_1.Query)())
    ], ArticlesController.prototype, "findAll");
    __decorate([
        (0, common_1.Get)(':id'),
        openapi.ApiResponse({ status: 200, type: require("./schemas/article.schema").Article }),
        __param(0, (0, common_1.Param)())
    ], ArticlesController.prototype, "findOne");
    __decorate([
        (0, common_1.Patch)(':id'),
        openapi.ApiResponse({ status: 200, type: require("./schemas/article.schema").Article }),
        __param(0, (0, common_1.Param)()),
        __param(1, (0, common_1.Body)())
    ], ArticlesController.prototype, "update");
    __decorate([
        (0, common_1.Delete)(':id'),
        openapi.ApiResponse({ status: 200 }),
        __param(0, (0, common_1.Param)())
    ], ArticlesController.prototype, "remove");
    ArticlesController = __decorate([
        (0, common_1.Controller)('api/articles'),
        (0, swagger_1.ApiTags)('articles')
    ], ArticlesController);
    return ArticlesController;
}());
exports.ArticlesController = ArticlesController;
