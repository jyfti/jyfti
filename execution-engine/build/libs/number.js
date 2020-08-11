"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomNumber = void 0;
function randomNumber() {
    // random from 1 to 100
    return Math.floor(Math.random() * 99) + 1;
}
exports.randomNumber = randomNumber;
