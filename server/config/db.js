const fs = require('fs');
const path = require('path');

// Use /tmp for serverless environments like Vercel because the standard filesystem is read-only
const DB_PATH = process.env.VERCEL ? '/tmp/db.json' : path.join(__dirname, '../db.json');

// Initialize db.json if not exists
if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, JSON.stringify({ users: [], tasks: [], notifications: [] }, null, 2));
}

function readData() {
  try {
    const content = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Error reading db.json:', error);
    return { users: [], tasks: [], notifications: [] };
  }
}

function writeData(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing db.json:', error);
  }
}

function generateId() {
  return Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
}

class Query {
  constructor(results, collectionName) {
    this.results = results;
    this.collectionName = collectionName;
  }

  populate(field, select) {
    const data = readData();
    const selectFields = select ? select.split(' ') : [];
    
    this.results = this.results.map(item => {
      const cloned = { ...item };
      const targetId = cloned[field];
      if (targetId) {
        const user = data.users.find(u => u._id === targetId.toString() || u.firebaseUid === targetId.toString());
        if (user) {
          const populatedUser = {};
          if (selectFields.length > 0) {
            selectFields.forEach(f => {
              populatedUser[f] = user[f];
            });
            populatedUser._id = user._id;
          } else {
            Object.assign(populatedUser, user);
          }
          cloned[field] = populatedUser;
        }
      }
      return cloned;
    });
    return this;
  }

  sort(sortObj) {
    const keys = Object.keys(sortObj);
    if (keys.length > 0) {
      const key = keys[0];
      const order = sortObj[key]; // 1 or -1
      this.results.sort((a, b) => {
        const valA = a[key];
        const valB = b[key];
        if (valA instanceof Date || (typeof valA === 'string' && Date.parse(valA))) {
          return order === -1 ? new Date(valB) - new Date(valA) : new Date(valA) - new Date(valB);
        }
        return order === -1 ? (valB > valA ? 1 : -1) : (valA > valB ? 1 : -1);
      });
    }
    return this;
  }

  // Support thenable / Promise execution
  then(onFulfilled, onRejected) {
    return Promise.resolve(this.results).then(onFulfilled, onRejected);
  }
}

class MockModel {
  constructor(collectionName, data = {}) {
    this._collectionName = collectionName;
    Object.assign(this, data);
  }

  async save() {
    const data = readData();
    const collection = data[this._collectionName];
    
    if (!this._id) {
      this._id = generateId();
      this.createdAt = new Date().toISOString();
      const plainObj = { ...this };
      delete plainObj._collectionName;
      collection.push(plainObj);
      Object.assign(this, plainObj);
    } else {
      const index = collection.findIndex(item => item._id === this._id);
      const plainObj = { ...this };
      delete plainObj._collectionName;
      if (index !== -1) {
        collection[index] = plainObj;
      } else {
        collection.push(plainObj);
      }
    }
    
    writeData(data);
    return this;
  }

  static find(filter = {}) {
    const data = readData();
    let results = data[this.collectionName] || [];
    
    if (filter) {
      results = results.filter(item => {
        // Handle $or filters
        if (filter.$or) {
          return filter.$or.some(subFilter => {
            return Object.keys(subFilter).every(key => {
              const val = item[key];
              const filterVal = subFilter[key];
              return val && val.toString() === filterVal.toString();
            });
          });
        }
        
        // General filter properties
        return Object.keys(filter).every(key => {
          const val = item[key];
          const filterVal = filter[key];
          if (val === undefined || filterVal === undefined) return false;
          return val.toString() === filterVal.toString();
        });
      });
    }
    
    return new Query(results, this.collectionName);
  }

  static async findOne(filter = {}) {
    const data = readData();
    const collection = data[this.collectionName] || [];
    const found = collection.find(item => {
      return Object.keys(filter).every(key => {
        const val = item[key];
        const filterVal = filter[key];
        if (val === undefined || filterVal === undefined) return false;
        return val.toString() === filterVal.toString();
      });
    });
    
    if (found) {
      return new this(found);
    }
    return null;
  }

  static async findById(id) {
    if (!id) return null;
    return this.findOne({ _id: id });
  }

  static async findByIdAndUpdate(id, updates, options = {}) {
    const data = readData();
    const collection = data[this.collectionName] || [];
    const index = collection.findIndex(item => item._id === id.toString());
    if (index === -1) return null;

    const updatedItem = { ...collection[index], ...updates };
    collection[index] = updatedItem;
    writeData(data);

    return new this(updatedItem);
  }

  static async findByIdAndDelete(id) {
    const data = readData();
    const collection = data[this.collectionName] || [];
    const index = collection.findIndex(item => item._id === id.toString());
    if (index === -1) return null;

    const deleted = collection.splice(index, 1)[0];
    writeData(data);
    return new this(deleted);
  }
}

class User extends MockModel {
  static collectionName = 'users';
  constructor(data) {
    super('users', data);
  }
}

class Task extends MockModel {
  static collectionName = 'tasks';
  constructor(data) {
    super('tasks', data);
  }
}

class Notification extends MockModel {
  static collectionName = 'notifications';
  constructor(data) {
    super('notifications', data);
  }
}

class Schema {
  constructor() {}
}
Schema.Types = {
  ObjectId: String
};

const mongooseMock = {
  Schema: Schema,
  model: function(name) {
    if (name === 'User') return User;
    if (name === 'Task') return Task;
    if (name === 'Notification') return Notification;
    return MockModel;
  },
  connect: async function() {
    console.log('✅ Connected successfully to file-based JSON Database (db.json)');
    return true;
  },
  Types: {
    ObjectId: String
  }
};

module.exports = mongooseMock;
