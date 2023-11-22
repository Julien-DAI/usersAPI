"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.addUser = exports.getUserById = exports.listUsers = void 0;
const db = __importStar(require("zapatos/db"));
const pgPool_1 = __importDefault(require("../db/pgPool"));
const staticUsers = [
    {
        id: 1,
        name: 'Joyce Byers'
    },
    {
        id: 2,
        name: 'Chuck Norris'
    },
    {
        id: 3,
        name: 'Bruce Wayne'
    },
    {
        id: 4,
        name: 'The Rock'
    }
];
const listUsers = async (request, reply) => {
    return db.sql `SELECT * FROM ${"users"}`
        .run(pgPool_1.default)
        .then((users) => ({ data: users }));
    // Or .then((users) => reply.send({ data: users }))
};
exports.listUsers = listUsers;
const getUserById = async (request, reply) => {
    Promise.resolve(staticUsers)
        .then((users) => {
        const userId = request.params.id;
        const user = users.find((u) => u.id == userId);
        if (!user) {
            reply.code(404).send({ error: 'Utilisateur non trouvé' });
        }
        reply.send({ data: user });
    });
};
exports.getUserById = getUserById;
const addUser = async (request, // Assuming you're sending user data in the request body
reply) => {
    try {
        const newUser = {
            id: staticUsers.length + 1,
            name: request.body.name,
        };
        staticUsers.push(newUser);
        reply.code(201).send({ data: newUser });
    }
    catch (error) {
        reply.code(500).send({ error: 'Internal Server Error' });
    }
};
exports.addUser = addUser;
const updateUser = async (request, reply) => {
    try {
        const userId = parseInt(request.params.id, 10);
        const userIndex = staticUsers.findIndex((u) => u.id === userId);
        if (userIndex === -1) {
            reply.code(404).send({ error: 'Utilisateur non trouvé' });
            return;
        }
        staticUsers[userIndex].score = request.body.score;
        reply.send({ data: staticUsers[userIndex] });
    }
    catch (error) {
        reply.code(500).send({ error: 'Internal Server Error' });
    }
};
exports.updateUser = updateUser;
//# sourceMappingURL=user.controller.js.map