"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.UpdateArticleDto = exports.FindAll = exports.CreateArticleDto = void 0;
var openapi = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
var mapped_types_1 = require("@nestjs/mapped-types");
var CreateArticleDto = /** @class */ (function () {
    function CreateArticleDto() {
    }
    CreateArticleDto._OPENAPI_METADATA_FACTORY = function () {
        return { title: { required: true, type: function () { return String; }, minLength: 3, maxLength: 256 }, content: { required: true, type: function () { return String; } } };
    };
    __decorate([
        (0, class_validator_1.IsNotEmpty)(),
        (0, class_validator_1.Length)(3, 256)
    ], CreateArticleDto.prototype, "title");
    __decorate([
        (0, class_validator_1.IsNotEmpty)()
    ], CreateArticleDto.prototype, "content");
    return CreateArticleDto;
}());
exports.CreateArticleDto = CreateArticleDto;
var FindAll = /** @class */ (function () {
    function FindAll() {
        this.skip = 0;
        this.take = 5;
        this.keyword = '';
    }
    FindAll._OPENAPI_METADATA_FACTORY = function () {
        return { skip: { required: true, type: function () { return Number; }, "default": 0 }, take: { required: true, type: function () { return Number; }, "default": 5 }, keyword: { required: true, type: function () { return String; }, "default": '' } };
    };
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsNumber)(),
        (0, class_transformer_1.Type)(function () { return Number; })
    ], FindAll.prototype, "skip");
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsNumber)(),
        (0, class_transformer_1.Type)(function () { return Number; })
    ], FindAll.prototype, "take");
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_transformer_1.Type)(function () { return String; })
    ], FindAll.prototype, "keyword");
    return FindAll;
}());
exports.FindAll = FindAll;
var UpdateArticleDto = /** @class */ (function (_super) {
    __extends(UpdateArticleDto, _super);
    function UpdateArticleDto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UpdateArticleDto._OPENAPI_METADATA_FACTORY = function () {
        return {};
    };
    return UpdateArticleDto;
}((0, mapped_types_1.PartialType)(CreateArticleDto)));
exports.UpdateArticleDto = UpdateArticleDto;
