"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./index.css");
const react_1 = __importDefault(require("react"));
class AccountManagement extends react_1.default.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            hidden: [],
            items: []
        };
    }
    render() {
        return (<main className='accounts--App'>
        account management
      </main>);
    }
}
exports.AccountManagement = AccountManagement;
