(function(window) {
  window["env"] = window["env"] || {};

  // Environment variables
  window["env"]["server"] = "${SERVER}";
  window["env"]["dbServer"] = "${DB_SERVER}";
})(this);
