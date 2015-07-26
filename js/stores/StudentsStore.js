(function() {
  var dispatcher = new Dispatcher();

  function StudentsStorage() {
    this._students = [];
  }

  StudentsStorage.prototype.load = function () {
    var me = this;
    User.load(function (err, list) {
      if (err) {
        alert('Ошибка загрузки списка студентов');
        return;
      }
      list.forEach(function (record) {
        if (record instanceof Student) {
          me._students.push(record);
        }

      });
      dispatcher.fire('student:listLoadSaved', me._students);
    });
  };

  window.StudentsStorage = StudentsStorage;
})();





