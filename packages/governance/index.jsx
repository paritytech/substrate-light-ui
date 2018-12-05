"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./index.css");
const react_1 = __importDefault(require("react"));
class Governance extends react_1.default.PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (<main className='governance--App'>
        Governance
      </main>);
    }
}
exports.Governance = Governance;
