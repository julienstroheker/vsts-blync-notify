// Constructor
function Vstspayload(payload) {
    // always initialize all instance properties
    this.id = payload.id;
    this.eventType = payload.eventType;
    this.msg = payload.detailedMessage.text;
  }
  // export the class
  module.exports = Vstspayload;