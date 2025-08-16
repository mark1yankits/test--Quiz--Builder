"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateQuizDto = exports.CreateQuestionDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class CreateQuestionDto {
    text;
    type;
    options;
    correctAnswers;
}
exports.CreateQuestionDto = CreateQuestionDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Question text cannot be empty' }),
    (0, class_validator_1.MinLength)(3, { message: 'Question text must be at least 3 characters long' }),
    (0, class_validator_1.MaxLength)(500, { message: 'Question text cannot exceed 500 characters' }),
    __metadata("design:type", String)
], CreateQuestionDto.prototype, "text", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Question type cannot be empty' }),
    __metadata("design:type", String)
], CreateQuestionDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.ArrayMinSize)(1, { message: 'There must be at least 1 option' }),
    __metadata("design:type", Array)
], CreateQuestionDto.prototype, "options", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.ArrayMinSize)(1, { message: 'There must be at least 1 correct answer' }),
    __metadata("design:type", Array)
], CreateQuestionDto.prototype, "correctAnswers", void 0);
class CreateQuizDto {
    title;
    questions;
}
exports.CreateQuizDto = CreateQuizDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Quiz title cannot be empty' }),
    (0, class_validator_1.MinLength)(3, { message: 'Quiz title must be at least 3 characters long' }),
    (0, class_validator_1.MaxLength)(100, { message: 'Quiz title cannot exceed 100 characters' }),
    __metadata("design:type", String)
], CreateQuizDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateQuestionDto),
    (0, class_validator_1.ArrayMinSize)(1, { message: 'Quiz must contain at least 1 question' }),
    __metadata("design:type", Array)
], CreateQuizDto.prototype, "questions", void 0);
//# sourceMappingURL=create-quiz.dto.js.map